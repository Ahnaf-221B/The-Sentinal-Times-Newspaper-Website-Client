import React, { useState, useEffect, use } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import useAxios from "../hooks/useAxios";


const AdminRoute = ({ children }) => {
	const { user, loading } = use(AuthContext);
	const [role, setRole] = useState(null); 
	const [roleLoading, setRoleLoading] = useState(true); 
	const axiosInstance = useAxios();
	const location = useLocation();

	
	useEffect(() => {
		const fetchUserRole = async () => {
			if (user && user.email) {
				try {
					const response = await axiosInstance.get(`/users/${user.email}/role`);
					setRole(response.data.role); 
					setRoleLoading(false); 
				} catch (err) {
					console.error("Error fetching user role:", err);
					setRoleLoading(false); 
				}
			}
		};

		fetchUserRole();
	}, [user, axiosInstance]);

	
	if (loading || roleLoading) {
		return <span className="loading loading-spinner loading-xl"></span>;
	}

	
	if (!user || role !== "admin") {
		return <Navigate  state={{ from: location.pathname }} />;
	}

	
	return children;
};

export default AdminRoute;
