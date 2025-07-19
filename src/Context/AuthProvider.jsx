import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import useAxios from "../hooks/useAxios";

const AuthProvider = ({ children }) => {
	const googleProvider = new GoogleAuthProvider();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isPremium, setIsPremium] = useState(false);
	const [role, setRole] = useState(null); // Add role state
	const axiosInstance = useAxios();

	const createUser = (email, password) => {
		setLoading(true);
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signIn = (email, password) => {
		setLoading(true);
		return signInWithEmailAndPassword(auth, email, password);
	};

	const signInWithGoogle = () => {
		setLoading(true);
		return signInWithPopup(auth, googleProvider);
	};

	const updateUserProfile = (profileInfo) => {
		return updateProfile(auth.currentUser, profileInfo);
	};

	const logOut = () => {
		setLoading(true);
		setRole(null); // Reset role on logout
		return signOut(auth);
	};

	const fetchUserStatus = async () => {
		if (user?.email) {
			try {
				// Fetch both premium status and role in parallel
				const [premiumRes, roleRes] = await Promise.all([
					axiosInstance.get(`/users/${user.email}/premium-status`),
					axiosInstance.get(`/users/${user.email}/role`),
				]);

				setIsPremium(premiumRes.data.isPremium);
				setRole(roleRes.data.role); // Set the role from response
			} catch (err) {
				console.error("Error fetching user status:", err);
				setIsPremium(false);
				setRole("user"); // Default to 'user' if error occurs
			}
		}
	};

	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			console.log("User in the auth state change", currentUser);
			setLoading(false);
			if (currentUser) {
				fetchUserStatus(); // Fetch both premium status and role
			} else {
				setRole(null); // Clear role when no user
				setIsPremium(false); // Clear premium status when no user
			}
		});

		return () => {
			unSubscribe();
		};
	}, []); // Removed user from dependencies to prevent infinite loop

	const updatePremiumStatus = (newStatus) => {
		setIsPremium(newStatus);
	};

	const authInfo = {
		user,
		loading,
		createUser,
		signIn,
		signInWithGoogle,
		logOut,
		updateUserProfile,
		fetchUserStatus,
		isPremium,
		role, // Include role in context
		updatePremiumStatus,
	};

	return (
		<AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
