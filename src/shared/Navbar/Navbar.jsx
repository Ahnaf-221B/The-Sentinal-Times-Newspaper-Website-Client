import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<nav className="bg-stone-100 shadow-md noticia">
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
						{[
							"Home",
							"World",
							"Politics",
							"Sports",
							"Entertainment",
							"Opinion",
						].map((item) => (
							<a
								key={item}
								href="#"
								className="text-gray-700 hover:text-blue-600"
							>
								{item}
							</a>
						))}
					</div>

					{/* Login/Register & Hamburger */}
					<div className="flex items-center space-x-4">
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

						{/* Hamburger (Mobile) */}
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
				<div className="md:hidden px-4 pb-4 space-y-2">
					{[
						"Home",
						"World",
						"Politics",
						"Sports",
						"Entertainment",
						"Opinion",
					].map((item) => (
						<a
							key={item}
							href="#"
							className="block text-gray-700 hover:text-blue-600"
						>
							{item}
						</a>
					))}

					{/* Mobile Login/Register */}
					<div className="pt-4 border-t border-gray-300">
						<Link
							to="/login"
							className="block text-gray-700 hover:text-blue-600 mb-2"
						>
							Login
						</Link>
						<Link
							to="/register"
							className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
						>
							Register
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
