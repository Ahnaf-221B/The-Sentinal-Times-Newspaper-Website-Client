import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel"; // Import Carousel from react-responsive-carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the necessary carousel styles
import useAxios from "../../hooks/useAxios";

const TrendingArticles = () => {
	const [topArticles, setTopArticles] = useState([]);
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchTopArticles = async () => {
			try {
				const response = await axiosInstance.get("/articles/slid/top-viewed");
				console.log("Top Articles:", response.data);

				if (response.data && Array.isArray(response.data)) {
					setTopArticles(response.data);
				} else {
					console.error("Top articles data is not an array");
				}
			} catch (error) {
				console.error("Error fetching top articles:", error);
			}
		};

		fetchTopArticles();
	}, []);

	return (
		<div className="container mx-auto p-6 bg-stone-300 rounded-lg shadow-lg">
			<h2 className="text-3xl font-semibold text-center mb-8 text-black mask-t-from-12">
				Trending Articles
			</h2>

			{/* Carousel Component */}
			<Carousel
				infiniteLoop={true} // Make the carousel loop
				showThumbs={false} // Hide the thumbnails
				showStatus={false} // Hide the status (e.g., slide count)
				autoPlay={true} // Enable auto play
				interval={3000} // Set auto play interval in milliseconds
				transitionTime={300} // Transition time for slides
				swipeable={true} // Enable swipe for touch devices
				dynamicHeight={true} // Adjust height dynamically based on content
			>
				{topArticles.map((article) => (
					<div key={article._id} className="flex justify-center items-center">
						<div className=" p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
							{/* Full-width image */}
							<img
								src={article.imageUrl}
								alt={article.title}
								className="w-full h-[400px] object-cover rounded-md mb-6" // Make the image full-width
							/>
							<h3 className="text-2xl font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
								{article.title}
							</h3>
							<p className="text-gray-600 text-lg">{article.publisher}</p>
							<div className="mt-4 flex justify-between items-center text-gray-500">
								<span className="text-sm">Views: {article.viewCount}</span>
								<button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300">
									Read More
								</button>
							</div>
						</div>
					</div>
				))}
			</Carousel>
		</div>
	);
};

export default TrendingArticles;
