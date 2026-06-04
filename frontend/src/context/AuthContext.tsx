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
import { useQueryClient } from "@tanstack/react-query";

interface AuthCtx {
	isLoading: boolean;
	isPending: boolean;
	error: string | null;
	cookieBlocked: boolean;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	user: UserAuth | null;
	signup: (userData: SignupRequest) => Promise<JwtUser | undefined>;
	demo: () => Promise<JwtUser | undefined>;
	login: (userData: LoginRequest) => Promise<JwtUser | undefined>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: React.PropsWithChildren) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cookieBlocked, setCookieBlocked] = useState(false);
	const [user, setUser] = useState<JwtUser | null>(null);

	const queryClient = useQueryClient();

	const refresh = async () => {
		try {
			setIsPending(true);
			const resp = await fetcher<JwtUser>("/auth/me");
			console.log("AUTH: ", resp);
			setUser(resp);
		} catch (e) {
			console.log("User not logged in, rendering login page");
			setUser(null);
		} finally {
			setIsPending(false);
		}
	};

	useEffect(() => {
		(async () => {
			setError(null);
			await refresh();
		})();

		// Handle back/forward cache restoration
		const handlePageShow = (event: PageTransitionEvent) => {
			console.log("pageshow");
			if (event.persisted) {
				console.log("Page restored from bfcache, refreshing auth");
				refresh();
				queryClient.invalidateQueries();
			}
		};

		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, []);

	const apiErrorMessage = (e: unknown) => {
		const err = e as AxiosError<ErrorDTO>;
		return err.response?.data?.message ?? err.message ?? "Unknown error";
	};

	// Runs an auth request, then confirms the session cookie actually persisted
	// by calling /auth/me. The POST can "succeed" (server sets the cookie + returns
	// the user) while the browser silently drops the Set-Cookie — typically an ad
	// blocker or third-party-cookie setting. In that case /auth/me comes back 401,
	// so we surface a cookie warning instead of dropping the user into a broken,
	// logged-out app where every request is unauthorized.
	const authenticate = async (
		request: () => Promise<unknown>,
		onError: (e: unknown) => void,
	) => {
		let authenticated = false;
		try {
			setError(null);
			setCookieBlocked(false);
			setIsLoading(true);
			await request();
			authenticated = true;
			const me = await fetcher<JwtUser>("/auth/me");
			setUser(me);
			return me;
		} catch (e) {
			const status = (e as AxiosError).response?.status;
			if (authenticated && status === 401) setCookieBlocked(true);
			else onError(e);
		} finally {
			setIsLoading(false);
		}
	};

	const signup = (userData: SignupRequest) =>
		authenticate(
			() => poster<SignupRequest, JwtUser>("/auth/signup", userData),
			(e) => setError(apiErrorMessage(e)),
		);

	const demo = () =>
		authenticate(
			() => poster<undefined, JwtUser>("/auth/demo", undefined),
			(e) => setError(apiErrorMessage(e)),
		);

	const login = (userData: LoginRequest) =>
		authenticate(
			() => poster<LoginRequest, JwtUser>("/auth/login", userData),
			() => setError("Error logging in"),
		);

	const logout = async () => {
		try {
			setError(null);
			setIsPending(true);
			await api.post("/auth/logout");
			setUser(null);
		} catch (e) {
			setError("Unable to logout at this time.");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isLoading,
				isPending,
				user,
				error,
				cookieBlocked,
				setError,
				signup,
				demo,
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
