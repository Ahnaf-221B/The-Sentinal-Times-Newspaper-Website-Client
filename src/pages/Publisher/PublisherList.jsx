import React from "react";
import useAxios from "../../hooks/useAxios"; // Assuming you have a custom Axios hook
import PublisherCard from "./PublisherCard"; // Import PublisherCard Component
import { useQuery } from "@tanstack/react-query";

const PublisherList = () => {
	const axiosInstance = useAxios();

	// Fetch publishers using React Query
	const {
		data: publishers = [], // Default to an empty array if no data is returned
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["publishers"],
		queryFn: async () => {
			const response = await axiosInstance.get("/publishers");
			// Log response to see its structure
			console.log("Response Data:", response.data);
			return response.data; // Ensure that this is an array
		},
		staleTime: 300000, // 5 minutes
		retryOnError: true,
		retryDelay: 3000, // 3 seconds
	});

	// Check if publishers is an array, if not log an error
	if (!Array.isArray(publishers)) {
		console.error("Expected publishers to be an array but got", publishers);
	}

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-3xl font-semibold text-center mb-8 mt-12">
				Publishers
			</h2>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : isError ? (
				<div className="text-center text-red-500 p-4">
					Error loading publishers: {error?.message || "Unknown error"}
				</div>
			) : !Array.isArray(publishers) || publishers.length === 0 ? (
				<div className="text-center text-gray-500 p-4">
					No publishers available at the moment.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
					{/* Render Publisher Card for each publisher */}
					{publishers.map((publisher) => (
						<div key={publisher._id}>
							<PublisherCard
								logoUrl={publisher.logoUrl}
								publisherName={publisher.publisherName}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PublisherList;
