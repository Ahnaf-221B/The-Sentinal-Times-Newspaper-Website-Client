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

	

	return (
		<div className="bg-stone-100">
			<title>Home</title>
			<TrendingArticles />
			<Statistics />
			<PublisherList />
			<Plans />
			<FactCheck />
			<VoiceTrend />

			
		</div>
	);
};

export default Home;
