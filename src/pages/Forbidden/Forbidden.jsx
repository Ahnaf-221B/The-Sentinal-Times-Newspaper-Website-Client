import { Link } from "react-router-dom";
import { FiSearch, FiHome } from "react-icons/fi";

const Forbidden = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center noticia">
			<div className="max-w-md mx-auto">
				{/* Illustration */}
				<img
					src="https://illustrations.popsy.co/amber/page-not-found.svg"
					alt="No news found"
					className="w-full h-64 object-contain mb-8"
					onError={(e) => {
						e.target.src =
							"https://cdn-icons-png.flaticon.com/512/7486/7486744.png";
					}}
				/>

				{/* Title */}
				<h1 className="text-4xl font-bold text-gray-800 mb-4">
					404 - News Not Found
				</h1>

				{/* Description */}
				<p className="text-lg text-gray-600 mb-8">
					Oops! The news article you're looking for doesn't exist or may have
					been removed.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						to="/"
						className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						<FiHome className="text-lg" />
						Return Home
					</Link>
					
				</div>

				
			</div>
		</div>
	);
};

export default Forbidden;
