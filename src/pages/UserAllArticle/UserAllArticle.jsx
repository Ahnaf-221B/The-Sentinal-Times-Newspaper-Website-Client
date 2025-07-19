import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UserAllArticle = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [publisherFilter, setPublisherFilter] = useState(null);
	const [tagsFilter, setTagsFilter] = useState(null);
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

	// Articles query with proper search handling
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
					search: searchTerm.trim(), // Ensure trimmed search term
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

	if (isPublishersLoading || isArticlesLoading) {
		return <div>Loading...</div>;
	}

	if (isPublishersError || isArticlesError) {
		return <div>Error fetching data!</div>;
	}

	return (
		<div className="container mx-auto p-6 bg-stone-200 ">
			<h1 className="text-4xl font-semibold text-center mb-8">All Articles</h1>

			<div className="mb-6 max-w-7xl mx-auto flex gap-10">
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearch}
					className="w-full px-4 py-2 border border-gray-300 rounded-md bg-stone-100"
					placeholder="Search articles by title or description..."
				/>
				<div className="w-1/4">
					<Select
						placeholder="Select Publisher"
						options={publishers}
						onChange={handlePublisherChange}
						isLoading={isPublishersLoading}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-14 max-w-7xl mx-auto mb-10 ">
				{articles.length > 0 ? (
					articles.map((article) => (
						<div
							key={article._id}
							className={`bg-stone-100 p-4 rounded-lg shadow-lg hover:shadow-xl ${
								article.isPremium
									? "border-4 border-yellow-500 transform transition-all duration-500 scale-105"
									: ""
							} flex flex-col`}
						>
							<div className="relative mb-4 flex-grow">
								<img
									src={article.imageUrl}
									alt={article.title}
									className="w-full h-48 object-cover rounded-md"
								/>
							</div>
							<h3 className="text-xl font-semibold text-gray-800">
								{article.title}
							</h3>
							<p className="text-gray-600 mt-2">
								<strong>Publisher:</strong> {article.publisher}
							</p>
							<p className="text-gray-600 mt-2">
								<strong>Description:</strong>{" "}
								{article.description.substring(0, 100)}...
							</p>

							<div className="mt-6 flex justify-between items-center">
								<button
									onClick={() => goToArticleDetails(article._id)}
									className={`${
										article.isPremium && !user?.isPremium
											? "bg-gray-400 cursor-not-allowed px-4 py-2 rounded-lg"
											: "bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
									}`}
									disabled={article.isPremium && !user?.isPremium}
								>
									Details
								</button>
								<button
									className={`${
										article.isPremium
											? "bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
											: "bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
									}`}
								>
									{article.isPremium ? "Premium" : "Free"}
								</button>
							</div>
						</div>
					))
				) : (
					<div className="col-span-3 text-center py-10">
						{searchTerm
							? "No articles match your search criteria"
							: "No articles available"}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserAllArticle;
