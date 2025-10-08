import { useTeamMembers } from "@/hooks/useTeam";
import { LIMITS } from "@shared/contract";

const TeamPage = () => {
	const { data: members = [], isLoading } = useTeamMembers();

	if (isLoading) return <p>Loading...</p>;

	return (
		<div className="flex flex-col gap-3 items-center w-full p-4">
			<div className="text-text-muted text-sm self-end">
				users: {members.length} / {LIMITS.MAX_USERS_PER_TEAM}
			</div>
			{members.map((m) => {
				return (
					<div key={m.id} className="card p-4 text-left w-[400px] max-w-[90%]">
						<p className="text-sm">
							{m.role} - {m.name || "-no name-"}
						</p>
						<h2>{m.username}</h2>
						<div className="text-xs text-text-muted">
							created: {new Date(m.createdAt).toLocaleDateString()}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TeamPage;
