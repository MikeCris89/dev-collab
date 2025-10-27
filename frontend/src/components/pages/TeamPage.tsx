import { useTeamMembers } from "@/hooks/useTeam";
import { FORMS, LIMITS } from "@shared/contract";
import Button from "../Button";
import { User } from "lucide-react";

const TeamPage = () => {
	const { data: members = [], isLoading } = useTeamMembers();

	if (isLoading) return <p>Loading...</p>;

	return (
		<section className="flex flex-col gap-3 items-center w-full p-4">
			{/* <h1 className="">Team</h1> */}
			<Button
				variant="primary"
				className=""
				href={`?action=add&formId=${FORMS.userAdd}`}
			>
				add member
			</Button>

			<p className="text-text-muted text-sm self-end">
				Members: {members.length} / {LIMITS.MAX_USERS_PER_TEAM}
			</p>
			{members.map((m) => {
				return (
					<div key={m.id} className="card p-4 text-left w-[400px] max-w-[90%]">
						<div className="flex gap-10 items-center">
							<i className="text-4xl">👤</i>
							<div className="flex flex-col gap-2">
								<p className="text-sm">
									{m.role} - {m.name || "[no name]"}
								</p>
								<h2>{m.username}</h2>
								<div className="text-xs text-text-muted">
									created: {new Date(m.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</section>
	);
};

export default TeamPage;
