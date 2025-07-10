import React, { useState, useEffect } from "react";
 
import { toast } from "react-toastify";
import Select from "react-select";
import useAxios from "../../hooks/useAxios";

const UserAllArticle = () => {
	const [articles, setArticles] = useState([]);
	const [filteredArticles, setFilteredArticles] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [publisherFilter, setPublisherFilter] = useState(null);
	const [tagsFilter, setTagsFilter] = useState(null);
	const [publishers, setPublishers] = useState([]); // Store publishers
	const axiosInstance = useAxios();

	// Fetch publishers when the component mounts
	useEffect(() => {
		const fetchPublishers = async () => {
			try {
				const response = await axiosInstance.get("/publishers");
				const publisherOptions = response.data.map((publisher) => ({
					value: publisher._id, // Publisher ID
					label: publisher.publisherName, // Publisher Name
				}));
				setPublishers(publisherOptions); // Update publishers state
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
						status: "approved", // Only approved articles
						publisher: publisherFilter?.value, // Filter by publisher if selected
						tags: tagsFilter?.value, // Filter by tags if selected
						search: searchTerm, // Filter by title search term
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

	// Handle tags filter change
	const handleTagsChange = (selectedTags) => {
		setTagsFilter(selectedTags);
	};

	// Navigate to article details page (this is a placeholder for routing)
	const goToArticleDetails = (articleId) => {
		// You can use `history.push` if you're using react-router-dom, or link to the details page
		window.location.href = `/article-details/${articleId}`;
	};

	return (
		<div className="container mx-auto p-6 bg-stone-200">
			<h1 className="text-4xl font-semibold text-center mb-8">All Articles</h1>

			{/* Search Bar */}
			<div className="mb-6">
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearch}
					className="w-full px-4 py-2 border border-gray-300 rounded-md"
					placeholder="Search articles by title..."
				/>
			</div>

			{/* Filters for publisher and tags */}
			<div className="flex justify-between mb-6">
				{/* Publisher Filter */}
				<div className="w-1/4">
					<Select
						placeholder="Select Publisher"
						options={publishers} // Pass publishers from state
						onChange={handlePublisherChange}
					/>
				</div>

				{/* Tags Filter */}
				<div className="w-1/4">
					<Select
						isMulti
						placeholder="Select Tags"
						options={[
							{ value: "technology", label: "Technology" },
							{ value: "health", label: "Health" },
							{ value: "business", label: "Business" },
							{ value: "education", label: "Education" },
						]}
						onChange={handleTagsChange}
					/>
				</div>
			</div>

			{/* Articles */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
				{filteredArticles.map((article) => (
					<div
						key={article._id}
						className={`bg-stone-100 p-6 rounded-lg shadow-lg hover:shadow-xl ${
							article.isPremium ? "border-4 border-yellow-500" : ""
						}`}
					>
						<img
							src={article.imageUrl}
							alt={article.title}
							className="w-full h-48 object-cover rounded-md mb-4"
						/>
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
						<div className="mt-4 flex justify-between space-x-2">
							<button
								onClick={() => goToArticleDetails(article._id)}
								className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
							>
								Details
							</button>
							{/* Disable button if article is premium and user is not subscribed */}
							<button
								// disabled={article.isPremium && !user.isSubscribed}
								// className={`${
								// 	article.isPremium && !user.isSubscribed
								// 		? "bg-gray-400 cursor-not-allowed"
								// 		: "bg-green-500"
								// } text-white py-2 px-4 rounded-lg hover:bg-green-600`}
							>
								{article.isPremium ? "Premium" : "Read"}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UserAllArticle;
