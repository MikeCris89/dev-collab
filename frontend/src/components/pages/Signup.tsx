import type { SignupRequest } from "@shared/contract";
import Button from "../Button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../forms/FormInput";
import PasswordFields from "../forms/PasswordFields";
import LoadingSpinner from "../LoadingSpinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
	const { isLoading, signup } = useAuth();
	const [userData, setUserData] = useState<SignupRequest>({
		username: "",
		password: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [privacyChecked, setPrivacyChecked] = useState(false);
	const [deletionChecked, setDeletionChecked] = useState(false);

	const usernameIsEmail = EMAIL_REGEX.test(userData.username.trim());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (userData.password !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}
		if (userData.username && userData.password && !usernameIsEmail)
			signup(userData);
	};

	const canSubmit =
		!isLoading &&
		!usernameIsEmail &&
		userData.password.length > 0 &&
		confirmPassword.length > 0 &&
		privacyChecked &&
		deletionChecked;

	return (
		<form
			id="user-form"
			onSubmit={handleSubmit}
			className="flex flex-col gap-3 w-full pb-0"
			autoComplete="off"
		>
			<div className="grid grid-cols-2 gap-3 w-full">
				<div>
					<FormInput
						id="username"
						label="Username*"
						value={userData.username}
						onChange={(e) =>
							setUserData((prev) => ({ ...prev, username: e.target.value }))
						}
						disabled={isLoading}
						autoFocus
						required
					/>
					<p
						className={`text-xs mt-0.5 ${usernameIsEmail ? "text-red-500" : "text-text-muted"}`}
					>
						{usernameIsEmail
							? "Please use a username, not an email address."
							: "Use a username, not your email address."}
					</p>
				</div>
				<div>
					<FormInput
						id="name"
						label="Name"
						value={userData.name ?? ""}
						onChange={(e) =>
							setUserData((prev) => ({ ...prev, name: e.target.value }))
						}
						disabled={isLoading}
						placeholder="(optional)"
					/>
				</div>
			</div>

			{/* // TODO generate random passwords instead, do not let users create their own passwords */}

			<PasswordFields
				password={userData.password}
				confirmPassword={confirmPassword}
				onPasswordChange={(val) => {
					setUserData((prev) => ({ ...prev, password: val }));
					setPasswordError(null);
				}}
				onConfirmChange={(val) => {
					setConfirmPassword(val);
					setPasswordError(null);
				}}
				error={passwordError}
				disabled={isLoading}
				minLength={8}
				direction="row"
			/>

			<div className="flex flex-col gap-2 text-sm text-text-muted border border-border-light rounded-lg p-3">
				<label className="flex items-start gap-2 cursor-pointer text-sm">
					<input
						type="checkbox"
						checked={privacyChecked}
						onChange={(e) => setPrivacyChecked(e.target.checked)}
						className="mt-0.5 shrink-0"
					/>
					<span>
						I understand this is a demo portfolio app and I will{" "}
						<strong className="text-text-primary">not</strong> enter any
						sensitive or personal information.
					</span>
				</label>
				<label className="flex items-start gap-2 cursor-pointer text-sm">
					<input
						type="checkbox"
						checked={deletionChecked}
						onChange={(e) => setDeletionChecked(e.target.checked)}
						className="mt-0.5 shrink-0"
					/>
					<span>
						I understand that my account and all data will be{" "}
						<strong className="text-text-primary">
							permanently deleted 7 - 10 days
						</strong>{" "}
						after creation.
					</span>
				</label>
			</div>

			<Button
				type="submit"
				disabled={!canSubmit}
				variant="primary"
				className="w-full"
			>
				{isLoading ? <LoadingSpinner /> : "Create Account"}
			</Button>
		</form>
	);
};

export default Signup;
