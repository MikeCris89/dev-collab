import FormInput from "./FormInput";

interface PasswordFieldsProps {
	password: string;
	confirmPassword: string;
	onPasswordChange: (val: string) => void;
	onConfirmChange: (val: string) => void;
	error?: string | null;
	disabled?: boolean;
	autoFocus?: boolean;
	minLength?: number;
	passwordLabel?: string;
	confirmLabel?: string;
	large?: boolean;
}

const PasswordFields = ({
	password,
	confirmPassword,
	onPasswordChange,
	onConfirmChange,
	error,
	disabled,
	autoFocus,
	minLength,
	passwordLabel = "Password",
	confirmLabel = "Confirm Password",
	large = false,
}: PasswordFieldsProps) => {
	return (
		<>
			<FormInput
				id="password"
				label={passwordLabel}
				type="password"
				value={password}
				onChange={(e) => onPasswordChange(e.target.value)}
				required
				disabled={disabled}
				autoFocus={autoFocus}
				minLength={minLength}
				large={large}
			/>
			<span className="text-xs text-gray-400 -mt-3 text-center">
				*minimum 8 characters
			</span>
			<FormInput
				id="confirm-password"
				label={confirmLabel}
				type="password"
				value={confirmPassword}
				onChange={(e) => onConfirmChange(e.target.value)}
				required
				disabled={disabled}
				minLength={minLength}
				large={large}
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</>
	);
};

export default PasswordFields;
