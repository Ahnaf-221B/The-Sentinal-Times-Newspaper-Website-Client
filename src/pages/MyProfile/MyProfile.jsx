import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext"; // Accessing the AuthContext to get current user
import useAxios from "../../hooks/useAxios";
import { updateProfile } from "firebase/auth"; // Firebase method to update profile
import Swal from "sweetalert2"; // Import SweetAlert2 for better user notifications
import { useQuery, useMutation } from "@tanstack/react-query";

const MyProfile = () => {
	const { user, updateUserProfile } = useContext(AuthContext); // Get current user and update function from AuthContext
	const [error, setError] = useState(null);

	// Use React Query to manage user profile data
	const { data: userData, isLoading: isUserLoading } = useQuery({
		queryKey: ['userProfile', user?.uid],
		queryFn: async () => {
			// If no user is logged in, show authentication required message
			if (!user) {
				Swal.fire({
					title: "Authentication Required",
					text: "Please login to view and update your profile",
					icon: "warning",
					confirmButtonColor: "#3085d6"
				});
				return null;
			}
			// Return user data from AuthContext
			return {
				displayName: user?.displayName || "",
				email: user?.email || "",
				photoURL: user?.photoURL || ""
			};
		},
		enabled: !!user, // Only run this query if user exists
		staleTime: 300000, // 5 minutes
	});

	// Initialize profile data state from query result
	const [profileData, setProfileData] = useState({
		displayName: userData?.displayName || "",
		email: userData?.email || "",
		photoURL: userData?.photoURL || ""
	});

	// Update profile data when userData changes
	React.useEffect(() => {
		if (userData) {
			setProfileData({
				displayName: userData.displayName || "",
				email: userData.email || "",
				photoURL: userData.photoURL || ""
			});
		}
	}, [userData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProfileData({ ...profileData, [name]: value });
	};

	// Use React Query mutation for profile updates
	const { mutate: updateProfile, isPending: loading } = useMutation({
		mutationFn: async (profileData) => {
			return await updateUserProfile(profileData);
		},
		onSuccess: () => {
			// Show success message with SweetAlert2
			Swal.fire({
				title: "Success!",
				text: "Your profile has been updated successfully.",
				icon: "success",
				confirmButtonColor: "#3085d6"
			});
		},
		onError: (error) => {
			setError("Failed to update profile.");
			console.error("Error updating profile:", error);
			
			// Show error message with SweetAlert2
			Swal.fire({
				title: "Error!",
				text: "Failed to update your profile. Please try again.",
				icon: "error",
				confirmButtonColor: "#3085d6"
			});
		}
	});

	const handleProfileUpdate = () => {
		// Show confirmation dialog before updating profile
		Swal.fire({
			title: "Update Profile",
			text: "Are you sure you want to update your profile?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, update it!"
		}).then((result) => {
			if (result.isConfirmed) {
				setError(null);
				updateProfile(profileData);
			}
		})
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-center mb-8">My Profile</h1>

			{isUserLoading ? (
				<div className="text-center py-4">
					<p className="text-gray-600">Loading profile data...</p>
				</div>
			) : error ? (
				<div className="bg-red-500 text-white p-4 rounded mb-6">
					<p>{error}</p>
				</div>
			) : null}

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
