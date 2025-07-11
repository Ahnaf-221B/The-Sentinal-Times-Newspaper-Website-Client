// import { useState, useEffect } from "react";
// import useAuth from "./useAuth";

// import useAxios from "./useAxios";

// const useUserRole = () => {
// 	const { user, loading: authLoading } = useAuth();
// 	const axiosInstance = useAxios();
// 	const [role, setRole] = useState("user"); 
// 	const [roleLoading, setRoleLoading] = useState(true); 
// 	const [error, setError] = useState(null); 

// 	useEffect(() => {
// 		if (!authLoading && user?.email) {
			
// 			const fetchUserRole = async () => {
// 				try {
// 					setRoleLoading(true);
// 					const res = await axiosInstance.get(`/users/${user.email}/role`);
// 					setRole(res.data.role);
// 				} catch (err) {
// 					setError(err);
// 					console.error("Error fetching user role:", err);
// 				} finally {
// 					setRoleLoading(false);
// 				}
// 			};

// 			fetchUserRole();
// 		}
// 	}, [user?.email]); 

// 	return { role, roleLoading: authLoading || roleLoading, error };
// };

// export default useUserRole;
