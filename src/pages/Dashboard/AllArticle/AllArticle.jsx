import React, { useState, useEffect } from "react";
import useAxios from "../../../hooks/useAxios";

const AllArticle = () => {
	const [articles, setArticles] = useState([]); // Ensure articles is always an array
	const [showModal, setShowModal] = useState(false);
	const [currentArticleId, setCurrentArticleId] = useState(null);
	const [declineReason, setDeclineReason] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const axiosInstance = useAxios(); // Axios instance

	// Fetch articles for the current page
	useEffect(() => {
		axiosInstance
			.get(`/articles?page=${currentPage}`)
			.then((response) => {
				if (response.data && Array.isArray(response.data.articles)) {
					setArticles(response.data.articles);
					setTotalPages(response.data.totalPages); // Assuming the API returns the total pages
				} else {
					setArticles([]); // Fallback to empty array if response is invalid
				}
			})
			.catch((error) => {
				console.error("Error fetching articles:", error);
				setArticles([]); // Fallback to empty array on error
			});
	}, [currentPage]);

	// Approve Article
	const approveArticle = (id) => {
		axiosInstance
			.put(`/articles/${id}/approve`)
			.then((response) => {
				setArticles(
					articles.map((article) =>
						article._id === id ? response.data : article
					)
				);
			})
			.catch((error) => console.error("Error approving article:", error));
	};

	// Decline Article
	const declineArticle = () => {
		axiosInstance
			.put(`/articles/${currentArticleId}/decline`, { reason: declineReason })
			.then((response) => {
				setArticles(
					articles.map((article) =>
						article._id === currentArticleId ? response.data : article
					)
				);
				setShowModal(false);
				setDeclineReason("");
			})
			.catch((error) => console.error("Error declining article:", error));
	};

	// Make Article Premium
	const makePremiumArticle = (id) => {
		axiosInstance
			.put(`/articles/${id}/make-premium`)
			.then((response) => {
				// Update the local articles list to reflect the premium status change
				setArticles(
					articles.map((article) =>
						article._id === id ? { ...article, isPremium: true } : article
					)
				);
				// Redirect to Premium Articles page
				window.location.href = "/premium-article"; // Navigate to the Premium Articles page
			})
			.catch((error) => console.error("Error making article premium:", error));
	};

	// Open Decline Modal
	const openDeclineModal = (id) => {
		setCurrentArticleId(id);
		setShowModal(true);
	};

	// Close Decline Modal
	const closeDeclineModal = () => {
		setShowModal(false);
		setDeclineReason("");
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-semibold text-center mb-8">All Articles</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6">
				{articles.length === 0 ? (
					<div className="text-center col-span-full text-xl text-gray-500">
						No articles available.
					</div>
				) : (
					articles.map((article) => (
						<div
							key={article._id}
							className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl"
						>
							<h3 className="text-xl font-semibold text-gray-800">
								{article.title}
							</h3>

							{/* Display author info */}
							<div className="mt-4 flex items-center space-x-4">
								<img
									src={article.authorImage}
									alt="Author"
									className="w-12 h-12 rounded-full"
								/>
								<div>
									<p className="text-gray-600">
										<strong>Author:</strong> {article.authorName}
									</p>
									<p className="text-gray-600">
										<strong>Email:</strong> {article.authorEmail}
									</p>
								</div>
							</div>

							{/* Display other article info */}
							<p className="text-gray-600 mt-2">
								<strong>Posted Date:</strong>{" "}
								{new Date(article.createdAt).toLocaleDateString()}
							</p>
							<p className="text-gray-600 mt-2">
								<strong>Status:</strong> {article.status}
							</p>
							<p className="text-gray-600 mt-2">
								<strong>Publisher:</strong> {article.publisher}
							</p>

							{/* Action Buttons */}
							<div className="mt-4 flex justify-between space-x-2">
								<button
									onClick={() => approveArticle(article._id)}
									className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
								>
									Approve
								</button>
								<button
									onClick={() => openDeclineModal(article._id)}
									className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
								>
									Decline
								</button>
								<button
									onClick={() => makePremiumArticle(article._id)}
									className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none"
								>
									Make Premium
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination Controls */}
			<div className="flex justify-center mt-6">
				<button
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<span className="px-4 py-2 text-lg">
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>

			{/* Decline Modal */}
			{showModal && (
				<div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-8 rounded-lg shadow-lg w-96">
						<h2 className="text-2xl font-semibold text-center mb-4">
							Decline Article
						</h2>
						<textarea
							value={declineReason}
							onChange={(e) => setDeclineReason(e.target.value)}
							placeholder="Enter reason for decline"
							className="w-full p-4 border-2 border-gray-300 rounded-lg h-32 mb-4"
						/>
						<div className="flex justify-between">
							<button
								onClick={declineArticle}
								className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
							>
								Submit Decline
							</button>
							<button
								onClick={closeDeclineModal}
								className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 focus:outline-none"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AllArticle;
