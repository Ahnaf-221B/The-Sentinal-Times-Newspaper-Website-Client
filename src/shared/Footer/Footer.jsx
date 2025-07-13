const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white noticia">
			<div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 ">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
					{/* Logo and description */}
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<img
								src="https://i.postimg.cc/fy4csVxj/image.png"
								alt="DailyNews"
								className="h-12 w-12 object-cover rounded-full"
							/>
							<span className="text-xl font-bold">
								The Sentinal <br /> <span className="ml-16">Times</span>
							</span>
						</div>
						<p className="text-gray-400 text-sm">
							Bringing you the latest updates from around the world, 24/7.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-3">Quick Links</h3>
						<ul className="space-y-2 text-gray-400 text-sm">
							<li>
								<a href="/" className="hover:text-white">
									Home
								</a>
							</li>
							<li>
								<a href="all-articles" className="hover:text-white">
									All Articles
								</a>
							</li>
							<li>
								<a href="add-article" className="hover:text-white">
									Add Artiicle
								</a>
							</li>
							<li>
								<a href="subscription" className="hover:text-white">
									Subscription
								</a>
							</li>
						</ul>
					</div>

				

					{/* Contact / Newsletter */}
					<div>
						<h3 className="text-lg font-semibold mb-3">Subscribe</h3>
						<p className="text-gray-400 text-sm mb-3">
							Get the latest news delivered to your inbox.
						</p>
						<form className="flex">
							<input
								type="email"
								placeholder="Email"
								className="w-full px-3 py-2 text-sm text-gray-900 rounded-l-md focus:outline-none bg-white"
							/>
							<button className="bg-blue-600 px-4 py-2 text-sm rounded-r-md hover:bg-blue-700">
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
					&copy; {new Date().getFullYear()} The Sentinal Times. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
