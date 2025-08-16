import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext
import useAxios from "../../hooks/useAxios"; // Import axiosInstance from the custom hook
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [role, setRole] = useState(null); // Store the user role (admin or user)
	const { user, logOut, isPremium } = useContext(AuthContext); // Get isPremium and user from context
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Toggle Profile dropdown
	const axiosInstance = useAxios(); // Get the axiosInstance

	const toggleMenu = () => setIsOpen(!isOpen);
	const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

	// Handle user logout
	const handleLogout = async () => {
		try {
			await logOut(); // Log the user out using the logOut function from AuthContext
			setRole(null); // Reset role when logging out
		} catch (err) {
			console.error("Logout error:", err.message); // Handle any errors during logout
		}
	};

	// Fetch role when the user is authenticated and has an email
	useEffect(() => {
		const fetchUserRole = async () => {
			if (user?.email) {
				try {
					console.log("Fetching role for user with email:", user.email); // Debugging log

				
					const response = await axiosInstance.get(`/users/${user.email}/role`);

					
					if (response.status === 200) {
						

						
						if (response.data.role) {
							setRole(response.data.role); // Update the role in state
						} else {
							console.error("Role not found in response");
						}
					} else {
						console.error("Error fetching role:", response.statusText);
					}
				} catch (err) {
					console.error("Error fetching user role:", err);
				}
			} else {
				console.error("User email is not available");
			}
		};

		fetchUserRole();
	}, [user]); // Trigger fetch when `user` changes

	// Log the role to check if it's being set properly
	useEffect(() => {
		console.log("User role:", role); // Debugging: check the role state after fetch
	}, [role]);

	// Navigation items with their corresponding routes
	const getNavItems = () => {

		if (!user) {
			return [
				{ name: "Home", path: "/" },
				{ name: "All Articles", path: "/all-articles" },
				{ name: "Subscription", path: "/subscription" },
			];
		}
		const items = [
			{ name: "Home", path: "/" },
			{ name: "Add Article", path: "/add-article" },
			{ name: "All Articles", path: "/all-articles" },
			{ name: "Subscription", path: "/subscription" },
			{ name: "My Article", path: "/my-article" },
		];

		// Add premium article link if user is premium
		if (isPremium) {
			items.splice(3, 0, {
				name: "Premium Articles",
				path: "/premium-article",
			});
		}

		// Add dashboard if admin
		if (role === "admin") {
			items.push({ name: "Dashboard", path: "/dashboard" });
		}

		return items;
	};

	return (
		<nav className="bg-stone-200 shadow-lg noticia sticky z-50 top-0">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="flex items-center space-x-2 flex-shrink-0">
						<img
							src="https://i.postimg.cc/fy4csVxj/image.png"
							alt="DailyNews Logo"
							className="h-12 w-12 object-cover rounded-full"
						/>
						<h1 className="text-2xl font-bold text-gray-800">
							The Sentinal <br /> <span className="ml-19">Times</span>
						</h1>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex space-x-6 items-center">
						{getNavItems().map(
							(item) =>
								item && (
									<NavLink
										key={item.name}
										to={item.path}
										className={({ isActive }) =>
											`px-1 py-2 text-sm font-medium ${
												isActive
													? "text-blue-600 border-b-2 border-blue-600"
													: "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-300"
											}`
										}
									>
										{item.name}
									</NavLink>
								)
						)}
					</div>

					{/* Auth Buttons and Profile */}
					<div className="flex items-center space-x-4">
						{user ? (
							<>
								<div className="relative">
									<img
										src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
										alt="profile"
										className="h-10 w-10 rounded-full border border-gray-400 cursor-pointer"
										onClick={toggleProfileMenu}
									/>
									{/* Profile dropdown */}
									{isProfileMenuOpen && (
										<div className="absolute top-10 right-0 bg-white border shadow-md rounded-lg p-2 w-48">
											<p className="text-sm font-semibold text-gray-800">
												{user.displayName || "User"}
											</p>
											<p className="text-xs text-gray-500">{user.email}</p>
											<div className="mt-3 space-y-2">
												<Link
													to="/my-profile"
													className="block text-left pytext-sm font-medium text-gray-700 hover:underline rounded-md transition"
													role="button"
												>
													My Profile
												</Link>
												<button
													onClick={handleLogout} // Logout when the button is clicked
													className="block text-left text-sm font-medium bg-red-500 p-1 text-white rounded-md transition"
												>
													Logout
												</button>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-gray-700 font-medium hover:text-blue-600"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
								>
									Register
								</Link>
							</>
						)}

						{/* Hamburger */}
						<button
							className="md:hidden text-gray-700 focus:outline-none text-2xl"
							onClick={toggleMenu}
							aria-label="Toggle menu"
						>
							☰
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
					{getNavItems().map(
						(item) =>
							item && (
								<NavLink
									key={item.name}
									to={item.path}
									className={
										({ isActive }) =>
											`block px-3 py-2 ${
												isActive
													? "text-blue-600 font-medium"
													: "text-gray-700 hover:text-blue-600"
											}` // Ensure that mobile menu links are styled correctly
									}
									onClick={toggleMenu}
								>
									{item.name}
								</NavLink>
							)
					)}

					<div className="pt-4 border-t border-gray-300">
						{user ? (
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<img
										src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
										alt="profile"
										className="h-10 w-10 rounded-full border border-gray-400"
									/>
									<span className="text-gray-700 text-sm font-medium">
										{user.displayName || "User"}
									</span>
								</div>
								<button
									onClick={handleLogout} // Logout when the button is clicked
									className="text-red-600 text-sm font-medium hover:underline"
								>
									Logout
								</button>
							</div>
						) : (
							<>
								<NavLink
									to="/login"
									className={
										({ isActive }) =>
											`block px-3 py-2 mb-2 ${
												isActive
													? "text-blue-600 font-medium"
													: "text-gray-700 hover:text-blue-600"
											}` // Ensure that mobile menu links are styled correctly
									}
									onClick={toggleMenu}
								>
									Login
								</NavLink>
								<NavLink
									to="/register"
									className={
										({ isActive }) =>
											`inline-block px-3 py-1 rounded text-sm ${
												isActive
													? "bg-blue-700 text-white"
													: "bg-blue-600 text-white hover:bg-blue-700"
											}` // Ensure mobile Register button is styled
									}
									onClick={toggleMenu}
								>
									Register
								</NavLink>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
