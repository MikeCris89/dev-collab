import { useEditTeamMember } from "@/hooks/useTeam";
import type { TeamMember } from "@shared/contract";
import { useState } from "react";

const UserEditForm = ({ existing }: { existing: TeamMember }) => {
	const [name, setName] = useState<string>(existing?.name ?? "");

	const { isPending, error, mutate: editUser } = useEditTeamMember();

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		if (existing.name === name) return;

		editUser({ id: existing.id, data: { name } });
	};

	return (
		<form onSubmit={submitHandler} id="user-edit-form" className="form">
			<input
				value={name}
				placeholder="name"
				required
				onChange={(e) => setName(e.target.value)}
				className="text-[36px] text-accent text-center max-w-[95%]"
				disabled={isPending}
			/>
			{error && (
				<div className="text-red-500 text-sm">
					{error.message ?? "Error has occurred"}
				</div>
			)}
		</form>
	);
};

export default UserEditForm;
