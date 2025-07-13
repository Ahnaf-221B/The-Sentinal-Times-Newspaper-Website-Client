import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubscriptionBanner from "./SubscriptionBanner"; // Importing the SubscriptionBanner component

const PaymentForm = () => {
	const [subscriptionPeriod, setSubscriptionPeriod] = useState("1min");
	const navigate = useNavigate();

	const handlePeriodChange = (e) => {
		setSubscriptionPeriod(e.target.value);
	};

	// Set the amount based on the selected subscription period
	const getAmount = (period) => {
		switch (period) {
			case "1min":
				return 99; // 1 Minute - $0.99
			case "5days":
				return 499; // 5 Days - $4.99
			case "10days":
				return 899; // 10 Days - $8.99
			default:
				return 99;
		}
	};

	const handleAddSubscription = () => {
		const amount = getAmount(subscriptionPeriod);
		// Navigate to the MakePayment page with the selected period and amount
		navigate("/make-payment", { state: { subscriptionPeriod, amount } });
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 mb-10">
			<SubscriptionBanner />
			<div className="bg-white shadow p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Choose Your Subscription</h2>

				<div className="space-y-4">
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

					<button
						onClick={handleAddSubscription}
						className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
					>
						Add Subscription
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentForm;
