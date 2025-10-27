import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import { useTeamMember } from "@/hooks/useTeam";
import useRequireAuth from "@/hooks/useRequireAuth";
import Loading from "../Loading";
import ThemeSwitcher from "../ThemeSwitcher";
import { useQueryClient } from "@tanstack/react-query";

const Account = () => {
	const { logout } = useAuth();
	const { user } = useRequireAuth();
	const { data: userData, isLoading, error } = useTeamMember(user.sub);
	const queryClient = useQueryClient();

	if (isLoading) return <Loading />;
	if (!userData || error)
		throw new Error(error?.message ?? "Account Page: Userdata fetch error");

	return (
		<section className="flex flex-col gap-3 items-center w-full">
			<div className="flex flex-col gap-3 items-center w-[600px] mx-auto max-w-[95%]">
				<h2>{userData.username}</h2>
				{userData.name && <h3>{userData.name}</h3>}
				<div className="flex justify-between items-center w-full">
					<p>Switch Theme: </p>
					<ThemeSwitcher />
				</div>

				<Button
					onClick={() => {
						queryClient.clear();
						logout();
					}}
					variant="primary"
				>
					Logout
				</Button>
			</div>
		</section>
	);
};

export default Account;
