import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";


// ✅ Subscription banner component
const SubscriptionBanner = () => {
	return (
		<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
			<div className="max-w-4xl mx-auto text-center">
				<h2 className="text-3xl font-bold mb-3">Unlock Premium Content</h2>
				<p className="text-xl mb-4">
					Get unlimited access to exclusive articles, ad-free browsing, and
					premium features
				</p>
				<div className="flex justify-center space-x-4">
					<div className="bg-white bg-opacity-20 p-4 rounded-lg text-red-500">
						<p className="font-bold">1 Minute</p>
						<p className="text-2xl font-bold">$0.99</p>
						<p className="text-sm">For testing</p>
					</div>
					<div className="bg-white bg-opacity-20 p-4 rounded-lg">
						<p className="font-bold">5 Days</p>
						<p className="text-2xl font-bold">$4.99</p>
						<p className="text-sm">Most popular</p>
					</div>
					<div className="bg-white bg-opacity-20 p-4 rounded-lg">
						<p className="font-bold">10 Days</p>
						<p className="text-2xl font-bold">$8.99</p>
						<p className="text-sm">Best value</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();

	const [error, setError] = useState(null);
	const [success, setSuccess] = useState("");
	const [subscriptionPeriod, setSubscriptionPeriod] = useState("1min");
	const [amount, setAmount] = useState(99); // cents
	const Axios =useAxios()
	const handlePeriodChange = (e) => {
		const period = e.target.value;
		setSubscriptionPeriod(period);

		switch (period) {
			case "1min":
				setAmount(99);
				break;
			case "5days":
				setAmount(499);
				break;
			case "10days":
				setAmount(899);
				break;
			default:
				setAmount(99);
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

	return (
		<div className="max-w-2xl mx-auto mt-10">
            <SubscriptionBanner></SubscriptionBanner>
			<div className="bg-white shadow p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Complete your payment</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Subscription Period
						</label>
						<select
							value={subscriptionPeriod}
							onChange={handlePeriodChange}
							className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="1min">1 Minute - $0.99 (For Testing)</option>
							<option value="5days">5 Days - $4.99</option>
							<option value="10days">10 Days - $8.99</option>
						</select>
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
						Pay ${(amount / 100).toFixed(2)} Now
					</button>
				</form>
			</div>
		</div>
	);
};
export default PaymentForm;
