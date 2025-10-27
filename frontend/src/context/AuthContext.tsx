import { createContext, useContext, useEffect, useState } from "react";
import { api, fetcher, poster } from "../lib/api";
import type {
	ErrorDTO,
	JwtUser,
	LoginRequest,
	SignupRequest,
	UserAuth,
} from "@shared/contract";
import type { AxiosError } from "axios";

interface AuthCtx {
	isLoading: boolean;
	error: string | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	user: UserAuth | null;
	signup: (userData: SignupRequest) => Promise<JwtUser | undefined>;
	login: (userData: LoginRequest) => Promise<JwtUser | undefined>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: React.PropsWithChildren) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<JwtUser | null>(null);

	const refresh = async () => {
		try {
			setIsLoading(true);
			const resp = await fetcher<JwtUser>("/auth/me");
			setUser(resp);
		} catch (e) {
			console.log("User not logged in, rendering login page");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			setError(null);
			await refresh();
		})();
	}, []);

	const signup = async (userData: SignupRequest) => {
		try {
			setError(null);
			setIsLoading(true);
			const resp = await poster<SignupRequest, JwtUser>(
				"/auth/signup",
				userData
			);
			setUser(resp);
			return resp;
		} catch (e) {
			const err = e as AxiosError<ErrorDTO>;
			const msg = err.response?.data?.message ?? err.message ?? "Unknown error";
			setError(msg);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (userData: LoginRequest) => {
		try {
			setError(null);
			setIsLoading(true);
			const resp = await poster<LoginRequest, JwtUser>("/auth/login", userData);
			setUser(resp);
			return resp;
		} catch (e) {
			setError("Error logging in");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			setError(null);
			setIsLoading(true);
			await api.post("/auth/logout");
			setUser(null);
		} catch (e) {
			setError("Unable to logout at this time.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isLoading,
				user,
				error,
				setError,
				signup,
				login,
				logout,
				refresh,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
