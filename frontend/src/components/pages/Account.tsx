import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import ThemeSwitcher from "../ThemeSwitcher";
import { useTeamMember } from "@/hooks/useTeam";
import useRequireAuth from "@/hooks/useRequireAuth";
import Loading from "../Loading";

const Account = () => {
	const { logout } = useAuth();
	const { user } = useRequireAuth();
	const { data: userData, isLoading, error } = useTeamMember(user.sub);

	if (isLoading) return <Loading />;
	if (!userData || error) throw new Error("");

	return (
		<div className="flex flex-col gap-3 items-center w-full max-w-[400px] mx-auto">
			<h1>Account</h1>
			<h2>{userData.username}</h2>
			{userData.name && <h3>{userData.name}</h3>}
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
