import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

const UserAllArticle = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [publisherFilter, setPublisherFilter] = useState(null);
	const [tagsFilter, setTagsFilter] = useState(null);
	const [sortOrder, setSortOrder] = useState("asc");
	const { user } = useContext(AuthContext);
	const axiosInstance = useAxios();
	const axiosSecure = useAxiosSecure();

	// Publishers query
	const {
		data: publishers = [],
		isLoading: isPublishersLoading,
		isError: isPublishersError,
	} = useQuery({
		queryKey: ["publishers"],
		queryFn: async () => {
			const response = await axiosInstance.get("/publishers");
			return response.data.map((publisher) => ({
				value: publisher._id,
				label: publisher.publisherName,
			}));
		},
		onError: (error) => {
			console.error("Error fetching publishers", error);
			toast.error("Failed to load publishers.");
		},
	});

	// Articles query
	const {
		data: articles = [],
		isLoading: isArticlesLoading,
		isError: isArticlesError,
	} = useQuery({
		queryKey: ["articles", searchTerm.trim(), publisherFilter, tagsFilter],
		queryFn: async () => {
			const response = await axiosSecure.get("/articles/admin", {
				params: {
					status: "approved",
					publisher: publisherFilter?.value,
					tags: tagsFilter?.value,
					search: searchTerm.trim(),
				},
			});
			return response.data;
		},
		onError: (error) => {
			console.error("Error fetching articles:", error);
			toast.error("Failed to fetch articles.");
		},
	});

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handlePublisherChange = (selectedPublisher) => {
		setPublisherFilter(selectedPublisher);
	};

	const goToArticleDetails = (articleId) => {
		window.location.href = `/article-details/${articleId}`;
	};

	const toggleSortOrder = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const sortedArticles = [...articles].sort((a, b) => {
		return sortOrder === "asc"
			? a.title.localeCompare(b.title)
			: b.title.localeCompare(a.title);
	});

	// Loading spinner component
	const LoadingSpinner = () => (
		<div className="flex justify-center items-center min-h-[200px]">
			<ImSpinner8 className="animate-spin text-4xl text-blue-600" />
		</div>
	);

	if (isPublishersError || isArticlesError) {
		return (
			<div className="container mx-auto p-6 text-center text-red-500">
				Error fetching data!
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 bg-stone-100 min-h-screen">
			<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
				All Articles
			</h1>

			{/* Search and Filter Section */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-8 max-w-7xl mx-auto gap-4 bg-white p-4 rounded-lg shadow-md">
				<div className="flex-1">
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearch}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						placeholder="Search articles by title or description..."
					/>
				</div>

				<div className="w-full sm:w-64">
					<Select
						placeholder="Select Publisher"
						options={publishers}
						onChange={handlePublisherChange}
						isLoading={isPublishersLoading}
						styles={{
							control: (base) => ({
								...base,
								minHeight: "42px",
								borderColor: "#d1d5db",
								"&:hover": {
									borderColor: "#9ca3af",
								},
							}),
						}}
					/>
				</div>

				<button
					onClick={toggleSortOrder}
					className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
				>
					<span>Sort by Title</span>
					{sortOrder === "asc" ? (
						<FaSortAlphaDown className="text-gray-600" />
					) : (
						<FaSortAlphaUp className="text-gray-600" />
					)}
				</button>
			</div>

			{/* Articles Grid */}
			{isArticlesLoading ? (
				<LoadingSpinner />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
					{sortedArticles.length > 0 ? (
						sortedArticles.map((article) => (
							<div
								key={article._id}
								className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
									article.isPremium ? "border-2 border-yellow-400" : ""
								} flex flex-col h-full`}
							>
								<div className="relative mb-4 overflow-hidden rounded-md h-48">
									<img
										src={article.imageUrl}
										alt={article.title}
										className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
									/>
									{article.isPremium && (
										<div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
											PREMIUM
										</div>
									)}
								</div>
								<h3 className="text-xl font-bold text-gray-800 mb-2">
									{article.title}
								</h3>
								<p className="text-gray-600 mb-2">
									<span className="font-semibold">Publisher:</span>{" "}
									{article.publisher}
								</p>
								<p className="text-gray-600 mb-4 flex-grow">
									{article.description.substring(0, 100)}...
								</p>

								<div className="mt-auto flex justify-between items-center">
									<button
										onClick={() => goToArticleDetails(article._id)}
										className={`px-4 py-2 rounded-lg font-medium ${
											article.isPremium && !user?.isPremium
												? "bg-gray-300 text-gray-500 cursor-not-allowed"
												: "bg-blue-600 text-white hover:bg-blue-700"
										} transition-colors`}
										disabled={article.isPremium && !user?.isPremium}
									>
										View Details
									</button>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											article.isPremium
												? "bg-yellow-100 text-yellow-800"
												: "bg-green-100 text-green-800"
										}`}
									>
										{article.isPremium ? "Premium" : "Free"}
									</span>
								</div>
							</div>
						))
					) : (
						<div className="col-span-3 text-center py-10 text-gray-500">
							{searchTerm
								? "No articles match your search criteria"
								: "No articles available"}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default UserAllArticle;
