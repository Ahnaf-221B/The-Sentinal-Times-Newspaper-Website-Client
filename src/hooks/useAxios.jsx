import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
	baseURL: `https://newspaper-website-server-beige.vercel.app
`,
});

const useAxios = () => {
	return axiosInstance;
};

export default useAxios;
