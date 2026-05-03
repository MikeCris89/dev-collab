import clsx from "clsx";
import { btnInitStyle, btnVariants } from "./Button";

const ErrorFallback = ({
	boundaryError,
}: {
	boundaryError?: {
		message: string;
		resetErrorBoundary: (...args: any[]) => void;
	};
}) => {
	const isDev = import.meta.env.DEV;

	const message = boundaryError?.message ?? "unknown error";

	return (
		<div className="flex flex-col justify-center items-center h-full w-full p-4">
			<h1>Something went wrong</h1>
			{isDev && <pre className="text-red-500 text-wrap">{message}</pre>}
			{isDev && boundaryError && <small>(react error boundary)</small>}
			<br />
			<div className="flex gap-4 items-center">
				{boundaryError && (
					<button
						onClick={() => {
							boundaryError.resetErrorBoundary();
							window.location.reload();
						}}
						className={clsx(btnInitStyle, btnVariants.default)}
					>
						Refresh
					</button>
				)}
				<a
					className={clsx(btnInitStyle, btnVariants.primary)}
					onClick={() => {
						if (boundaryError?.resetErrorBoundary)
							boundaryError.resetErrorBoundary();
					}}
					href="/"
				>
					Go Home
				</a>
			</div>
		</div>
	);
};

export default ErrorFallback;
