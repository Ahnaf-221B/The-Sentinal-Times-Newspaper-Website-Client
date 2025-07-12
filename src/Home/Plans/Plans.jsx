// Plans.jsx
import { Link } from "react-router-dom";

const Plans = () => {
	const plans = [
		{
			name: "Premium Individual",
			price: "Free for 1 month",
			cost: "FREE",
			features: [
				"1 Premium account",
				"Cancel anytime",
				"15 hours/month of listening time from our audio news catalog",
			],
			btnText: "Try free for 1 month",
			btnLink: "/subscribe",
			bgColor: "border-pink-400",
			textColor: "text-pink-400",
		},
		{
			name: "Premium Duo",
			price: "$4.99",
			cost: "PER MONTH",
			features: [
				"2 Premium accounts",
				"Cancel anytime",
				"15 hours/month of listening time from our audio news catalog (plan manager only)",
			],
			btnText: "Get Premium Duo",
			btnLink: "/subscribe",
			bgColor: "border-yellow-400",
			textColor: "text-yellow-400",
		},
		{
			name: "Premium Family",
			price: "$8.99",
			cost: "PER MONTH",
			features: [
				"Up to 6 Premium or Kids accounts",
				"Block explicit content",
				"Access to Kids section",
				"Cancel anytime",
				"15 hours/month of audio news catalog (plan manager only)",
			],
			btnText: "Get Premium Family",
			btnLink: "/subscribe",
			bgColor: "border-blue-400",
			textColor: "text-blue-400",
		},
	];

	return (
		<div className="bg-stone-200 py-16 px-4">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
					Choose Your Premium Plan
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{plans.map((plan, index) => (
						<div
							key={index}
							className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
						>
							{/* Plan Header */}
							<div
								className={`p-6 ${
									index === 0 ? "bg-gray-600" : "bg-gray-800"
								} text-white`}
							>
							
								<h3 className="text-2xl font-bold">{plan.name}</h3>
								<div className="flex items-end mt-2">
									<span className="text-3xl font-bold mr-2">{plan.price}</span>
									<span className="text-sm text-gray-300 mb-1">
										{plan.cost}
									</span>
								</div>
							</div>

							{/* Plan Features */}
							<div className="p-6 flex-grow">
								<ul className="space-y-3 mb-6">
									{plan.features.map((feature, i) => (
										<li key={i} className="flex items-start">
											<svg
												className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
											<span className="text-gray-700">{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* CTA Button - Now properly aligned at the bottom */}
							<div className="p-6 pt-0">
								<Link
									to="/payment"
									className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition ${
										index === 0
											? "bg-blue-600 hover:bg-blue-700 text-white"
											: "bg-black hover:bg-gray-800 text-white"
									}`}
								>
									{plan.btnText}
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Plans;
