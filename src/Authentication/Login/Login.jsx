// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import Lottie from "lottie-react";
// import loginAnimation from "../../assets/loginAnimation.json"; 

// const Login = () => {
// 	const [showPassword, setShowPassword] = useState(false);

// 	const {
// 		register,
// 		handleSubmit,
// 		formState: { errors },
// 	} = useForm();

// 	const onSubmit = (data) => {
// 		console.log("Login Data:", data);
// 		// Handle login logic here
// 	};

// 	return (
// 		<div className="min-h-screen bg-stone-200 flex items-center justify-center p-6 noticia">
// 			<div className="grid lg:grid-cols-2 gap-8 w-full max-w-5xl items-center">
// 				{/* Form Section */}
// 				<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
// 					<h2 className="text-3xl font-bold text-stone-800 mb-2">Sign In</h2>
// 					<p className="text-stone-500 mb-6">
// 						Welcome back! Please enter your details.
// 					</p>

// 					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
// 						{/* Email */}
// 						<div>
// 							<label className="block text-sm text-stone-700 mb-1">Email</label>
// 							<div className="relative">
// 								<FaEnvelope className="absolute left-3 top-3 text-stone-400" />
// 								<input
// 									type="email"
// 									{...register("email", {
// 										required: "Email is required",
// 										pattern: {
// 											value: /^\S+@\S+$/i,
// 											message: "Enter a valid email address",
// 										},
// 									})}
// 									className="w-full pl-10 pr-4 py-2 border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
// 									placeholder="john@example.com"
// 								/>
// 								{errors.email && (
// 									<p className="text-red-500 text-xs mt-1">
// 										{errors.email.message}
// 									</p>
// 								)}
// 							</div>
// 						</div>

// 						{/* Password */}
// 						<div>
// 							<label className="block text-sm text-stone-700 mb-1">
// 								Password
// 							</label>
// 							<div className="relative">
// 								<FaLock className="absolute left-3 top-3 text-stone-400" />
// 								<input
// 									type={showPassword ? "text" : "password"}
// 									{...register("password", {
// 										required: "Password is required",
// 										minLength: {
// 											value: 6,
// 											message: "Password must be at least 6 characters",
// 										},
// 									})}
// 									className="w-full pl-10 pr-10 py-2 border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
// 									placeholder="••••••••"
// 								/>
// 								<button
// 									type="button"
// 									className="absolute right-3 top-3 text-stone-500"
// 									onClick={() => setShowPassword(!showPassword)}
// 								>
// 									{showPassword ? <FaEyeSlash /> : <FaEye />}
// 								</button>
// 								{errors.password && (
// 									<p className="text-red-500 text-xs mt-1">
// 										{errors.password.message}
// 									</p>
// 								)}
// 							</div>
// 						</div>

// 						{/* Submit */}
// 						<button
// 							type="submit"
// 							className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 rounded-lg transition duration-200"
// 						>
// 							Sign In
// 						</button>

// 						{/* Forgot Password Link */}
// 						<p className="text-center text-sm text-stone-600 pt-4">
// 							Don't have an account?{" "}
// 							<a
// 								href="/register"
// 								className="text-stone-800 underline font-bold"
// 							>
// 								Register
// 							</a>
// 						</p>    
// 					</form>
// 				</div>

// 				{/* Lottie Section */}
// 				<div className="hidden lg:flex justify-center">
// 					<div className="bg-white p-4 rounded-xl shadow-lg w-100 h-100">
// 						<Lottie
// 							animationData={loginAnimation}
// 							loop
// 							style={{ width: "100%", height: "100%" }}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Login;
