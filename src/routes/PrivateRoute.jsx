import React, { use } from "react";

import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoute = ({ children }) => {
	const { user, loading } = use(AuthContext);
	const location = useLocation();

	if (loading) {
		return <span className="loading loading-spinner loading-xl"></span>;
	}

	if (!user) {
		return (
			<Navigate state={{ from: location.pathname }} to="/login"></Navigate>
		);
	}

	return children;
};

export default PrivateRoute;
