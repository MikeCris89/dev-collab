import { ErrorBoundary } from "react-error-boundary";

export function CustomErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ErrorBoundary
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
export default CustomErrorBoundary;
