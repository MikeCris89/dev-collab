import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./ErrorFallback";

export function CustomErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	// const isDev = process.env.NODE_ENV !== "production";
	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			// onReset={() => (window.location.href = "/")}
			// fallbackRender={({ error, resetErrorBoundary }) => (
			// 	<div className="flex flex-col items-center h-full w-full p-4">
			// 		<h2>Something went wrong</h2>
			// 		{isDev && <pre>{error.message}</pre>}
			// 		<Button onClick={resetErrorBoundary}>Retry</Button>
			// 	</div>
			// )}
		>
			{children}
		</ErrorBoundary>
	);
}
export default CustomErrorBoundary;
