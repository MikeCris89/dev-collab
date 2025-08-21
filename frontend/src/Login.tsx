const Login = () => {
	return (
		<div className="flex justify-center items-center h-full w-full">
			<div className="flex flex-col items-center justify-center rounded ring-1 ring-neutral-300 p-2">
				<p>Username</p>
				<input id="username" required />
				<p>Password</p>
				<input id="password" type="password" required />
			</div>
		</div>
	);
};

export default Login;
