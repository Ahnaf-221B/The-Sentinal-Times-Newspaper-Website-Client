import React, { useState, useEffect, useContext } from "react";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext";
import Modal from "react-modal";

const MyArticle = () => {
	const { user } = useContext(AuthContext); // Accessing logged-in user from context
	const [articles, setArticles] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [declineReason, setDeclineReason] = useState("");
	const [selectedArticleId, setSelectedArticleId] = useState(null);
	const [articleData, setArticleData] = useState({
		title: "",
		description: "",
		tags: "",
		publisher: "",
		imageUrl: "",
	});
	const axiosInstance = useAxios();

	// Fetch the articles of the logged-in user
	useEffect(() => {
		if (user) {
			const fetchArticles = async () => {
				try {
					const response = await axiosInstance.get("/articles/myarticle", {
						params: { email: user.email },
					});
					setArticles(response.data);
				} catch (error) {
					console.error("Error fetching articles:", error);
				}
			};

			fetchArticles();
		}
	}, [user]);

	// Open the modal with the article's data to update
	const openUpdateModal = (article) => {
		setSelectedArticleId(article._id);
		setArticleData({
			title: article.title,
			description: article.description,
			tags: article.tags.join(","),
			publisher: article.publisher,
			imageUrl: article.imageUrl,
		});
		setModalIsOpen(true);
	};

	// Close the modal
	const closeModal = () => {
		setModalIsOpen(false);
		setArticleData({
			title: "",
			description: "",
			tags: "",
			publisher: "",
			imageUrl: "",
		});
	};

	// Handle article update
	const handleUpdate = async () => {
		try {
			const updatedArticle = {
				title: articleData.title,
				description: articleData.description,
				tags: articleData.tags.split(","),
				publisher: articleData.publisher,
				imageUrl: articleData.imageUrl,
			};

			await axiosInstance.put(`/articles/${selectedArticleId}`, updatedArticle);

			// Update UI after successful update
			setArticles(
				articles.map((article) =>
					article._id === selectedArticleId
						? { ...article, ...updatedArticle }
						: article
				)
			);

			closeModal();
		} catch (error) {
			console.error("Error updating article:", error);
		}
	};

	// Handle article deletion
	const handleDelete = async (articleId) => {
		try {
			await axiosInstance.delete(`/articles/${articleId}`);
			setArticles(articles.filter((article) => article._id !== articleId));
		} catch (error) {
			console.error("Error deleting article:", error);
		}
	};

	// Open the modal for the reason when the article is declined
	const openDeclineModal = (articleId, reason) => {
		setSelectedArticleId(articleId);
		setDeclineReason(reason);
		setModalIsOpen(true);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
				My Articles
			</h1>

			<div className="overflow-x-auto bg-white shadow-md rounded-lg">
				<table className="min-w-full text-left">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-gray-700">Serial No</th>
							<th className="px-4 py-2 text-gray-700">Article Title</th>
							<th className="px-4 py-2 text-gray-700">Details</th>
							<th className="px-4 py-2 text-gray-700">Status</th>
							<th className="px-4 py-2 text-gray-700">Is Premium</th>
							<th className="px-4 py-2 text-gray-700">Actions</th>
						</tr>
					</thead>
					<tbody>
						{articles.map((article, index) => (
							<tr key={article._id} className="border-b hover:bg-gray-50">
								<td className="px-4 py-2">{index + 1}</td>
								<td className="px-4 py-2">{article.title}</td>
								<td className="px-4 py-2">
									<a
										href={`/article-details/${article._id}`}
										className="text-blue-600 hover:underline"
									>
										View Details
									</a>
								</td>
								<td className="px-4 py-2">
									{article.status === "approved" && (
										<span className="text-green-500">Approved</span>
									)}
									{article.status === "declined" && (
										<div className="flex items-center">
											<span className="text-red-500">Declined</span>
											<button
												onClick={() =>
													openDeclineModal(article._id, article.declineReason)
												}
												className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mr-2 ml-4"
											>
												Reason
											</button>
										</div>
									)}
									{article.status === "pending" && (
										<span className="text-yellow-500">Pending</span>
									)}
								</td>
								<td className="px-4 py-2">
									{article.isPremium ? (
										<span className="text-green-500">Yes</span>
									) : (
										<span className="text-gray-500">No</span>
									)}
								</td>
								<td className="px-4 py-2 ">
									<button
										onClick={() => openUpdateModal(article)}
										className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mr-2"
									>
										Update
									</button>
									<button
										onClick={() => handleDelete(article._id)}
										className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal to display the decline reason */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Decline Reason"
				className="w-96 mx-auto p-6 bg-white rounded-lg shadow-lg"
			>
				{declineReason && (
					<>
						<h2 className="text-xl font-semibold">Decline Reason</h2>
						<p className="mt-4">{declineReason}</p>
					</>
				)}

				{/* Article Update Modal */}
				{!declineReason && (
					<>
						<h2 className="text-xl font-semibold">Update Article</h2>
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700">
								Title
							</label>
							<input
								type="text"
								value={articleData.title}
								onChange={(e) =>
									setArticleData({ ...articleData, title: e.target.value })
								}
								className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								value={articleData.description}
								onChange={(e) =>
									setArticleData({
										...articleData,
										description: e.target.value,
									})
								}
								className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700">
								Tags
							</label>
							<input
								type="text"
								value={articleData.tags}
								onChange={(e) =>
									setArticleData({ ...articleData, tags: e.target.value })
								}
								className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700">
								Publisher
							</label>
							<input
								type="text"
								value={articleData.publisher}
								onChange={(e) =>
									setArticleData({ ...articleData, publisher: e.target.value })
								}
								className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700">
								Image URL
							</label>
							<input
								type="text"
								value={articleData.imageUrl}
								onChange={(e) =>
									setArticleData({ ...articleData, imageUrl: e.target.value })
								}
								className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="mt-4">
							<button
								onClick={handleUpdate}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
							>
								Update Article
							</button>
						</div>
					</>
				)}

				<button
					onClick={closeModal}
					className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
				>
					Close
				</button>
			</Modal>
		</div>
	);
};

export default MyArticle;
