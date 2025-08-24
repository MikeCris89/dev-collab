import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../lib/types";
import { api } from "../lib/api";

interface AuthCtx {
	isLoading: boolean;
	error: string | null;
	user: User | null;
	login?: (username: string, password: string) => Promise<void>;
	logout?: () => Promise<void>;
	refresh?: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx>({
	isLoading: true,
	error: null,
	user: null,
});

const AuthProvider = ({ children }: React.PropsWithChildren) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	const refresh = async () => {
		try {
			setIsLoading(true);
			const resp = await api.get("/api/auth/me");
			setUser(resp.data);
		} catch (e) {
			console.log("User not logged in, rendering login page");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			await refresh();
		})();
	}, []);

	const login = async (username: string, password: string) => {
		try {
			await api.post("/api/auth/login", { username, password });
			const resp = await api.get("/api/auth/me");
			setUser(resp.data);
		} catch (e) {
			setError("Error logging in");
		}
	};

	const logout = async () => {
		await api.post("/api/auth/logout");
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ isLoading, user, error, login, logout, refresh }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
