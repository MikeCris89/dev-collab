import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./ErrorFallback";

export function CustomErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ErrorBoundary
			fallbackRender={({ error, resetErrorBoundary }) => (
				<ErrorFallback
					boundaryError={{ message: error.message, resetErrorBoundary }}
				/>
			)}
		>
			{children}
		</ErrorBoundary>
	);
}
export default CustomErrorBoundary;
