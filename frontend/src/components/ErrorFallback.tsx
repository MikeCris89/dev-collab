import Button from "./Button";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorFallback = () => {
	const error = useRouteError();
	const navigate = useNavigate();

	const isDev = process.env.NODE_ENV !== "production";

	const message = error instanceof Error ? error.message : "unknown error";

	return (
		<div className="flex flex-col justify-center items-center h-full w-full p-4">
			<h2>Something went wrong</h2>
			{isDev && <pre className="text-red-500 text-wrap">{message}</pre>}
			<br />
			<Button
				variant="primary"
				onClick={() => navigate("/", { replace: true })}
			>
				Go Home
			</Button>
		</div>
	);
};

export default ErrorFallback;
