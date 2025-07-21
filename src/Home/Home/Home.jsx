import React, { useState, useEffect } from "react";
import FactCheck from "../FactCheck/FactCheck";
import VoiceTrend from "../VoiceTrend/VoiceTrend";
import Plans from "../Plans/Plans";
import PublisherCard from "../../pages/Publisher/PublisherCard";
import PublisherList from "../../pages/Publisher/PublisherLIst";
import TrendingArticles from "../../pages/TrendingArticles/TrendingArticles";
import Statistics from "../Stat/Statistics";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	// Trigger the modal after 10 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowModal(true); // Show the modal after 10 seconds
		}, 10000); // 10000ms = 10 seconds

		return () => clearTimeout(timer); // Cleanup timeout if the component unmounts
	}, []);

	const handleNavigateToSubscription = () => {
		navigate("/subscription"); // Navigate to the subscription page
	};

	return (
		<div className="bg-stone-100">
			<title>Home</title>
			<TrendingArticles />
			<Statistics />
			<PublisherList />
			<Plans />
			<FactCheck />
			<VoiceTrend />

			{/* Modal for subscription */}
			{showModal && (
				<div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
					<div className="bg-white p-8 rounded-lg shadow-lg w-96">
						<h2 className="text-2xl font-semibold text-center mb-4">
							Exclusive Offer
						</h2>
						<p className="text-gray-600 mb-4">
							Take your experience to the next level with our premium
							subscription!
						</p>
						<button
							onClick={handleNavigateToSubscription}
							className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
						>
							Subscribe Now
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
