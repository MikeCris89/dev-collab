import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import ThemeSwitcher from "../ThemeSwitcher";

const Account = () => {
	const { logout, user } = useAuth();

	return (
		<div className="flex flex-col gap-3 items-center w-full max-w-[400px] mx-auto">
			<h1>Account</h1>
			<h2>{user?.username}</h2>
			{user?.name && <h3>{user.name}</h3>}
			<div className="flex justify-between items-center w-full">
				<p>Switch Theme: </p>
				<ThemeSwitcher />
			</div>

			<Button onClick={logout} variant="primary">
				Logout
			</Button>
		</div>
	);
};

export default Account;
