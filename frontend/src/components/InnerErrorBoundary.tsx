import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";

export function InnerErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	const { pathname } = useLocation();

	return (
		<ErrorBoundary
			resetKeys={[pathname]}
			fallbackRender={({ error, resetErrorBoundary }) => (
				<div className="h-full w-full p-4">
					<h2>Something went wrong</h2>
					<pre>{error.message}</pre>
					<button onClick={resetErrorBoundary}>Retry</button>
				</div>
			)}
		>
			{children}
		</ErrorBoundary>
	);
}
export default InnerErrorBoundary;
