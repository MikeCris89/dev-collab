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
	const isDev = process.env.NODE_ENV !== "production";

	const message = boundaryError?.message ?? "unknown error";

	return (
		<div className="flex flex-col justify-center items-center h-full w-full p-4">
			<h2>Something went wrong</h2>
			{isDev && <pre className="text-red-500 text-wrap">{message}</pre>}
			{isDev && boundaryError && <small>(react error boundary)</small>}
			<br />
			<div className="flex gap-4 items-center">
				{boundaryError && (
					<button
						onClick={boundaryError.resetErrorBoundary}
						className={clsx(btnInitStyle, btnVariants.default)}
					>
						Reset
					</button>
				)}
				<button
					className={clsx(btnInitStyle, btnVariants.primary)}
					onClick={() => {
						if (boundaryError?.resetErrorBoundary)
							boundaryError.resetErrorBoundary();
					}}
				>
					Go Home
				</button>
			</div>
		</div>
	);
};

export default ErrorFallback;
