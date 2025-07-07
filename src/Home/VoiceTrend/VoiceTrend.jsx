import { FaQuoteLeft } from "react-icons/fa";

const VoiceTrend = () => {
	const voices = [
		{
			quote:
				"The new education policy could change everything for rural students.",
			author: "@EduThinker",
		},
		{
			quote: "Sports section is 🔥 today! Loved the World Cup coverage.",
			author: "Reader: Samir Rahman",
		},
		{
			quote: "Government’s new fuel tax plan is facing real backlash.",
			author: "@PolicyWatch",
		},
	];

	return (
		<section className="bg-gray-100 py-12 px-4 md:px-10 noticia">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">
					 Trending Voices
				</h2>
				<p className="text-gray-600 mb-10">
					What people are saying about today’s top stories:
				</p>

				<div className="grid md:grid-cols-3 gap-6">
					{voices.map(({ quote, author }, index) => (
						<div
							key={index}
							className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition ring-1 ring-gray-200"
						>
							<div className="flex items-start mb-4 text-blue-500">
								<FaQuoteLeft className="text-2xl mr-2" />
								<p className="text-left italic text-gray-800">{quote}</p>
							</div>
							<div className="text-right text-sm text-gray-500 font-medium">
								— {author}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default VoiceTrend;
