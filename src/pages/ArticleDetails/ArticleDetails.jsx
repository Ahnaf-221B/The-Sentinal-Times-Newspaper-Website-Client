import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting the article ID from the URL
import useAxios from "../../hooks/useAxios";
 // Assuming you have your axios hook set up

const ArticleDetails = () => {
	const [article, setArticle] = useState(null);
	const [error, setError] = useState("");
	const axiosInstance = useAxios(); // Axios instance
	const { id } = useParams(); // Get article ID from URL

	// Fetch article details and update view count
	useEffect(() => {
		const fetchArticleDetails = async () => {
			try {
				// Fetch article details by ID
				const response = await axiosInstance.get(`/articles/${id}`);
				setArticle(response.data);

				// Increase view count every time the article is visited
				await axiosInstance.put(`/articles/${id}/increase-view`);
			} catch (error) {
				console.error("Error fetching article details:", error);
				setError("Failed to load article details.");
			}
		};

		fetchArticleDetails();
	}, [id, axiosInstance]);

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	if (!article) {
		return <div className="text-center">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-6 bg-stone-200">
			<h1 className="text-4xl font-semibold text-center mb-6">
				{article.title}
			</h1>

			<div className="flex justify-center mb-6">
				<img
					src={article.imageUrl}
					alt={article.title}
					className="w-3/4 h-auto object-cover rounded-md"
				/>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-lg">
				<p className="text-gray-600 mb-4">
					<strong>Publisher:</strong> {article.publisher}
				</p>
				<p className="text-gray-600 mb-4">
					<strong>Author:</strong> {article.authorName}
				</p>
				<p className="text-gray-600 mb-4">
					<strong>Published on:</strong>{" "}
					{new Date(article.createdAt).toLocaleDateString()}
				</p>
				<p className="text-gray-600 mb-4">
					<strong>Views:</strong> {article.viewCount} {/* Display view count */}
				</p>

				<h3 className="text-2xl font-semibold text-gray-800 mb-4">
					Description
				</h3>
				<p className="text-gray-600">{article.description}</p>
			</div>
		</div>
	);
};

export default ArticleDetails;
