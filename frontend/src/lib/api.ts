import axios from "axios";

export const api = axios.create({
	baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:4001") + "/api",
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

export const fetcher = async <T>(url: string): Promise<T> => {
	const { data } = await api.get(url);
	return data;
};

export const poster = async <TIn, TOut>(
	url: string,
	body: TIn
): Promise<TOut> => {
	const { data } = await api.post(url, body);
	return data;
};

export const putter = async <TIn, TOut>(
	url: string,
	body: TIn
): Promise<TOut> => {
	const { data } = await api.put(url, body);
	return data;
};

export const deleter = async (url: string): Promise<void> => {
	const { data } = await api.delete(url);
	return data;
};
