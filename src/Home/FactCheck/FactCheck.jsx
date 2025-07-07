import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const FactCheck = () => {
	const facts = [
		{
			claim: "Aliens landed in France.",
			verdict: "False",
			explanation:
				"Confirmed by ESA & French authorities that no such event occurred.",
		},
		{
			claim: "New law bans social media on weekends.",
			verdict: "Misleading",
			explanation: "Applies only to government employees during working hours.",
		},
		{
			claim: "COVID-19 vaccines cause infertility.",
			verdict: "False",
			explanation:
				"No scientific evidence supports this claim. Verified by WHO.",
		},
		{
			claim: "Electric vehicles are banned in Germany starting 2025.",
			verdict: "False",
			explanation:
				"German authorities have confirmed no such ban is in place or planned.",
		},
	];

	const getVerdictStyle = (verdict) => {
		switch (verdict) {
			case "False":
				return {
					color: "text-red-600",
					icon: <FaTimesCircle className="text-red-600 mr-2" />,
				};
			case "Misleading":
				return {
					color: "text-yellow-600",
					icon: <FaTimesCircle className="text-yellow-600 mr-2" />,
				};
			case "True":
				return {
					color: "text-green-600",
					icon: <FaCheckCircle className="text-green-600 mr-2" />,
				};
			default:
				return { color: "text-gray-600", icon: null };
		}
	};

	return (
		<section className="bg-stone-200 py-12 px-4 noticia">
			<div className="max-w-7xl mx-auto bg-gray-100 rounded-lg p-8 shadow-md">
				<h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-l-4 border-red-600 pl-4">
					 Fact Check Center
				</h2>
				<p className="text-gray-600 mb-8">
					Our editorial team verifies viral claims and trending stories. Here
					are the latest results from our newsroom.
				</p>

				<div className="grid md:grid-cols-2 gap-6">
					{facts.map(({ claim, verdict, explanation }, index) => {
						const { color, icon } = getVerdictStyle(verdict);

						return (
							<div
								key={index}
								className="bg-gray-50 border rounded-lg p-6 shadow-sm hover:shadow-md transition"
							>
								<h4 className="text-md font-semibold text-gray-700 mb-2">
									<span className="text-gray-900 font-bold">Claim:</span>{" "}
									{claim}
								</h4>
								<div className="flex items-center mb-2">
									{icon}
									<span className={`font-medium ${color}`}>
										Verdict: {verdict}
									</span>
								</div>
								<p className="text-sm text-gray-600">{explanation}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default FactCheck;
