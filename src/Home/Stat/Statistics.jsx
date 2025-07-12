import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import useAxios from "../../hooks/useAxios";

const Statistics = () => {
	const [stats, setStats] = useState({
		totalUsers: 0,
		normalUsers: 0,
		premiumUsers: 0,
	});

	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await axiosInstance.get("/users/stats");
				setStats(response.data); // Set stats in state
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};

		fetchStats();
	}, []); // Run this effect once on mount

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-center mb-8">
				User Statistics
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Total Users Section */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
					<div className="text-3xl font-bold text-blue-600">
						<CountUp
							end={stats.totalUsers}
							duration={6} // Slower transition
							delay={0}
							easing="easeInOutCubic" // Adding an easing function for a smooth transition
						/>
					</div>
				</div>

				{/* Normal Users Section */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-700">Normal Users</h2>
					<div className="text-3xl font-bold text-green-600">
						<CountUp
							end={stats.normalUsers}
							duration={6} // Slower transition
							delay={0}
							easing="easeInOutCubic" // Adding an easing function for smooth transition
						/>
					</div>
				</div>

				{/* Premium Users Section */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-700">Premium Users</h2>
					<div className="text-3xl font-bold text-yellow-600">
						<CountUp
							end={stats.premiumUsers}
							duration={6} // Slower transition
							delay={0}
							easing="easeInOutCubic" // Adding an easing function for smooth transition
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Statistics;
