import axios from "axios";
import React, { use } from "react";
import { AuthContext } from "../Context/AuthContext";

const axiosSecure = axios.create({
	baseURL: `https://newspaper-website-server-beige.vercel.app
`,
});

const useAxiosSecure = () => {
	const { user } = use(AuthContext);

	axiosSecure.interceptors.request.use(
		(config) => {
			if (user && user.accessToken) {
				
				
				config.headers.Authorization = `Bearer ${user.accessToken}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	return axiosSecure;
};

export default useAxiosSecure;
