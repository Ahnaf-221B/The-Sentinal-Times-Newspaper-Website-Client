import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext";

const UserAllArticle = () => {
	const [articles, setArticles] = useState([]);
	const [filteredArticles, setFilteredArticles] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [publisherFilter, setPublisherFilter] = useState(null);
	const [tagsFilter, setTagsFilter] = useState(null);
	const [publishers, setPublishers] = useState([]);
	const { user } = useContext(AuthContext); // Get the current user
	const axiosInstance = useAxios();

	// Fetch publishers when the component mounts
	useEffect(() => {
		const fetchPublishers = async () => {
			try {
				const response = await axiosInstance.get("/publishers");
				const publisherOptions = response.data.map((publisher) => ({
					value: publisher._id,
					label: publisher.publisherName,
				}));
				setPublishers(publisherOptions);
			} catch (error) {
				console.error("Error fetching publishers:", error);
				toast.error("Failed to load publishers.");
			}
		};

		fetchPublishers();
	}, []);

	// Fetch approved articles with applied filters
	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await axiosInstance.get("/articles/admin", {
					params: {
						status: "approved",
						publisher: publisherFilter?.value,
						tags: tagsFilter?.value,
						search: searchTerm,
					},
				});
				setArticles(response.data);
				setFilteredArticles(response.data);
			} catch (error) {
				console.error("Error fetching articles:", error);
				toast.error("Failed to fetch articles.");
			}
		};

		fetchArticles();
	}, [searchTerm, publisherFilter, tagsFilter, axiosInstance]);

	// Filter articles by title search term
	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		const filtered = articles.filter((article) =>
			article.title.toLowerCase().includes(e.target.value.toLowerCase())
		);
		setFilteredArticles(filtered);
	};

	// Handle publisher filter change
	const handlePublisherChange = (selectedPublisher) => {
		setPublisherFilter(selectedPublisher);
	};


	// Navigate to article details page (this is a placeholder for routing)
	const goToArticleDetails = (articleId) => {
		window.location.href = `/article-details/${articleId}`;
	};

	return (
		<div className="container mx-auto p-6 bg-stone-200 ">
			<h1 className="text-4xl font-semibold text-center mb-8">All Articles</h1>

			{/* Search Bar */}
			<div className="mb-6 max-w-7xl mx-auto flex gap-10">
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearch}
					className="w-full px-4 py-2 border border-gray-300 rounded-md bg-stone-100"
					placeholder="Search articles by title..."
				/>
				<div className="w-1/4">
					<Select
						placeholder="Select Publisher"
						options={publishers} // Pass publishers from state
						onChange={handlePublisherChange}
					/>
				</div>
			</div>

			

			{/* Articles */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-14 max-w-7xl mx-auto mb-10 ">
				{filteredArticles.map((article) => (
					<div
						key={article._id}
						className={`bg-stone-100 p-4 rounded-lg shadow-lg hover:shadow-xl ${
							article.isPremium
								? "border-4 border-yellow-500 transform transition-all duration-500 scale-105"
								: ""
						} flex flex-col`} // Ensure flex column layout
					>
						<div className="relative mb-4 flex-grow">
							{" "}
							{/* Flex-grow ensures image is above the content */}
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
							{/* Premium/Free Button */}
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
				))}
			</div>
		</div>
	);
};

export default UserAllArticle;
