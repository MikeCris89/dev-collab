import Button from "@/components/Button";
import Modal from "@/components/Modal";
import PasswordFields from "@/components/forms/PasswordFields";
import { usePasswordChange } from "@/hooks/useTeam";
import { LIMITS } from "@shared/contract";
import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from "react";

interface ModalCtx {
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	userId: string | null;
	setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ModalCtx = createContext<ModalCtx | null>(null);

const PasswordModalUI = () => {
	const { showModal, setShowModal, userId } = usePasswordModal();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { mutateAsync: changePassword, isPending } = usePasswordChange();

	const resetForm = () => {
		setNewPassword("");
		setConfirmPassword("");
		setPasswordError(null);
	};

	const handleClose = () => {
		resetForm();
		setShowModal(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}
		if (!userId) {
			setPasswordError("User ID not provided.");
			return;
		}
		try {
			console.log(userId);
			await changePassword({ id: userId, password: newPassword });
			setSuccess(true);
		} catch (e) {
			setPasswordError(
				e instanceof Error ? e.message : "Error setting password",
			);
		}
	};

	if (!showModal) return null;

	if (success)
		return (
			<Modal>
				<p>Password updated successfully.</p>
				<Button onClick={handleClose}>Close</Button>
			</Modal>
		);

	return (
		<Modal>
			<h2 className="w-full text-center text-xl font-semibold">
				Change Password
			</h2>
			<form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
				<PasswordFields
					password={newPassword}
					confirmPassword={confirmPassword}
					onPasswordChange={(val) => { setNewPassword(val); setPasswordError(null); }}
					onConfirmChange={(val) => { setConfirmPassword(val); setPasswordError(null); }}
					error={passwordError}
					minLength={LIMITS.PASSWORD_MIN_LENGTH}
					autoFocus
					disabled={isPending}
					passwordLabel="New Password"
					confirmLabel="Confirm New Password"
				/>
				<div className="flex gap-3 self-end mt-2">
					<Button onClick={handleClose} disabled={isPending}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={isPending}>
						{isPending ? "Saving..." : "Update Password"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export const PasswordModalProvider = ({ children }: PropsWithChildren) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [userId, setUserId] = useState<string | null>(null);

	return (
		<ModalCtx.Provider value={{ showModal, setShowModal, setUserId, userId }}>
			{children}
			<PasswordModalUI />
		</ModalCtx.Provider>
	);
};

export const usePasswordModal = () => {
	const ctx = useContext(ModalCtx);
	if (!ctx)
		throw new Error(
			"Form Modal Context must be used within provider component.",
		);
	return ctx;
};
