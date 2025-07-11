import React from "react";

const PublisherCard = ({ logoUrl, publisherName }) => {
	return (
		<div className="bg-stone-200 shadow-lg p-4 rounded-lg hover:shadow-xl transition duration-300 ease-in-out">
			<div className="text-center">
				<img
					src={logoUrl}
					alt={publisherName}
					className="w-24 h-24 object-cover mx-auto rounded-full"
				/>
				<h3 className="text-xl font-semibold text-gray-800 mt-4">
					{publisherName}
				</h3>
			</div>
		</div>
	);
};

export default PublisherCard;
