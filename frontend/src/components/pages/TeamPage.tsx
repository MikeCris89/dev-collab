import { useTeamMembers } from "@/hooks/useTeam";
import { FORMS, LIMITS, ROLES } from "@shared/contract";
import Button from "../Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const TeamPage = () => {
	const { data: members = [], isLoading } = useTeamMembers();
	const navigate = useNavigate();

	if (isLoading) return <p>Loading...</p>;

	return (
		<section className="flex-1  min-h-0 overflow-y-auto overflow-x-hidden ">
			<div className="flex flex-col gap-5 justify-center items-center">
				<Button
					variant="primary"
					className="w-fit m-auto"
					href={`?action=add&formId=${FORMS.userAdd}`}
				>
					add member
				</Button>

				<p className="text-text-muted text-sm ">
					Members: {members.length} / {LIMITS.MAX_USERS_PER_TEAM}
				</p>
				{members
					.slice()
					.sort((a, b) =>
						a.role === ROLES.admin
							? -1
							: b.role === ROLES.admin
							? 1
							: new Date(a.createdAt).getTime() -
							  new Date(b.createdAt).getTime()
					)
					.map((m) => {
						const isAdmin = m.role === "ADMIN";
						return (
							<div
								key={m.id}
								className={clsx(
									"card text-left w-[400px] max-w-[90%] cursor-pointer",
									"hover:outline-accent"
								)}
								onClick={() => {
									navigate(
										`?action=edit&formId=${FORMS.userEdit}&memberId=${m.id}`,
										{ state: { from: "/team" } }
									);
								}}
							>
								<div className="flex gap-10 justify-center items-center w-full">
									<i className="text-4xl shrink-0">👤</i>
									<div className="flex-1 flex flex-col gap-2">
										<p className={clsx("text-sm", isAdmin && "text-accent")}>
											{m.role} - {m.name || "[no name]"}
										</p>
										<h2 className="text-lg">{m.username}</h2>
										<div className="text-xs text-text-muted">
											created: {new Date(m.createdAt).toLocaleDateString()}
										</div>
									</div>
									{/* <div className="flex flex-col self-end">
										<Button className="flex gap-2 items-center hover:text-accent ">
											<Edit2 size={16} /> edit
										</Button>
										{!isAdmin && (
											<Button className="flex gap-2 items-center hover:text-red-500">
												<Trash2 size={16} /> delete
											</Button>
										)}
									</div> */}
								</div>
							</div>
						);
					})}
			</div>
		</section>
	);
};

export default TeamPage;
