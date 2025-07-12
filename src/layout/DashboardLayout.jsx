import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaNewspaper, FaPlus, FaBars } from "react-icons/fa";

const DashboardLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle Sidebar
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<aside
				className={`sticky top-0 z-50 w-64 bg-gray-800 text-white p-8 transition-all duration-300 ${
					isSidebarOpen ? "block" : "hidden sm:block"
				}`}
			>
				<div className="flex items-center mb-6">
					{/* Logo and Title */}
					<img
						src="https://i.postimg.cc/fy4csVxj/image.png" // Replace with your logo image
						alt="Logo"
						className="w-8 h-8 mr-4"
					/>
					<h2 className="text-2xl font-bold">Admin Dashboard</h2>
				</div>

				{/* Sidebar Links */}
				<ul className="space-y-4">
					<li>
						<NavLink
							to="/"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaHome />
							<span>Home</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/dashboard/all-articles"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaNewspaper />
							<span>All Articles</span>
						</NavLink>
					</li>
					<li>
						<Link
							to="/dashboard/all-users"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaUsers />
							<span>All Users</span>
						</Link>
					</li>
					<li>
						<NavLink
							to="/dashboard/add-publisher"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaPlus />
							<span>Add Publisher</span>
						</NavLink>
					</li>
				</ul>
			</aside>
			<Outlet></Outlet>
			{/* Main Content Area */}
			<main className="flex-1 bg-gray-100 ">
				{/* Hamburger Menu for Small Screens */}
				<button
					className="sm:hidden p-2 bg-gray-800 text-white rounded-md"
					onClick={toggleSidebar}
				>
					<FaBars />
				</button>
			</main>
		</div>
	);
};

export default DashboardLayout;
