import useRequireAuth from "@/hooks/useRequireAuth";
import { useTeamMembers } from "@/hooks/useTeam";

const ProjectCheckList = ({
	projectIds,
	setProjectIds,
}: {
	projectIds: string[];
	setProjectIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
	const { user } = useRequireAuth();
	const { data: members } = useTeamMembers();

	return (
		<div className="flex flex-col items-stretch rounded-md outline outline-border-medium p-3 w-[300px] max-w-[95%]">
			{members &&
				members
					.filter((m) => m.id !== user.sub)
					.map((m) => {
						const selected = projectIds.includes(m.id);

						return (
							<div
								key={m.id}
								className="flex justify-between items-center w-full"
							>
								<p>{m.name ?? m.username}</p>
								<input
									id={m.id}
									name=""
									type="checkbox"
									checked={selected}
									onChange={(e) =>
										setProjectIds((prev) => {
											const value = e.target.checked;
											if (value === true) {
												return [...prev, m.id];
											} else return prev.filter((uid) => uid !== m.id);
										})
									}
								/>
							</div>
						);
					})}
		</div>
	);
};

export default ProjectCheckList;
