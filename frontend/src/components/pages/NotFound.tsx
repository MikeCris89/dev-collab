import Button from "../Button";

const NotFound = () => {
	return (
		<div className="h-full flex flex-col justify-center items-center gap-5">
			<h1>404</h1>
			<h2>Page Not Found</h2>
			<Button href="/" variant="primary" replace>
				Home
			</Button>
		</div>
	);
};

export default NotFound;
