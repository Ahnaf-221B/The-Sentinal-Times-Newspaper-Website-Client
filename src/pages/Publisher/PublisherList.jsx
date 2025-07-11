import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios"; // Assuming you have a custom Axios hook
import PublisherCard from "./PublisherCard"; // Import PublisherCard Component

const PublisherList = () => {
	const [publishers, setPublishers] = useState([]);
	const axiosInstance = useAxios();

	useEffect(() => {
		// Fetch publishers from the API
		const fetchPublishers = async () => {
			try {
				const response = await axiosInstance.get("/publishers");
				setPublishers(response.data); // Set publishers data from API response
			} catch (error) {
				console.error("Error fetching publishers", error);
			}
		};

		fetchPublishers();
	}, [axiosInstance]);

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-3xl font-semibold text-center mb-8 mt-12">Publishers</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
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
		</div>
	);
};

export default PublisherList;
