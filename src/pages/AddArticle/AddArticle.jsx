import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios"; // axios for making HTTP requests
import Select from "react-select"; // react-select for multi-select
import useAxios from "../../hooks/useAxios";

const AddArticle = () => {
	const [publishers, setPublishers] = useState([]); // State to store publishers
	const [imageUrl, setImageUrl] = useState(""); // State for image URL
	const [error, setError] = useState(""); // State to store error messages
    const axiosInstance = useAxios()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// Fetch publishers when the component mounts
	useEffect(() => {
		const fetchPublishers = async () => {
			try {
				const response = await axiosInstance.get("/publishers");
				const publisherOptions = response.data.map((publisher) => ({
					value: publisher._id,
					label: publisher.publisherName,
				}));
				setPublishers(publisherOptions); // Update publishers state
			} catch (error) {
				console.error("Error fetching publishers", error);
				setError("Failed to load publishers");
				toast.error("Failed to load publishers.");
			}
		};

		fetchPublishers(); // Call function to fetch publishers
	}, []);

	// Handle image upload via ImgBB
	const handleUploadImage = async (e) => {
		const image = e.target.files[0]; // Get the selected image
		const formData = new FormData();
		formData.append("image", image); // Append image to formData

		const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
			import.meta.env.VITE_image_upload_key
		}`;

		try {
			const res = await axiosInstance.post(imageUploadUrl, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setImageUrl(res.data.data.url); // Set the image URL
			toast.success("Image uploaded successfully!");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload image.");
		}
	};

	// Handle form submission
	const onSubmit = async (data) => {
		const { title, publisher, tags, description } = data;

		if (!imageUrl) {
			toast.error("Please upload an image for the article.");
			return;
		}

		try {
			const articleData = {
				title,
				publisherId: publisher.value,
				imageUrl,
				tags: tags.map((tag) => tag.value),
				description,
				status: "pending", // Set initial status to pending
				createdAt: new Date().toISOString(),
			};

			const response = await axios.post("/articles", articleData);

			if (response.status === 201) {
				toast.success(
					"Article submitted successfully! Awaiting admin approval."
				);
				setImageUrl(""); // Reset the image URL
				document.getElementById("articleForm").reset(); // Reset form
			}
		} catch (error) {
			console.error("Error submitting article:", error);
			toast.error("Failed to submit article.");
		}
	};

	return (
		<div className="p-8 bg-stone-200 rounded-lg shadow-lg max-w-3xl mx-auto mt-10 mb-10">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">Add Article</h1>
			{error && <p className="text-red-500 mb-4">{error}</p>}{" "}
			{/* Show error if publishers failed to load */}
			<form
				id="articleForm"
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6"
			>
				{/* Title */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">
						Article Title
					</label>
					<input
						type="text"
						{...register("title", { required: "Title is required" })}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
						placeholder="Enter article title"
					/>
					{errors.title && (
						<p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
					)}
				</div>

				{/* Publisher Dropdown */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">Publisher</label>
					<select
						{...register("publisher", { required: "Publisher is required" })}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					>
						<option value="">Select Publisher</option>
						{publishers.map((publisher) => (
							<option key={publisher.value} value={publisher.value}>
								{publisher.label}
							</option>
						))}
					</select>
					{errors.publisher && (
						<p className="text-red-500 text-xs mt-1">
							{errors.publisher.message}
						</p>
					)}
				</div>

				{/* Tags (react-select multi select) */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">Tags</label>
					<Select
						{...register("tags", { required: "At least one tag is required" })}
						isMulti
						options={[
							{ value: "technology", label: "Technology" },
							{ value: "health", label: "Health" },
							{ value: "business", label: "Business" },
							{ value: "education", label: "Education" },
						]}
					/>
					{errors.tags && (
						<p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
					)}
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">
						Description
					</label>
					<textarea
						{...register("description", {
							required: "Description is required",
						})}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
						placeholder="Enter article description"
					></textarea>
					{errors.description && (
						<p className="text-red-500 text-xs mt-1">
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Image Upload */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">
						Upload Image
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleUploadImage}
						className="w-full px-4 py-2 file:bg-gray-100 file:border-none file:rounded file:px-3 file:py-1 file:cursor-pointer"
					/>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
					>
						Submit Article
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddArticle;
