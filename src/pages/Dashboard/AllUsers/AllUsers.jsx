import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios"; // Assuming this path is correct for your useAxios hook

const AllUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const axiosInstance = useAxios(); // Initialize your custom axios instance

	// Function to fetch all users from the backend
	const fetchUsers = async () => {
		setLoading(true);
		setError(null);
		try {
			// Assuming your backend has an endpoint like /users to get all users
			const response = await axiosInstance.get("/users");

			if (response.status === 200) {
				// Assuming the response data is an array of user objects
				setUsers(response.data);
			} else {
				setError("Failed to load users.");
				toast.error("Failed to load users.");
			}
		} catch (err) {
			console.error("Error fetching users:", err);
			setError("Failed to load users. Please try again later.");
			toast.error("Failed to load users.");
		} finally {
			setLoading(false);
		}
	};

	// useEffect to fetch users when the component mounts
	useEffect(() => {
		fetchUsers();
	}, [axiosInstance]); // Re-run if axiosInstance changes (though typically it won't)

	// Function to handle making a user an admin
	const handleMakeAdmin = async (userId) => {
		try {
			// Assuming your backend has an endpoint like /users/:id/make-admin
			// and it updates the user's role to 'admin'
			const response = await axiosInstance.patch(`/users/${userId}/make-admin`);

			if (response.status === 200) {
				toast.success("User is now an admin!");
				// Optimistically update the UI or refetch users to show the change
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user._id === userId ? { ...user, role: "admin" } : user
					)
				);
			}
		} catch (err) {
			console.error("Error making user admin:", err);
			toast.error("Failed to make user admin.");
		}
	};

	if (loading) {
		return (
			<div className="flex-1 p-8 flex justify-center items-center">
				<p className="text-lg text-gray-700">Loading users...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 p-8 flex justify-center items-center">
				<p className="text-lg text-red-600">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex-1 p-8 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-8 text-gray-800">All Users</h1>

			{users.length === 0 ? (
				<p className="text-gray-600">No users found.</p>
			) : (
				<div className="overflow-x-auto bg-white rounded-lg shadow-lg">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Profile Picture
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Email
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{users.map((user) => (
								<tr key={user._id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<img
													className="h-10 w-10 rounded-full object-cover"
													src={
														user.photoURL ||
														"https://placehold.co/40x40/cccccc/ffffff?text=User"
													} // Placeholder if no photo
													alt={`${user.fullName || user.name}'s profile`} // Updated alt text
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															"https://placehold.co/40x40/cccccc/ffffff?text=User";
													}} // Fallback on error
												/>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{user.fullName || user.name || "N/A"}{" "}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{user.email || "N/A"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										{user.role === "admin" ? (
											<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
												Admin
											</span>
										) : (
											<button
												onClick={() => handleMakeAdmin(user._id)}
												className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
											>
												Make Admin
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AllUsers;
