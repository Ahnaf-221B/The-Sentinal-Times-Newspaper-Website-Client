import React, { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";


const PremiumArticle = () => {
	const [premiumArticles, setPremiumArticles] = useState([]);
	const axiosInstance = useAxios();

	// Fetch premium articles when the component mounts
	useEffect(() => {
		const fetchPremiumArticles = async () => {
			try {
				const response = await axiosInstance.get("/articles", {
					params: { isPremium: true },
				});
				setPremiumArticles(response.data);
			} catch (error) {
				console.error("Error fetching premium articles:", error);
			}
		};

		fetchPremiumArticles();
	}, []);

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-semibold text-center mb-8">
				Premium Articles
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6">
				{premiumArticles.map((article) => (
					<div
						key={article._id}
						className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl"
					>
						<h3 className="text-xl font-semibold text-gray-800">
							{article.title}
						</h3>
						<img
							src={article.imageUrl}
							alt={article.title}
							className="w-full h-48 object-cover rounded-md mb-4"
						/>
						<p className="text-gray-600 mt-2">
							<strong>Publisher:</strong> {article.publisher}
						</p>
						<p className="text-gray-600 mt-2">
							<strong>Description:</strong>{" "}
							{article.description.substring(0, 100)}...
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default PremiumArticle;
