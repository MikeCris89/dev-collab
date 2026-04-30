import clsx from "clsx";

const InputWrapper = ({
	htmlFor,
	label,
	children,
	className,
	labelClassName,
}: {
	htmlFor: string;
	label: string;
	children: React.ReactNode;
	className?: string;
	labelClassName?: string;
}) => {
	return (
		<div
			className={clsx(
				"flex flex-col gap-1 w-full max-w-[250px] mx-auto",
				className,
			)}
		>
			<label
				htmlFor={htmlFor}
				className={clsx("self-start text-sm text-text-muted", labelClassName)}
			>
				{label}
			</label>
			{children}
		</div>
	);
};

export default InputWrapper;
