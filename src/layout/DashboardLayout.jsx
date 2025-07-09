import React, { useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
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
				className={`w-64 bg-gray-800 text-white p-5 transition-all duration-300 ${
					isSidebarOpen ? "block" : "hidden sm:block"
				}`}
			>
				<div className="flex items-center mb-6">
					{/* Logo and Title */}
					<img
						src="your-logo-url-here.png" // Replace with your logo image
						alt="Logo"
						className="w-8 h-8 mr-4"
					/>
					<h2 className="text-2xl font-bold">Admin Dashboard</h2>
				</div>

				{/* Sidebar Links */}
				<ul className="space-y-4">
					<li>
						<Link
							to="/admin/all-articles"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaNewspaper />
							<span>All Articles</span>
						</Link>
					</li>
					<li>
						<Link
							to="/admin/all-users"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaUsers />
							<span>All Users</span>
						</Link>
					</li>
					<li>
						<Link
							to="/admin/add-publisher"
							className="flex items-center gap-3 hover:text-gray-400"
						>
							<FaPlus />
							<span>Add Publisher</span>
						</Link>
					</li>
				</ul>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 bg-gray-100 p-8">
				{/* Hamburger Menu for Small Screens */}
				<button
					className="sm:hidden p-2 bg-gray-800 text-white rounded-md"
					onClick={toggleSidebar}
				>
					<FaBars />
				</button>

				<Switch>
					<Route path="/admin/all-articles" component={AllArticles} />
					<Route path="/admin/all-users" component={AllUsers} />
					<Route path="/admin/add-publisher" component={AddPublisher} />
				</Switch>
			</main>
		</div>
	);
};

export default DashboardLayout;
