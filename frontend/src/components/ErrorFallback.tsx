import clsx from "clsx";
import { btnInitStyle, btnVariants } from "./Button";
import { useEffect } from "react";

export interface BoundaryError {
	message: string;
	resetErrorBoundary: (...args: any[]) => void;
}

const ErrorFallback = ({ boundaryError }: { boundaryError: BoundaryError }) => {
	useEffect(() => {
		fetch("/api/debug-log", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: boundaryError.message,
				url: window.location.href,
				userAgent: navigator.userAgent,
				isStandalone: window.matchMedia("(display-mode: standalone)").matches,
				timestamp: new Date().toISOString(),
			}),
		}).catch(() => {});
	}, [boundaryError.message]);

	// TEMP: always show error while debugging friend's iPhone issue
	// const showError = import.meta.env.DEV;
	const showError = true; // change back to import.meta.env.DEV later

	return (
		<div className="flex flex-col justify-center items-center h-full w-full p-4">
			<h1>Something went wrong</h1>
			{showError && (
				<pre className="text-red-500 text-wrap">{boundaryError.message}</pre>
			)}
			<br />
			<div className="flex gap-4 items-center">
				<button
					onClick={() => {
						boundaryError.resetErrorBoundary();
						window.location.reload();
					}}
					className={clsx(btnInitStyle, btnVariants.default)}
				>
					Refresh
				</button>
				<button
					onClick={() => {
						boundaryError.resetErrorBoundary();
						window.location.href = "/";
					}}
					className={clsx(btnInitStyle, btnVariants.primary)}
				>
					Go Home
				</button>
			</div>
		</div>
	);
};

export default ErrorFallback;
