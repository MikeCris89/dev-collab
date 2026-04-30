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
	direction?: "row" | "col";
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
	direction = "col",
}: PasswordFieldsProps) => {
	const isRow = direction === "row";

	return (
		<div className={isRow ? "grid grid-cols-2 gap-3 w-full" : "contents"}>
			<div>
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
				<span className="text-xs text-text-muted mt-0.5">
					*minimum 8 characters
				</span>
			</div>
			<div>
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
				{error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
			</div>
		</div>
	);
};

export default PasswordFields;
