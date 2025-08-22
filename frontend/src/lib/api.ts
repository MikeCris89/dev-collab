import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4001",
	withCredentials: true, // send cookie
	headers: { "Content-Type": "application/json" },
	timeout: 10_000,
});

// Optional: 401 handling, logging, etc.
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		// example: normalize errors
		if (err.response) {
			err.message = err.response.data?.message ?? err.message;
		}
		return Promise.reject(err);
	}
);
