import { useTeamMembers } from "@/hooks/useTeam";
import { FORMS, LIMITS, ROLES } from "@shared/contract";
import Button from "../Button";
import Avatar from "../Avatar";
import { useNavigate } from "react-router-dom";
import useRequireAuth from "@/hooks/useRequireAuth";
import Loading from "../Loading";
import { ShieldCheck } from "lucide-react";

const TeamPage = () => {
	const { user } = useRequireAuth();
	const { data: members = [], isLoading } = useTeamMembers();
	const navigate = useNavigate();

	if (isLoading) return <Loading />;

	const sorted = members.slice().sort((a, b) =>
		a.role === ROLES.admin ? -1 : b.role === ROLES.admin ? 1
			: new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);

	return (
		<section className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
			<div className="flex flex-col gap-6 w-[520px] max-w-full mx-auto pt-8 px-4">
				{user.isAdmin && (
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-lg font-semibold">Team</h1>
							<p className="text-text-muted text-sm mt-0.5">
								{members.length} / {LIMITS.MAX_USERS_PER_TEAM} members
							</p>
						</div>
						<Button variant="primary" href={`?action=add&formId=${FORMS.userAdd}`}>
							Add Member
						</Button>
					</div>
				)}

				<div className="bg-bg-surface border border-border-light rounded-2xl overflow-hidden">
					{sorted.map((m, i) => {
						const isAdmin = m.role === ROLES.admin;
						const isLast = i === sorted.length - 1;
						return (
							<div
								key={m.id}
								className={`flex items-center gap-4 px-5 py-4 transition-colors ${
									!isLast ? "border-b border-border-light" : ""
								} ${user.isAdmin ? "cursor-pointer hover:bg-accent/5" : ""}`}
								onClick={
									user.isAdmin
										? () => navigate(`?action=edit&formId=${FORMS.userEdit}&memberId=${m.id}`, { state: { from: "/team" } })
										: undefined
								}
							>
								<Avatar name={m.name || m.username} size="md" />
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-1.5">
										<span className="text-sm font-medium truncate">
											{m.name || m.username}
										</span>
										{isAdmin && (
											<ShieldCheck size={14} className="text-accent shrink-0" />
										)}
									</div>
									<p className="text-xs text-text-muted truncate">{m.username}</p>
								</div>
								<div className="text-right shrink-0">
									<span
										className={`text-xs font-medium px-2 py-0.5 rounded-full ${
											isAdmin
												? "bg-accent/15 text-accent"
												: "bg-border-light text-text-muted"
										}`}
									>
										{m.role}
									</span>
									<p className="text-xs text-text-muted mt-1">
										{new Date(m.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default TeamPage;
