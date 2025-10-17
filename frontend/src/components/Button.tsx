import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

const Button = ({
	variant = "default",
	type = "button",
	form,
	disabled = false,
	children,
	onClick,
	className,
	href,
}: React.PropsWithChildren<{
	variant?: "default" | "primary" | "menu";
	type?: "button" | "submit" | "reset";
	form?: string;
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
	href?: string;
}>) => {
	const { pathname } = useLocation();
	const initStyle = "text-center min-w-[75px] py-2 px-1 md:py-3 md:px-4";

	const variants: { default: string; primary: string; menu: string } = {
		default: clsx(
			"bg-bg-surface/60 text-[14px] outline-1 outline-border-light ",
			"hover:outline-border-medium hover:bg-border-light",
			// "focus:outline-border-medium focus:bg-border-light",
			"enabled:hover:outline-border-medium enabled:hover:bg-border-light",
			// "enabled:focus:outline-border-medium enabled:focus:bg-border-light",
			"enabled:active:outline-border-medium enabled:active:bg-border-light",
			""
		),
		primary: clsx(
			"text-[16px] text-white bg-accent focus:bg-accent font-bold",
			"enabled:hover:bg-accent hover:shadow-[0_2px_20px] enabled:hover:shadow-accent enabled:hover:-translate-y-0.5 ",
			// "enabled:focus:bg-accent ",
			"enabled:active:bg-accent active:shadow-[0_2px_20px] enabled:active:shadow-accent enabled:active:-translate-y-0.5 "
		),
		menu: clsx(
			"text-[16px] text-white bg-accent focus:bg-accent font-bold text-center",
			"enabled:hover:bg-accent hover:shadow-[0_2px_20px] enabled:hover:shadow-accent ",
			// "enabled:focus:bg-accent ",
			"enabled:active:bg-accent active:shadow-[0_2px_20px] enabled:active:shadow-accent "
		),
	};
	return (
		<>
			{href ? (
				<NavLink
					to={href}
					className={clsx(
						"hover:no-underline text-text-muted rounded-md",
						initStyle,
						variants[variant],
						className
					)}
					onClick={onClick}
					state={{ from: pathname }}
				>
					{children}
				</NavLink>
			) : (
				<button
					type={type}
					className={clsx(initStyle, variants[variant], className)}
					disabled={disabled}
					onClick={onClick}
					form={form}
				>
					{children}
				</button>
			)}
		</>
	);
};

export default Button;
