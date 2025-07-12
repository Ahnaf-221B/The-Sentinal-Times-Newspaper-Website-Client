import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import useAxios from "../../../hooks/useAxios";


const DashboardHome = () => {
	const [publisherStats, setPublisherStats] = useState([]);
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchPublisherStats = async () => {
			try {
				const response = await axiosInstance.get("/articles/stat/publisher-stats");
				setPublisherStats(response.data);
			} catch (error) {
				console.error("Error fetching publisher stats:", error);
			}
		};

		fetchPublisherStats();
	}, []);

	// Prepare data for Pie Chart (dynamic)
	const pieChartData =
		publisherStats.length > 0
			? [
					["Publisher", "Number of Articles"],
					...publisherStats.map((pub) => [pub._id, pub.articleCount]),
			  ]
			: [["No Data", 1]]; // Fallback if no data

	// Static Bar Chart Data
	const barChartData = [
		["Month", "Articles Published"],
		["January", 15],
		["February", 22],
		["March", 18],
		["April", 25],
		["May", 30],
	];

	// Static Line Chart Data
	const lineChartData = [
		["Day", "Active Users"],
		["Mon", 120],
		["Tue", 135],
		["Wed", 150],
		["Thu", 165],
		["Fri", 180],
		["Sat", 200],
		["Sun", 220],
	];

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-center mb-8">Dashboard</h1>

			{/* Dynamic Pie Chart */}
			<div className="mb-8 bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-center mb-4">
					Articles by Publisher
				</h2>
				{publisherStats.length > 0 ? (
					<Chart
						chartType="PieChart"
						width="100%"
						height="400px"
						data={pieChartData}
						options={{
							title: "Article Distribution by Publisher",
							pieHole: 0.4,
							is3D: true,
							colors: ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#673AB7"],
							chartArea: { width: "90%", height: "80%" },
						}}
					/>
				) : (
					<p className="text-center text-gray-500">Loading publisher data...</p>
				)}
			</div>

			{/* Static Bar Chart */}
			<div className="mb-8 bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-center mb-4">
					Monthly Articles Published
				</h2>
				<Chart
					chartType="BarChart"
					width="100%"
					height="400px"
					data={barChartData}
					options={{
						title: "Monthly Article Publication",
						chartArea: { width: "70%" },
						hAxis: {
							title: "Number of Articles",
							minValue: 0,
						},
						vAxis: {
							title: "Month",
						},
						colors: ["#4285F4"],
					}}
				/>
			</div>

			{/* Static Line Chart */}
			<div className="mb-8 bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-center mb-4">
					Weekly Active Users
				</h2>
				<Chart
					chartType="LineChart"
					width="100%"
					height="400px"
					data={lineChartData}
					options={{
						title: "User Activity",
						curveType: "function",
						legend: { position: "bottom" },
						colors: ["#34A853"],
						pointSize: 5,
					}}
				/>
			</div>
		</div>
	);
};

export default DashboardHome;
