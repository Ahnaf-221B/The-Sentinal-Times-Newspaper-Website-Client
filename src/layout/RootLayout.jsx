import React from "react";
import Navbar from "../shared/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer/Footer";

const RootLayout = () => {
	return (
		<div className="flex flex-col min-h-screen bg-stone-300">
			<Navbar />

			<main className="flex-grow">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
};

export default RootLayout;
