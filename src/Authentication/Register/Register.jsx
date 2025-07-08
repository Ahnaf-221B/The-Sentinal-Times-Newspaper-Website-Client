import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	FaEnvelope,
	FaLock,
	FaUser,
	FaEye,
	FaEyeSlash,
	FaImage,
} from "react-icons/fa";
import Lottie from "lottie-react";
import registerAnimation from "../../assets/registerAnimation.json";

const Register = () => {
	const [showPassword, setShowPassword] = useState(false);
	

	const {
		register,
		handleSubmit,
		
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		console.log("Registration Data:", data);
	};

	
	

	return (
		<div className="min-h-screen bg-stone-200 flex items-center justify-center p-6 noticia">
			<div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
				{/* Form Section */}
				<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
					<h2 className="text-3xl font-bold text-stone-800 mb-2">
						Create Account
					</h2>
					<p className="text-stone-500 mb-6">Enter your details to sign up</p>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{/* Full Name */}
						<div>
							<label className="block text-sm text-stone-700 mb-1">
								Full Name
							</label>
							<div className="relative">
								<FaUser className="absolute left-3 top-3 text-stone-400" />
								<input
									type="text"
									{...register("fullName", {
										required: "Full name is required",
										minLength: {
											value: 3,
											message: "Name must be at least 3 characters",
										},
									})}
									className="w-full pl-10 pr-4 py-2 border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
									placeholder="John Doe"
								/>
								{errors.fullName && (
									<p className="text-red-500 text-xs mt-1">
										{errors.fullName.message}
									</p>
								)}
							</div>
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm text-stone-700 mb-1">Email</label>
							<div className="relative">
								<FaEnvelope className="absolute left-3 top-3 text-stone-400" />
								<input
									type="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^\S+@\S+$/i,
											message: "Enter a valid email address",
										},
									})}
									className="w-full pl-10 pr-4 py-2 border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
									placeholder="john@example.com"
								/>
								{errors.email && (
									<p className="text-red-500 text-xs mt-1">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm text-stone-700 mb-1">
								Password
							</label>
							<div className="relative">
								<FaLock className="absolute left-3 top-3 text-stone-400" />
								<input
									type={showPassword ? "text" : "password"}
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message: "Password must be at least 6 characters",
										},
									})}
									className="w-full pl-10 pr-10 py-2 border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
									placeholder="••••••••"
								/>
								<button
									type="button"
									className="absolute right-3 top-3 text-stone-500"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
								{errors.password && (
									<p className="text-red-500 text-xs mt-1">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						{/* Profile Image Upload */}
						<div>
							<label className="block text-sm text-stone-700 mb-1">
								Profile Picture
							</label>
							<div className="relative">
								<FaImage className="absolute left-3 top-3 text-stone-400" />
								<input
									type="file"
									accept="image/*"
									{...register("profileImage", {
										required: "Profile image is required",
									})}
									className="w-full pl-10 pr-4 py-2 file:bg-stone-200 file:border-none file:rounded file:px-3 file:py-1 file:cursor-pointer border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
								/>
								{errors.profileImage && (
									<p className="text-red-500 text-xs mt-1">
										{errors.profileImage.message}
									</p>
								)}
							</div>
							
						</div>

						{/* Submit */}
						<button
							type="submit"
							className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 rounded-lg transition duration-200"
						>
							Create Account
						</button>

						{/* Already have account */}
						<p className="text-center text-sm text-stone-600 pt-4">
							Already have an account?{" "}
							<a href="/login" className="text-stone-800 font-bold underline">
								Sign in
							</a>
						</p>
					</form>
				</div>

				{/* Lottie Section */}
				<div className="hidden lg:block">
					<div className="bg-white p-4 rounded-xl shadow-lg">
						<Lottie animationData={registerAnimation} loop />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
