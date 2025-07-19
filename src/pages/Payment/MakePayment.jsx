import React, { useState, useEffect, useContext } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2"; // Import SweetAlert2
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MakePayment = () => {
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useContext(AuthContext);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState("");
	const subscriptionPeriod = location.state?.subscriptionPeriod || "1min";
	const amount = location.state?.amount || 99;
	const axiosInstance = useAxios();
	const axiosSecure = useAxiosSecure();
	const { updatePremiumStatus } = useContext(AuthContext);

	// After successful subscription
	updatePremiumStatus(true); // Set isPremium to true to reflect in Navbar

	// Calculate expiration date based on subscription period
	const calculateExpirationDate = (period) => {
		const now = new Date();
		switch (period) {
			case "1min":
				return new Date(now.getTime() + 60000); // 1 minute
			case "5days":
				return new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
			case "10days":
				return new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days
			default:
				return new Date(now.getTime() + 60000); // default to 1 minute
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess("");

		if (!stripe || !elements) return;

		const card = elements.getElement(CardElement);
		if (!card) return;

		try {
			// Calculate expiration date before creating payment intent
			const expirationDate = calculateExpirationDate(subscriptionPeriod);

			// Include subscriptionPeriod in the payment intent request
			const { data } = await axiosInstance.post("/create-payment-intent", {
				amountInCents: amount,
				subscriptionPeriod,
				email: user.email,
			});

			const clientSecret = data.clientSecret;

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card,
					billing_details: {
						name: user.displayName || "User",
						email: user.email,
					},
				},
			});

			if (result.error) {
				setError(result.error.message);
				Swal.fire({
					icon: "error",
					title: "Payment Failed",
					text: result.error.message,
				});
			} else if (result.paymentIntent.status === "succeeded") {
				// Update premium status with the calculated expiration date
				await axiosSecure.put(`/users/${user.email}/update-premium`, {
					premiumTaken: expirationDate.toISOString(),
					subscriptionPeriod,
				});

				setSuccess(
					"Payment successful! Your premium subscription is now active."
				);

				// Show SweetAlert for success
				Swal.fire({
					icon: "success",
					title: "Payment Successful",
					text: "Your premium subscription is now active.",
				}).then(() => {
					setTimeout(() => navigate("/"), 2000); // Navigate after alert
				});
			}
		} catch (err) {
			console.error(err);
			setError("Payment failed. Please try again.");
			Swal.fire({
				icon: "error",
				title: "Payment Error",
				text: "An error occurred while processing your payment. Please try again.",
			});
		}
	};

	// Convert amount from cents to dollars
	const amountInDollars = (amount / 100).toFixed(2);

	// Display subscription period in a more user-friendly format
	const getSubscriptionLabel = (period) => {
		switch (period) {
			case "1min":
				return "1 Minute (Test)";
			case "5days":
				return "5 Days";
			case "10days":
				return "10 Days";
			default:
				return period;
		}
	};

	return (
		<div className="mb-10 max-w-2xl mx-auto mt-10">
			<div className="bg-white shadow p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Complete your payment</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Display Subscription Period */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Subscription Period
						</label>
						<input
							type="text"
							value={getSubscriptionLabel(subscriptionPeriod)}
							disabled
							className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Display Amount to Pay in dollars */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Amount to Pay
						</label>
						<input
							type="text"
							value={`$${amountInDollars}`}
							disabled
							className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Card Details
						</label>
						<CardElement
							className="p-4 border rounded"
							options={{
								style: {
									base: {
										fontSize: "16px",
										color: "#424770",
										"::placeholder": {
											color: "#aab7c4",
										},
									},
									invalid: {
										color: "#9e2146",
									},
								},
							}}
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && <p className="text-green-600 text-sm">{success}</p>}

					<button
						type="submit"
						disabled={!stripe}
						className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
					>
						Pay ${amountInDollars} Now
					</button>
				</form>
			</div>
		</div>
	);
};

export default MakePayment;
