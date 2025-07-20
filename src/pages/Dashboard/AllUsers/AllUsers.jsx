import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios"; // Assuming this path is correct for your useAxios hook
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Assuming this path is correct for your useAxios hook
const AllUsers = () => {
	const [users, setUsers] = useState([]); // Users data
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state
	const [currentPage, setCurrentPage] = useState(1); // Current page number
	const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
	const [itemsPerPage] = useState(10); // Number of items per page
	const axiosInstance = useAxios(); // Axios instance
	const axiosSecure =  useAxiosSecure(); // Axios instance with secure headers

	// Function to fetch all users from the backend with pagination
	const fetchUsers = async (page) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axiosSecure.get("/users", {
				params: { page, limit: itemsPerPage },
			});

			if (response.status === 200) {
				setUsers(response.data.users);
				setTotalPages(response.data.totalPages); // Set total pages
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

	// useEffect to fetch users when the component mounts or page changes
	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage]);

	// Function to handle making a user an admin
	const handleMakeAdmin = async (userId) => {
		try {
			const response = await axiosSecure.patch(`/users/${userId}/make-admin`);

			if (response.status === 200) {
				toast.success("User is now an admin!");
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

	// Handle page change (prev/next)
	const handlePageChange = (page) => {
		if (page < 1 || page > totalPages) return; // Prevent going out of bounds
		setCurrentPage(page);
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
		<div className="p-8 bg-gray-200 min-h-screen w-full">
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
													}
													alt={`${user.fullName || user.name}'s profile`}
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															"https://placehold.co/40x40/cccccc/ffffff?text=User";
													}}
												/>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{user.fullName || user.name || "N/A"}
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

			{/* Pagination Controls */}
			<div className="mt-6 flex justify-center">
				<button
					className="px-4 py-2 bg-gray-500 text-white rounded-lg mx-2"
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}
				>
					Prev
				</button>
				<span className="px-4 py-2 text-lg font-medium">{currentPage}</span>
				<button
					className="px-4 py-2 bg-gray-500 text-white rounded-lg mx-2"
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default AllUsers;
