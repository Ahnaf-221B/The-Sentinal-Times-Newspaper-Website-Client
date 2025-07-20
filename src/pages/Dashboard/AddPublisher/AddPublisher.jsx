import React, { useState } from "react";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";

const AddPublisher = () => {
	const [publisherName, setPublisherName] = useState("");
	const [logoFile, setLogoFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosInstance = useAxios();

	const handleUploadImage = async (e) => {
		const image = e.target.files[0];
		const formData = new FormData();
		formData.append("image", image);

		const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
			import.meta.env.VITE_image_upload_key
		}`;

		setIsLoading(true);

		try {
			const res = await axiosInstance.post(imageUploadUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setLogoFile(res.data.data.url);
			setIsLoading(false);
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload image.");
			setIsLoading(false);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		
		if (!publisherName || !logoFile) {
			toast.error("Please provide both publisher name and logo.");
			console.log("Missing data:", { publisherName, logoFile });
			return;
		}

		setIsLoading(true); 

		try {
			const response = await axiosInstance.post("/publishers", {
				publisherName,
				logoUrl: logoFile,
			});

			if (response.status === 201) {
				toast.success("Publisher added successfully!");
				setPublisherName("");
				setLogoFile(null);
			}
		} catch (error) {
			toast.error("Failed to add publisher.");
			console.error("Error adding publisher:", error);
		} finally {
			setIsLoading(false); // Reset loading once the form submission is completed
		}
	};

	return (
		<div className="p-12 w-full mx-auto bg-stone-200 rounded-lg shadow-lg ">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">Add Publisher</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Publisher Name */}
				<div>
					<label
						htmlFor="publisherName"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Publisher Name
					</label>
					<input
						type="text"
						id="publisherName"
						value={publisherName}
						onChange={(e) => setPublisherName(e.target.value)}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="Enter publisher name"
					/>
				</div>

				{/* Publisher Logo */}
				<div>
					<label
						htmlFor="publisherLogo"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Publisher Logo
					</label>
					<input
						type="file"
						id="publisherLogo"
						accept="image/*"
						onChange={handleUploadImage} // Call the image upload function
						className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isLoading} // Disable button when loading
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					{isLoading ? "Adding..." : "Add Publisher"}{" "}
					{/* Show different text based on loading state */}
				</button>
			</form>
		</div>
	);
};

export default AddPublisher;
