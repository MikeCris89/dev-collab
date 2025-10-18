import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import Button from "./Button";

export function InnerErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	const { pathname } = useLocation();
	const isDev = process.env.NODE_ENV !== "production";

	return (
		<ErrorBoundary
			resetKeys={[pathname]}
			fallbackRender={({ error, resetErrorBoundary }) => (
				<div className="flex flex-col items-center h-full w-full p-4">
					<h2>Something went wrong</h2>
					{isDev && <pre>Dev msg: {error.message}</pre>}
					<Button onClick={resetErrorBoundary}>Retry</Button>
				</div>
			)}
		>
			{children}
		</ErrorBoundary>
	);
}
export default InnerErrorBoundary;
