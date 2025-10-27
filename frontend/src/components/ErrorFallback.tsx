import Button from "./Button";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorFallback = ({
	boundaryError,
}: {
	boundaryError?: {
		message: string;
		resetErrorBoundary: (...args: any[]) => void;
	};
}) => {
	const error = useRouteError();
	const navigate = useNavigate();

	const isDev = process.env.NODE_ENV !== "production";

	const message =
		error instanceof Error
			? error.message
			: boundaryError?.message ?? "unknown error";

	return (
		<div className="flex flex-col justify-center items-center h-full w-full p-4">
			<h2>Something went wrong</h2>
			{isDev && <pre className="text-red-500 text-wrap">{message}</pre>}
			{isDev && boundaryError && <small>(react error boundary)</small>}
			<br />
			<div className="flex gap-4 items-center">
				{boundaryError && (
					<Button onClick={boundaryError.resetErrorBoundary}>Reset</Button>
				)}
				<Button
					variant="primary"
					onClick={() => {
						if (boundaryError?.resetErrorBoundary)
							boundaryError.resetErrorBoundary();
						navigate("/", { replace: true });
					}}
				>
					Go Home
				</Button>
			</div>
		</div>
	);
};

export default ErrorFallback;
