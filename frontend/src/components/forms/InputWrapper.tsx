import clsx from "clsx";

const InputWrapper = ({
	htmlFor,
	label,
	children,
	className,
}: {
	htmlFor: string;
	label: string;
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={clsx("flex flex-col gap-1", className)}>
			<label htmlFor={htmlFor} className="self-start">
				{label}
			</label>
			{children}
		</div>
	);
};

export default InputWrapper;
