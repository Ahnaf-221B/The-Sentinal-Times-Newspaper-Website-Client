import { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import useAxios from "../../hooks/useAxios";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [role, setRole] = useState(null); // Store the user role (admin or user)
	const [isPremium, setIsPremium] = useState(false); // Track premium status
	const { user, logOut, updateUserProfile } = useContext(AuthContext);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Toggle Profile dropdown
	const axiosInstance = useAxios();

	const toggleMenu = () => setIsOpen(!isOpen);
	const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

	const handleLogout = async () => {
		try {
			await logOut();
			console.log("User logged out");
			setRole(null); // Reset role when logging out
			setIsPremium(false); // Reset premium status
		} catch (err) {
			console.error("Logout error:", err.message);
		}
	};

	// Fetch user's role and premium status from the backend when the user is logged in
	useEffect(() => {
		if (user?.email) {
			const fetchUserStatus = async () => {
				try {
					// Check premium status first
					const premiumRes = await axiosInstance.get(
						`/users/${user.email}/premium-status`
					);
					setIsPremium(premiumRes.data.isPremium);

					// Then check role
					const roleRes = await axiosInstance.get(`/users/${user.email}/role`);
					setRole(roleRes.data.role);
				} catch (err) {
					console.error("Error fetching user status:", err);
					setIsPremium(false);
					setRole("user");
				}
			};

			fetchUserStatus();

			// Set up interval to check premium status periodically
			const interval = setInterval(fetchUserStatus, 30000); // Check every 30 seconds
			return () => clearInterval(interval);
		}
	}, [user]);

	// Navigation items with their corresponding routes
	const getNavItems = () => {
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

	const handleProfileUpdate = async (profileInfo) => {
		try {
			// Use the updateUserProfile method from AuthContext to update the profile
			await updateUserProfile(profileInfo);
			alert("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile:", error);
			alert("Failed to update profile.");
		}
	};

	return (
		<nav className="bg-stone-200 shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="flex items-center space-x-2 flex-shrink-0">
						<img
							src="https://i.postimg.cc/fy4csVxj/image.png"
							alt="DailyNews Logo"
							className="h-12 w-12 object-contain"
						/>
						<h1 className="text-2xl font-bold text-gray-800">DailyNews</h1>
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
											<div className="mt-3">
												<Link
													to="/my-profile"
													className="text-sm text-blue-600 hover:underline"
												>
													My Profile
												</Link>
											</div>
											<button
												onClick={handleLogout}
												className="mt-3 text-red-600 text-sm hover:underline"
											>
												Logout
											</button>
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
									className={({ isActive }) =>
										`block px-3 py-2 ${
											isActive
												? "text-blue-600 font-medium"
												: "text-gray-700 hover:text-blue-600"
										}`
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
									onClick={handleLogout}
									className="text-red-600 text-sm font-medium hover:underline"
								>
									Logout
								</button>
							</div>
						) : (
							<>
								<NavLink
									to="/login"
									className={({ isActive }) =>
										`block px-3 py-2 mb-2 ${
											isActive
												? "text-blue-600 font-medium"
												: "text-gray-700 hover:text-blue-600"
										}`
									}
									onClick={toggleMenu}
								>
									Login
								</NavLink>
								<NavLink
									to="/register"
									className={({ isActive }) =>
										`inline-block px-3 py-1 rounded text-sm ${
											isActive
												? "bg-blue-700 text-white"
												: "bg-blue-600 text-white hover:bg-blue-700"
										}`
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
