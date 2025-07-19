const SubscriptionBanner = () => {
	return (
		<div className="bg-gradient-to-r from-gray-500 to-stone-400 text-white p-6 rounded-lg shadow-lg mb-8">
			<div className="max-w-4xl mx-auto text-center">
				<h2 className="text-3xl font-bold mb-3">Unlock Premium Content</h2>
				<p className="text-xl mb-4">
					Get unlimited access to exclusive articles, ad-free browsing, and
					premium features
				</p>
				<div className="flex justify-center space-x-4">
					<div className="bg-white bg-opacity-20 p-4 rounded-lg text-stone-600">
						<p className="font-bold">1 Minute</p>
						<p className="text-2xl font-bold">$0.99</p>
						<p className="text-sm">For testing</p>
					</div>
					<div className="bg-white bg-opacity-20 p-4 rounded-lg text-stone-600">
						<p className="font-bold">5 Days</p>
						<p className="text-2xl font-bold">$4.99</p>
						<p className="text-sm">Most popular</p>
					</div>
					<div className="bg-white bg-opacity-20 p-4 rounded-lg text-stone-600">
						<p className="font-bold">10 Days</p>
						<p className="text-2xl font-bold">$8.99</p>
						<p className="text-sm">Best value</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionBanner;
