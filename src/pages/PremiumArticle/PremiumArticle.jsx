import React, { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import { FiStar, FiClock, FiUser, FiBook } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const PremiumArticle = () => {
	const [premiumArticles, setPremiumArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchPremiumArticles = async () => {
			try {
				setLoading(true);
				const response = await axiosInstance.get("/articles", {
					params: { isPremium: "true", page: 1, limit: 6 }, // Increased limit to 6 for better grid layout
				});
				setPremiumArticles(response.data?.articles || []);
			} catch (error) {
				console.error("Error fetching premium articles:", error);
				setError("Failed to load premium articles. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchPremiumArticles();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-red-500 mb-4">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			{/* Premium Articles Header */}
			<div className="text-center mb-12">
				<div className="flex items-center justify-center mb-4">
					<FaStar className="text-yellow-400 text-3xl mr-2" />
					<h1 className="text-4xl font-bold text-gray-800">Premium Articles</h1>
					<FaStar className="text-yellow-400 text-3xl ml-2" />
				</div>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					Exclusive content for our premium members. Enjoy high-quality articles
					from top publishers.
				</p>
			</div>

			{/* Articles Grid */}
			{premiumArticles.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{premiumArticles.map((article) => (
						<div
							key={article._id}
							className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
						>
							{/* Article Image */}
							<div className="relative h-48 overflow-hidden">
								<img
									src={
										article.imageUrl ||
										"https://via.placeholder.com/400x250?text=Premium+Article"
									}
									alt={article.title}
									className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
									onError={(e) => {
										e.target.src =
											"https://via.placeholder.com/400x250?text=Premium+Article";
									}}
								/>
								<div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
									<FiStar className="mr-1" /> PREMIUM
								</div>
							</div>

							{/* Article Content */}
							<div className="p-6 flex-grow bg-stone-100">
								<div className="flex items-center mb-3">
									<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
										{article.category || "General"}
									</span>
									<span className="text-gray-500 text-sm flex items-center">
										<FiClock className="mr-1" />
										{new Date(article.createdAt).toLocaleDateString()}
									</span>
								</div>

								<h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
									{article.title}
								</h3>

								<p className="text-gray-600 mb-4 line-clamp-3">
									{article.description}
								</p>

								<div className="flex items-center mt-auto">
									<div className="flex-shrink-0">
										<img
											src={
												article.authorImage || "https://via.placeholder.com/40"
											}
											alt={article.authorName}
											className="w-10 h-10 rounded-full object-cover"
										/>
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">
											{article.authorName}
										</p>
										<p className="text-xs text-gray-500">{article.publisher}</p>
									</div>
								</div>
							</div>

							
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-16 bg-gray-50 rounded-xl">
					<FiBook className="mx-auto text-5xl text-gray-400 mb-4" />
					<h3 className="text-2xl font-medium text-gray-700 mb-2">
						No Premium Articles Available
					</h3>
					<p className="text-gray-500 max-w-md mx-auto">
						There are currently no premium articles. Check back later for
						exclusive content.
					</p>
				</div>
			)}
		</div>
	);
};

export default PremiumArticle;
