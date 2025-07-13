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
import useAxios from "../hooks/useAxios"; // Import axios instance

const AuthProvider = ({ children }) => {
	const googleProvider = new GoogleAuthProvider();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isPremium, setIsPremium] = useState(false);
	const axiosInstance = useAxios(); // Initialize axios instance

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
		return signOut(auth);
	};

	const fetchUserStatus = async () => {
		if (user?.email) {
			try {
				const premiumRes = await axiosInstance.get(
					`/users/${user.email}/premium-status`
				);
				setIsPremium(premiumRes.data.isPremium);
			} catch (err) {
				console.error("Error fetching user status:", err);
				setIsPremium(false);
			}
		}
	};

	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			console.log("User in the auth state change", currentUser);
			setLoading(false);
			if (currentUser) {
				fetchUserStatus(); // Fetch user status after user is set
			}
		});

		return () => {
			unSubscribe();
		};
	}, [user]); // Only run this effect when `user` changes

	// Update the isPremium state dynamically after a successful subscription.
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
		updatePremiumStatus, // Add this function so that it can be used to update `isPremium` from other components
	};

	return (
		<AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
