import React from "react";
import CountUp from "react-countup";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const Statistics = () => {
	const axiosInstance = useAxios();

	// Fetch statistics using React Query
	const { 
		data: stats = {
			totalUsers: 0,
			normalUsers: 0,
			premiumUsers: 0,
		}, 
		isLoading, 
		isError, 
		error 
	} = useQuery({
		queryKey: ['user-statistics'],
		queryFn: async () => {
			const response = await axiosInstance.get("/users/stats");
			return response.data;
		},
		staleTime: 300000, // 5 minutes
		retryOnError: true,
		retryDelay: 3000, // 3 seconds
	});

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-center mb-8">
				User Statistics
			</h1>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : isError ? (
				<div className="text-center text-red-500 p-4">
					Error loading statistics: {error?.message || 'Unknown error'}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
			)}
		</div>
	);
};

export default Statistics;
