import type { SignupRequest } from "@shared/contract";
import Button from "../Button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import InputWrapper from "../forms/InputWrapper";
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

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
		<div className="max-h-[500px] min-h-0 overflow-y-auto">
			<form
				id="user-form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 items-center justify-center w-full max-w-[500px]"
				autoComplete="off"
			>
				<InputWrapper htmlFor="username" label="Username">
					<input
						name="username"
						id="username"
						required
						value={userData.username}
						onChange={handleChange}
						disabled={isLoading}
						autoComplete="off"
						className="w-[250px]"
					/>
				</InputWrapper>
				{usernameIsEmail ? (
					<p className="text-red-500 text-xs -mt-3 text-center">
						Please use a username, not an email address.
					</p>
				) : (
					<p className="text-gray-400 text-xs -mt-3 text-center">
						Use a username, not your email address.
					</p>
				)}

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
					large
				/>

				<InputWrapper htmlFor="name" label="Name">
					<input
						name="name"
						id="name"
						value={userData.name ?? undefined}
						onChange={handleChange}
						disabled={isLoading}
						autoComplete="off"
						className="w-[250px]"
						placeholder="(optional)"
					/>
				</InputWrapper>

				<div className="flex flex-col gap-3 w-full max-w-[380px] text-sm text-gray-300 border border-neutral-200 rounded-lg p-4">
					<label className="flex items-start gap-3 cursor-pointer text-[16px]">
						<input
							type="checkbox"
							checked={privacyChecked}
							onChange={(e) => setPrivacyChecked(e.target.checked)}
							className="mt-0.5 shrink-0"
						/>
						<span>
							I understand this is a demo portfolio app and I will{" "}
							<strong>not</strong> enter any sensitive or personal information.
						</span>
					</label>
					<label className="flex items-start gap-3 cursor-pointer text-[16px]">
						<input
							type="checkbox"
							checked={deletionChecked}
							onChange={(e) => setDeletionChecked(e.target.checked)}
							className="mt-0.5 shrink-0"
						/>
						<span>
							I understand that my account and all associated data will be{" "}
							<strong>permanently deleted 7 days</strong> after creation.
						</span>
					</label>
				</div>

				<div className="flex gap-2  p-3">
					<Button type="submit" disabled={!canSubmit} variant="primary">
						{isLoading ? <LoadingSpinner /> : "Submit"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Signup;
