import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./ErrorFallback";

export function CustomErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ErrorBoundary
			onReset={() => (window.location.href = "/")}
			fallbackRender={({ error, resetErrorBoundary }) => (
				<ErrorFallback
					boundaryError={{
						message: error instanceof Error ? error.message : String(error),
						resetErrorBoundary,
					}}
				/>
			)}
		>
			{children}
		</ErrorBoundary>
	);
}
export default CustomErrorBoundary;
