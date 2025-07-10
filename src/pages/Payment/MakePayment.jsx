import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

const MakePayment = () => {
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const location = useLocation();

	const [error, setError] = useState(null);
	const [success, setSuccess] = useState("");
	const subscriptionPeriod = location.state?.subscriptionPeriod || "1min";
	const amount = location.state?.amount || 99; // Retrieve amount from the state (in cents)

	const Axios = useAxios();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess("");

		if (!stripe || !elements) return;

		const card = elements.getElement(CardElement);
		if (!card) return;

		try {
			const { data } = await Axios.post("/create-payment-intent", {
				amountInCents: amount,
			});

			const clientSecret = data.clientSecret;

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card,
				},
			});

			if (result.error) {
				setError(result.error.message);
			} else if (result.paymentIntent.status === "succeeded") {
				setSuccess("Payment successful! Subscription activated.");
				setTimeout(() => navigate("/"), 2000);
			}
		} catch (err) {
			console.error(err);
			setError("Payment failed. Please try again.");
		}
	};

	// Convert amount from cents to dollars
	const amountInDollars = (amount / 100).toFixed(2);

	return (
		<div className="max-w-2xl mx-auto mt-10">
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
							value={subscriptionPeriod}
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
							value={`$${amountInDollars}`} // Display the amount in dollars
							disabled
							className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Card Details
						</label>
						<CardElement className="p-4 border rounded" />
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
