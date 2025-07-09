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
			price: "$14.99",
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
			price: "$16.99",
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
		<div className="min-h-screen bg-stone-200 py-10 px-4">
			<h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
				Subscription Plans
			</h2>
			<div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto h-full">
				{plans.map((plan, index) => (
					<div
						key={index}
						className={`bg-black text-white border-2 ${plan.bgColor} rounded-lg p-6 shadow-lg`}
					>
						<div className="mb-4">
							<p className={`text-sm font-medium ${plan.textColor}`}>
								{plan.price}
							</p>
							<h3 className="text-2xl font-bold mt-2 mb-1">{plan.name}</h3>
							<p className="text-sm text-gray-300">{plan.cost}</p>
						</div>
						<ul className="text-sm mb-6 space-y-2">
							{plan.features.map((feature, i) => (
								<li key={i}>• {feature}</li>
							))}
						</ul>
						<Link
							to='/payment'
							className="block text-center bg-white text-black font-semibold py-2 rounded hover:bg-gray-100"
						>
							{plan.btnText}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default Plans;
