import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import ErrorFallback from "./ErrorFallback";

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
				<ErrorFallback
					boundaryError={{
						message: `(inner boundary): ${error instanceof Error ? error.message : String(error)}`,
						resetErrorBoundary,
					}}
				/>
			)}
		>
			{children}
		</ErrorBoundary>
	);
}
export default InnerErrorBoundary;
