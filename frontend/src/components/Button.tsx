import clsx from "clsx";

const Button = ({
	variant = "default",
	type = "button",
	form,
	disabled = false,
	children,
	onClick,
}: React.PropsWithChildren<{
	variant?: "default" | "primary";
	type?: "button" | "submit" | "reset";
	form?: string;
	disabled?: boolean;
	onClick?: () => void;
}>) => {
	const variants: { default: string; primary: string } = {
		default: clsx(
			"bg-bg-surface/60 text-[14px] outline-1 outline-border-light py-3 px-4",
			"hover:outline-border-medium hover:bg-border-light",
			"focus:outline-border-medium focus:bg-border-light",
			"active:outline-border-medium active:bg-border-light",
			""
		),
		primary: clsx(
			"text-[15px] text-white bg-accent focus:bg-accent py-3 px-4",
			"hover:bg-accent hover:shadow-[0_2px_20px] hover:shadow-accent hover:-translate-y-0.5 ",
			"focus:bg-accent ",
			"active:bg-accent active:shadow-[0_2px_20px] active:shadow-accent active:-translate-y-0.5 "
		),
	};
	return (
		<button
			type={type}
			className={clsx("text-center min-w-[75px]", variants[variant])}
			disabled={disabled}
			onClick={onClick}
			form={form}
		>
			{children}
		</button>
	);
};

export default Button;
