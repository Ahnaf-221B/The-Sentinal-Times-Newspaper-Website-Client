import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useAxios from "../../hooks/useAxios";
import { motion } from "framer-motion";

const TrendingArticles = () => {
	const [topArticles, setTopArticles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchTopArticles = async () => {
			try {
				const response = await axiosInstance.get("/articles/slid/top-viewed");
				if (response.data && Array.isArray(response.data)) {
					setTopArticles(response.data);
				}
			} catch (error) {
				console.error("Error fetching top articles:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTopArticles();
	}, []);

	// Loading skeleton
	if (isLoading) {
		return (
			<div className="container mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg">
				<h2 className="text-3xl font-bold text-center mb-8">
					Trending Articles
				</h2>
				<div className="h-96 w-full bg-gray-200 rounded-lg animate-pulse"></div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="container mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg"
		>
			<h2 className="text-3xl font-bold text-center mb-8 text-black bg-clip-text ">
				Trending Articles
			</h2>

			<Carousel
				infiniteLoop={true}
				showThumbs={false}
				showStatus={false}
				autoPlay={true}
				interval={5000}
				transitionTime={700}
				swipeable={true}
				emulateTouch={true}
				renderArrowPrev={(clickHandler, hasPrev) => (
					<button
						onClick={clickHandler}
						disabled={!hasPrev}
						className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				)}
				renderArrowNext={(clickHandler, hasNext) => (
					<button
						onClick={clickHandler}
						disabled={!hasNext}
						className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				)}
			>
				{topArticles.map((article) => (
					<motion.div
						key={article._id}
						whileHover={{ scale: 0.98 }}
						className="flex justify-center items-center px-4 py-8"
					>
						<div className="bg-stone-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 max-w-4xl w-full">
							<div className="flex flex-col md:flex-row gap-6 items-center">
								<div className="md:w-1/2">
									<img
										src={article.imageUrl}
										alt={article.title}
										className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
									/>
								</div>
								<div className="md:w-1/2 flex flex-col justify-between">
									<div>
										<h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-300">
											{article.title}
										</h3>
										<p className="text-gray-600 mb-4">
											{article.description?.substring(0, 150)}...
										</p>
										<div className="flex flex-colitems-center mb-4">
											<span className="text-lg font-medium text-gray-500">
												Publisher
											</span>
											<span className="mx-2 text-gray-300">•</span>
											<span className="text-lg font-medium text-blue-600">
												{article.publisher}
											</span>
										</div>
									</div>

									<div className="flex justify-between items-center">
										

									</div>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</Carousel>
		</motion.div>
	);
};

export default TrendingArticles;
