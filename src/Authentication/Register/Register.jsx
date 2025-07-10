import { use, useState } from "react";
import { toast } from "react-toastify";
import {
	FaEnvelope,
	FaLock,
	FaUser,
	FaEye,
	FaEyeSlash,
	FaImage,
	FaGoogle,
} from "react-icons/fa";
import Lottie from "lottie-react";
import registerAnimation from "../../assets/registerAnimation.json";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce } from "react-toastify";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext"; // Context for authentication
import { useForm } from "react-hook-form";

const Register = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [profilePic, setProfilePic] = useState(null);
	const { createUser, signInWithGoogle, user } = use(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();
	const axiosInstance = useAxios();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// Handle Google login and register user
	const handleGoogleRegister = async () => {
		try {
			// Google sign-in
			const result = await signInWithGoogle();
			const { email, displayName, photoURL } = result.user;

			// Create user info object
			const userInfo = {
				email,
				fullName: displayName,
				photoURL:
					photoURL || "https://placehold.co/40x40/cccccc/ffffff?text=User", // Fallback image
				role: "user",
				created_at: new Date().toISOString(),
				last_logged_in: new Date().toISOString(),
			};

			// Send user info to backend
			const userRes = await axiosInstance.post("/users", userInfo);
			toast.success("Logged in with Google successfully!", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});

			// Navigate to the requested route or home
			setTimeout(() => {
				navigate(location.state?.from || "/");
			}, 500);
		} catch (error) {
			console.error("Google sign-in failed:", error.message);
			toast.error(`Google sign-in failed: ${error.message}`, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});
		}
	};

	// Regular registration method
	const onSubmit = async (data) => {
		const { fullName, email, password, profileImage } = data;

		try {
			// Create a new user in Firebase or your auth system
			await createUser(email, password);

			// Create user info object
			const userInfo = {
				email,
				fullName,
				photoURL: profilePic || profileImage, // Use either selected or uploaded profile image
				role: "user",
				created_at: new Date().toISOString(),
				last_logged_in: new Date().toISOString(),
			};

			// Send user info to backend
			const userRes = await axiosInstance.post("/users", userInfo);
			console.log(userRes.data);
			toast.success("User registered successfully!", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});

			// ⏳ Delay navigation by 2 seconds to allow the toast to show
			setTimeout(() => {
				navigate(location.state?.from || "/");
			}, 500);
		} catch (error) {
			console.error("Registration error:", error.message);
			toast.error(`Registration failed: ${error.message}`, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});
		}
	};

	const handleUploadImage = async (e) => {
		const image = e.target.files[0];
		console.log(image);

		const formData = new FormData();
		formData.append("image", image);

		const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
			import.meta.env.VITE_image_upload_key
		}`;
		const res = await axiosInstance.post(imageUploadUrl, formData);
		setProfilePic(res.data.data.url);
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
									onChange={handleUploadImage}
									className="w-full pl-10 pr-4 py-2 file:bg-stone-200 file:border-none file:rounded file:px-3 file:py-1 file:cursor-pointer border rounded bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
								/>
							</div>
						</div>

						{/* Submit */}
						<button
							type="submit"
							className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 rounded-lg transition duration-200"
						>
							Create Account
						</button>
						<div className="font-bold flex justify-center items-center text-lg">
							<span>Or</span>
						</div>

						{/* Google Login */}
						<button
							type="button"
							onClick={handleGoogleRegister}
							className="w-full flex items-center justify-center gap-3 border border-stone-300 rounded-lg py-3 text-stone-700 font-medium hover:border-stone-500 hover:bg-stone-100 transition duration-200"
						>
							<FaGoogle className="text-red-500 text-lg" />
							<span>Sign in with Google</span>
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
