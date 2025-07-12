import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext"; // Accessing the AuthContext to get current user
import useAxios from "../../hooks/useAxios";
import { updateProfile } from "firebase/auth"; // Firebase method to update profile

const MyProfile = () => {
	const { user, updateUserProfile } = useContext(AuthContext); // Get current user and update function from AuthContext
	const [profileData, setProfileData] = useState({
		displayName: user?.displayName || "", // Default to user displayName
		email: user?.email || "", // Default to user email
		photoURL: user?.photoURL || "", // Default to user photoURL
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const axiosInstance = useAxios();

	useEffect(() => {
		if (!user) {
			// Redirect or handle if the user is not logged in
			// Optionally, you can redirect to login page
			alert("Please login to view and update your profile");
		}
	}, [user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProfileData({ ...profileData, [name]: value });
	};

	const handleProfileUpdate = async () => {
		setLoading(true);
		setError(null);

		try {
			// Use the updateUserProfile from AuthContext to update the user's profile
			await updateUserProfile(profileData);
			alert("Profile updated successfully!");
		} catch (error) {
			setError("Failed to update profile.");
			console.error("Error updating profile:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-center mb-8">My Profile</h1>

			{error && (
				<div className="bg-red-500 text-white p-4 rounded mb-6">
					<p>{error}</p>
				</div>
			)}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleProfileUpdate();
				}}
				className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
			>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						type="text"
						name="displayName"
						value={profileData.displayName}
						onChange={handleInputChange}
						className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						placeholder="Your full name"
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						name="email"
						value={profileData.email}
						onChange={handleInputChange}
						className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						placeholder="Your email address"
						disabled
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Profile Picture URL
					</label>
					<input
						type="text"
						name="photoURL"
						value={profileData.photoURL}
						onChange={handleInputChange}
						className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
						placeholder="Link to your profile picture"
					/>
				</div>

				<button
					type="submit"
					className={`w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
						loading ? "opacity-50 cursor-not-allowed" : ""
					}`}
					disabled={loading}
				>
					{loading ? "Updating..." : "Update Profile"}
				</button>
			</form>
		</div>
	);
};

export default MyProfile;
