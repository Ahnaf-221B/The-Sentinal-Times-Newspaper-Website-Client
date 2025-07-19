import React, { useState, useContext } from "react";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext";
import Modal from "react-modal";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const MyArticle = () => {
	const { user } = useContext(AuthContext); // Accessing logged-in user from context
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
	const axiosSecure = useAxiosSecure();

	// Fetch the articles of the logged-in user using TanStack Query
	const { 
		data: articles = [], 
		isLoading, 
		isError, 
		refetch 
	} = useQuery({
		queryKey: ["myArticles", user?.email],
		queryFn: async () => {
			if (!user) return [];
			const response = await axiosSecure.get("/articles/myarticle", {
				params: { email: user.email },
			});
			return response.data;
		},
		enabled: !!user,
		onError: (error) => {
			console.error("Error fetching articles:", error);
		}
	});

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
		// Reset decline reason to ensure update form shows
		setDeclineReason("");
		setModalIsOpen(true);
	};

	// Close the modal
	const closeModal = () => {
		setModalIsOpen(false);
		// Reset all modal-related states
		setArticleData({
			title: "",
			description: "",
			tags: "",
			publisher: "",
			imageUrl: "",
		});
		setDeclineReason("");
		setSelectedArticleId(null);
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

			// Refetch articles to update UI
			refetch();
			closeModal();
			
			// Show success message
			Swal.fire({
				title: "Success!",
				text: "Article updated successfully",
				icon: "success",
				confirmButtonText: "OK"
			});
		} catch (error) {
			console.error("Error updating article:", error);
			
			// Show error message
			Swal.fire({
				title: "Error!",
				text: "Failed to update article",
				icon: "error",
				confirmButtonText: "OK"
			});
		}
	};

	// Handle article deletion
	const handleDelete = async (articleId) => {
		// Show confirmation dialog
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		});
		
		// If user confirms deletion
		if (result.isConfirmed) {
			try {
				await axiosInstance.delete(`/articles/${articleId}`);
				// Refetch articles to update UI
				refetch();
				
				// Show success message
				Swal.fire({
					title: "Deleted!",
					text: "Your article has been deleted.",
					icon: "success",
					confirmButtonText: "OK"
				});
			} catch (error) {
				console.error("Error deleting article:", error);
				
				// Show error message
				Swal.fire({
					title: "Error!",
					text: "Failed to delete article",
					icon: "error",
					confirmButtonText: "OK"
				});
			}
		}
	};
	


	// Open the modal for the reason when the article is declined
	const openDeclineModal = (articleId, reason) => {
		setSelectedArticleId(articleId);
		setDeclineReason(reason);
		// Reset article data to ensure no conflicts with update form
		setArticleData({
			title: "",
			description: "",
			tags: "",
			publisher: "",
			imageUrl: "",
		});
		setModalIsOpen(true);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
				My Articles
			</h1>

			{isLoading && (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			)}

			{isError && (
				<div className="text-center py-10">
					<p className="text-red-500 mb-4">Failed to load articles. Please try again.</p>
					<button
						onClick={() => refetch()}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
					>
						Retry
					</button>
				</div>
			)}

			{!isLoading && !isError && articles.length === 0 && (
				<div className="text-center py-16 bg-gray-50 rounded-xl max-w-7xl mx-auto">
					<h3 className="text-2xl font-medium text-gray-700 mb-2">
						No Articles Found
					</h3>
					<p className="text-gray-500 max-w-md mx-auto">
						You haven't created any articles yet. Start writing to see them here.
					</p>
				</div>
			)}

			{!isLoading && !isError && articles.length > 0 && (
				<div className="overflow-x-auto bg-white shadow-md rounded-lg max-w-7xl mx-auto">
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
			)}

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
								onClick={() => {
									Swal.fire({
										title: "Are you sure?",
										text: "Do you want to update this article?",
										icon: "question",
										showCancelButton: true,
										confirmButtonColor: "#3085d6",
										cancelButtonColor: "#d33",
										confirmButtonText: "Yes, update it!"
									}).then((result) => {
										if (result.isConfirmed) {
											handleUpdate();
										}
									});
								}}
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
