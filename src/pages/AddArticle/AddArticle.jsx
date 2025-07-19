import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";

const AddArticle = () => {
	const [imageUrl, setImageUrl] = useState("");
	const [error, setError] = useState("");
	const axiosInstance = useAxios();
	const axiosSecure = useAxiosSecure();
	const { user } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm();

	// Check user's status with TanStack Query
	const { data: userStatus = { isPremium: false, hasArticle: false } } =
		useQuery({
			queryKey: ["userStatus", user?.email],
			queryFn: async () => {
				if (!user?.email) return { isPremium: false, hasArticle: false };

				try {
					// Check premium status
					const premiumRes = await axiosInstance.get(
						`/users/${user.email}/premium-status`
					);
					const isPremium = premiumRes.data.isPremium;

					// Check existing articles only if not premium
					let hasArticle = false;
					if (!isPremium) {
						const articlesRes = await axiosInstance.get(`/articles/myarticle`, {
							params: { email: user.email },
						});
						hasArticle = articlesRes.data.length > 0;
					}

					return { isPremium, hasArticle };
				} catch (error) {
					console.error("Error checking user status:", error);
					toast.error("Failed to verify user status.");
					return { isPremium: false, hasArticle: false };
				}
			},
			enabled: !!user?.email,
		});

	// Fetch publishers with TanStack Query
	const { data: publishers = [] } = useQuery({
		queryKey: ["publishers"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("/publishers");
				return response.data.map((publisher) => ({
					value: publisher._id,
					label: publisher.publisherName,
				}));
			} catch (error) {
				console.error("Error fetching publishers", error);
				setError("Failed to load publishers");
				toast.error("Failed to load publishers.");
				return [];
			}
		},
	});

	// Handle image upload
	const handleUploadImage = async (e) => {
		const image = e.target.files[0];
		if (!image) return;

		const formData = new FormData();
		formData.append("image", image);

		try {
			const res = await axiosInstance.post(
				`https://api.imgbb.com/1/upload?key=${
					import.meta.env.VITE_image_upload_key
				}`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			setImageUrl(res.data.data.url);
			toast.success("Image uploaded successfully!");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload image.");
		}
	};

	// Handle form submission
	const onSubmit = async (data) => {
		// Frontend validation (redundant check for better UX)
		if (userStatus.hasArticle && !userStatus.isPremium) {
			toast.error(
				"Normal users can only publish one article. Upgrade to premium to publish more."
			);
			return;
		}

		if (!imageUrl) {
			toast.error("Please upload an image for the article.");
			return;
		}

		const selectedPublisher = publishers.find(
			(pub) => pub.value === data.publisher.value
		);

		const articleData = {
			authorName: user.displayName,
			authorImage: user.photoURL,
			authorEmail: user.email,
			publisher: selectedPublisher?.label || "",
			title: data.title,
			publisherId: data.publisher.value,
			imageUrl,
			tags: data.tags.map((tag) => tag.value),
			description: data.description,
			status: "pending",
			createdAt: new Date().toISOString(),
		};

		try {
			const response = await axiosSecure.post("/articles", articleData);
			if (response.status === 201) {
				toast.success(
					"Article submitted successfully! Awaiting admin approval."
				);
				setImageUrl("");
				reset();
				// Note: In a real app, you might want to invalidate the userStatus query here
			}
		} catch (error) {
			console.error("Error submitting article:", error);
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Failed to submit article.");
			}
		}
	};

	// Show upgrade message if normal user already has an article
	if (userStatus.hasArticle && !userStatus.isPremium) {
		return (
			<div className="p-8 bg-stone-200 rounded-lg shadow-lg max-w-3xl mx-auto mt-10 mb-10">
				<h1 className="text-3xl font-bold mb-6 text-gray-800">Add Article</h1>
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
					<p className="font-bold">Article Limit Reached</p>
					<p>
						You've already submitted one article. Upgrade to premium to submit
						unlimited articles.
					</p>
				</div>
				<button
					onClick={() => (window.location.href = "/subscription")}
					className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
				>
					Upgrade to Premium
				</button>
			</div>
		);
	}

	return (
		<div className="p-8 bg-stone-200 rounded-lg shadow-lg max-w-3xl mx-auto mt-10 mb-10">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">Add Article</h1>
			{error && <p className="text-red-500 mb-4">{error}</p>}

			{userStatus.isPremium && (
				<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
					<p className="font-bold">Premium User Benefits</p>
					<p>
						You can publish unlimited articles with your premium subscription.
					</p>
				</div>
			)}

			<form
				id="articleForm"
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6"
			>
				{/* Title field */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">
						Article Title *
					</label>
					<input
						type="text"
						{...register("title", {
							required: "Title is required",
							minLength: {
								value: 5,
								message: "Title must be at least 5 characters",
							},
						})}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
						placeholder="Enter article title"
					/>
					{errors.title && (
						<p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
					)}
				</div>

				{/* Publisher dropdown */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">
						Publisher *
					</label>
					<Controller
						name="publisher"
						control={control}
						rules={{ required: "Publisher is required" }}
						render={({ field }) => (
							<Select
								{...field}
								options={publishers}
								placeholder="Select Publisher"
								className="basic-multi-select"
								classNamePrefix="select"
								isLoading={!publishers.length}
							/>
						)}
					/>
					{errors.publisher && (
						<p className="text-red-500 text-xs mt-1">
							{errors.publisher.message}
						</p>
					)}
				</div>

				{/* Tags multi-select */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">Tags *</label>
					<Controller
						name="tags"
						control={control}
						rules={{
							required: "At least one tag is required",
							validate: (value) =>
								value.length > 0 || "Select at least one tag",
						}}
						render={({ field }) => (
							<Select
								{...field}
								isMulti
								options={[
									{ value: "technology", label: "Technology" },
									{ value: "health", label: "Health" },
									{ value: "business", label: "Business" },
									{ value: "education", label: "Education" },
								]}
								placeholder="Select tags"
								className="basic-multi-select"
								classNamePrefix="select"
							/>
						)}
					/>
					{errors.tags && (
						<p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
					)}
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">
						Description *
					</label>
					<textarea
						{...register("description", {
							required: "Description is required",
							minLength: {
								value: 50,
								message: "Description must be at least 50 characters",
							},
						})}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
						placeholder="Enter article description"
						rows="5"
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
						Article Image *
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleUploadImage}
						className="w-full px-4 py-2 file:bg-gray-100 file:border-none file:rounded file:px-3 file:py-1 file:cursor-pointer"
						required
					/>
					{imageUrl && (
						<div className="mt-2">
							<img
								src={imageUrl}
								alt="Preview"
								className="h-40 object-cover rounded"
							/>
							<p className="text-green-600 text-sm mt-1">
								Image uploaded successfully!
							</p>
						</div>
					)}
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
						disabled={!imageUrl}
					>
						Submit Article
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddArticle;
