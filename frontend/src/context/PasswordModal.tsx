import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormInput from "@/components/forms/FormInput";
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
}

const ModalCtx = createContext<ModalCtx | null>(null);

const PasswordModalUI = () => {
	const { showModal, setShowModal } = usePasswordModal();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const resetForm = () => {
		setNewPassword("");
		setConfirmPassword("");
		setPasswordError(null);
	};

	const handleClose = () => {
		resetForm();
		setShowModal(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}
		console.log("Change password stub:", { newPassword });
		handleClose();
	};

	if (!showModal) return null;

	return (
		<Modal>
			<h2 className="w-full text-center text-xl font-semibold">
				Change Password
			</h2>
			<form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
				<FormInput
					id="new-password"
					label="New Password"
					type="password"
					value={newPassword}
					onChange={(e) => {
						setNewPassword(e.target.value);
						setPasswordError(null);
					}}
					required
					minLength={LIMITS.PASSWORD_MIN_LENGTH}
					autoFocus
				/>
				<FormInput
					id="confirm-password"
					label="Confirm New Password"
					type="password"
					value={confirmPassword}
					onChange={(e) => {
						setConfirmPassword(e.target.value);
						setPasswordError(null);
					}}
					required
					minLength={LIMITS.PASSWORD_MIN_LENGTH}
				/>
				{passwordError && (
					<p className="text-red-500 text-sm">{passwordError}</p>
				)}
				<div className="flex gap-3 self-end mt-2">
					<Button onClick={handleClose}>Cancel</Button>
					<Button variant="primary" type="submit">
						Update Password
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export const PasswordModalProvider = ({ children }: PropsWithChildren) => {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<ModalCtx.Provider value={{ showModal, setShowModal }}>
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
