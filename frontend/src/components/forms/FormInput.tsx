import clsx from "clsx";
import InputWrapper from "./InputWrapper";

const FormInput = ({
	id,
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	required,
	disabled,
	minLength,
	maxLength,
	autoFocus,
	className,
	large = false,
}: {
	id: string;
	label: string;
	type?: React.HTMLInputTypeAttribute;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	minLength?: number;
	maxLength?: number;
	autoFocus?: boolean;
	className?: string;
	large?: boolean;
}) => {
	return (
		<InputWrapper htmlFor={id} label={label} className={className}>
			<input
				id={id}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				minLength={minLength}
				maxLength={maxLength}
				autoFocus={autoFocus}
				className={clsx(
					large && "w-[250px]",
					!large &&
						"w-full max-w-[250px] px-3 py-2 rounded-lg text-sm bg-bg-surface border border-border-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted/50 transition-colors disabled:opacity-50 mx-auto",
				)}
			/>
		</InputWrapper>
	);
};

export default FormInput;
