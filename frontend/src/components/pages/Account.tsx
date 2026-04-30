import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import { useTeamMember, useEditTeamMember } from "@/hooks/useTeam";
import useRequireAuth from "@/hooks/useRequireAuth";
import Loading from "../Loading";
import ThemeSwitcher from "../ThemeSwitcher";
import { useQueryClient } from "@tanstack/react-query";
import {
	PasswordModalProvider,
	usePasswordModal,
} from "@/context/PasswordModal";
import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import Avatar from "../Avatar";

const AccountContent = () => {
	const { logout } = useAuth();
	const { user } = useRequireAuth();
	const { data: userData, isLoading, error } = useTeamMember(user.sub);
	const queryClient = useQueryClient();
	const { setShowModal, setUserId } = usePasswordModal();
	const { mutate: editUser, isPending: isSaving } = useEditTeamMember();

	const [editingName, setEditingName] = useState(false);
	const [nameValue, setNameValue] = useState("");

	if (isLoading) return <Loading />;
	if (!userData || error)
		throw new Error(error?.message ?? "Account Page: Userdata fetch error");

	const startEditing = () => {
		setNameValue(userData.name ?? "");
		setEditingName(true);
	};

	const cancelEditing = () => setEditingName(false);

	const saveName = () => {
		if (nameValue === userData.name) {
			setEditingName(false);
			return;
		}
		editUser(
			{ id: userData.id, data: { name: nameValue } },
			{ onSuccess: () => setEditingName(false) },
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") saveName();
		if (e.key === "Escape") cancelEditing();
	};

	return (
		<section className="flex flex-col items-center w-full pt-8 px-4">
			<div className="flex flex-col gap-5 w-[460px] max-w-full mx-auto">
				{/* Avatar + username */}
				<div className="flex flex-col items-center gap-2 mb-2">
					<Avatar name={userData.name || userData.username} size="lg" />
					<p className="text-text-muted text-sm">{userData.username}</p>
				</div>

				{/* Profile card */}
				<div className="bg-bg-surface border border-border-light rounded-2xl overflow-hidden">
					<div className="px-5 py-3 border-b border-border-light">
						<span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
							Profile
						</span>
					</div>

					{/* Name row */}
					<div className="flex items-center gap-3 px-5 py-4 border-b border-border-light min-h-[60px]">
						<span className="text-sm text-text-muted w-24 shrink-0">
							Name
						</span>
						{editingName ? (
							<div className="flex items-center gap-2 flex-1">
								<input
									value={nameValue}
									onChange={(e) => setNameValue(e.target.value)}
									onKeyDown={handleKeyDown}
									autoFocus
									disabled={isSaving}
									className="flex-1 px-3 py-1.5 rounded-lg text-sm bg-bg-surface border border-border-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors disabled:opacity-50"
								/>
								<button
									onClick={saveName}
									disabled={isSaving}
									className="p-1.5 rounded-lg hover:bg-border-light transition-colors text-accent disabled:opacity-50"
								>
									<Check size={16} />
								</button>
								<button
									onClick={cancelEditing}
									disabled={isSaving}
									className="p-1.5 rounded-lg hover:bg-border-light transition-colors text-text-muted disabled:opacity-50"
								>
									<X size={16} />
								</button>
							</div>
						) : (
							<div className="flex items-center gap-2 flex-1">
								<span className="text-sm flex-1">{userData.name || "—"}</span>
								<button
									onClick={startEditing}
									className="p-1.5 rounded-lg hover:bg-border-light transition-colors text-text-muted"
								>
									<Pencil size={14} />
								</button>
							</div>
						)}
					</div>

					{/* Password row */}
					<div className="flex items-center gap-3 px-5 py-4">
						<span className="text-sm text-text-muted w-24 shrink-0">
							Password
						</span>
						<Button
							onClick={() => {
								setUserId(userData.id);
								setShowModal(true);
							}}
						>
							Change Password
						</Button>
					</div>
				</div>

				{/* Settings card */}
				<div className="bg-bg-surface border border-border-light rounded-2xl overflow-hidden">
					<div className="px-5 py-3 border-b border-border-light">
						<span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
							Settings
						</span>
					</div>
					<div className="flex items-center justify-between px-5 py-4">
						<span className="text-sm text-text-muted">Theme</span>
						<ThemeSwitcher />
					</div>
				</div>

				{/* Logout */}
				<div className="flex justify-center pt-2">
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
			</div>
		</section>
	);
};

const Account = () => (
	<PasswordModalProvider>
		<AccountContent />
	</PasswordModalProvider>
);

export default Account;
