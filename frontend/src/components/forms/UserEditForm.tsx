import { useEditTeamMember, useTeamMember } from "@/hooks/useTeam";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const UserEditForm = () => {
	const [searchParams] = useSearchParams();
	const memberId = searchParams.get("memberId");

	const { data: existing } = useTeamMember(memberId);

	const [name, setName] = useState<string>(existing?.name ?? "");

	const { isPending, error, mutate: editUser } = useEditTeamMember();

	if (!existing) throw new Error();

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
