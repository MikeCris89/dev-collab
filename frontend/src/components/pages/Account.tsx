import { useAuth } from "@/context/AuthContext";
import Button from "../Button";
import {
	useTeamMember,
	useEditTeamMember,
	useDeleteTeam,
} from "@/hooks/useTeam";
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
import { useDeleteModal } from "@/context/DeleteModalContext";

const AccountContent = () => {
	const { logout } = useAuth();
	const { user } = useRequireAuth();
	const { data: userData, isLoading, error } = useTeamMember(user.sub);
	const queryClient = useQueryClient();
	const { setShowModal, setUserId } = usePasswordModal();
	const {
		mutate: editUser,
		isPending: isSaving,
		error: editError,
	} = useEditTeamMember();
	const {
		mutateAsync: deleteTeam,
		isPending: isDeleting,
		error: errDeleting,
	} = useDeleteTeam();
	const { setShowModal: setShowDeleteModal } = useDeleteModal();
	const [editingName, setEditingName] = useState(false);
	const [nameValue, setNameValue] = useState("");

	if (isLoading) return <Loading withText />;
	if (!userData || error)
		return (
			<div className="flex justify-center pt-8 px-4">
				<p className="text-red-500 text-sm">
					{error?.message ?? "Couldn't load account data."}
				</p>
			</div>
		);

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

	const Label = ({ children }: { children: React.ReactNode }) => {
		return (
			<span className="text-sm text-text-muted w-fit shrink-0 text-left">
				{children}
			</span>
		);
	};

	const handleDeleteTeam = async () => {
		await deleteTeam();
		logout();
	};

	const deleteModal = {
		type: "team",
		onConfirm: handleDeleteTeam,
		isLoading: isDeleting,
		err: errDeleting?.message,
		msg: "Are you sure you want to delete all your team data ?",
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
					<div className="flex justify-between w-full items-center gap-3 px-5 py-4 border-b border-border-light min-h-[60px]">
						<Label>Name</Label>
						{editingName ? (
							<div className="flex justify-end items-center gap-2 flex-1">
								<input
									value={nameValue}
									onChange={(e) => setNameValue(e.target.value)}
									onKeyDown={handleKeyDown}
									autoFocus
									disabled={isSaving}
									className="flex-1 px-3 py-1.5 rounded-lg text-sm bg-bg-surface border border-border-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors disabled:opacity-50 "
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
								<span className="text-sm flex-1 text-right">
									{userData.name || "—"}
								</span>
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
					<div className="flex justify-between items-center gap-3 px-5 py-4">
						<Label>Password</Label>
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
						<Label>Theme</Label>
						<ThemeSwitcher />
					</div>
					<div className="flex items-center justify-between px-5 py-4">
						<Label>Delete Account</Label>
						<Button
							onClick={() => setShowDeleteModal(deleteModal)}
							className="bg-red-500 hover:bg-red-500/80 min-w-[150px]"
						>
							Delete All Data
						</Button>
					</div>
				</div>

				{(editError || errDeleting) && (
					<p className="text-red-500 text-sm text-center">
						{(editError ?? errDeleting)?.message ?? "Something went wrong"}
					</p>
				)}

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
