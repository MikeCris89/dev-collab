import useGetSearchParams from "@/hooks/useGetSearchParams";
import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

export const btnInitStyle =
	"text-center min-w-[75px] py-2 px-3 md:py-3 md:px-4 text-nowrap  flex-nowrap duration-100 ease-in transition-all rounded-xl";

export const btnVariants: { default: string; primary: string; menu: string } = {
	default: clsx(
		"bg-bg-surface/60 text-[14px] outline-1 outline-border-light ",
		"hover:outline-border-medium hover:bg-border-light",
		"active:outline-border-medium active:bg-border-light"
		// "focus:outline-border-medium focus:bg-border-light",
		// "enabled:hover:outline-border-medium enabled:hover:bg-border-light",
		// "enabled:focus:outline-border-medium enabled:focus:bg-border-light",
		// "enabled:active:outline-border-medium enabled:active:bg-border-light",
	),
	primary: clsx(
		"text-[16px] text-white bg-accent focus:bg-accent font-bold",
		"hover:bg-accent hover:shadow-[0_2px_20px] hover:shadow-accent hover:-translate-y-0.5",
		"active:bg-accent active:shadow-[0_2px_20px] active:shadow-accent active:-translate-y-0.5 "
		// "enabled:hover:bg-accent hover:shadow-[0_2px_20px] enabled:hover:shadow-accent enabled:hover:-translate-y-0.5 ",
		// "enabled:focus:bg-accent ",
		// "enabled:active:bg-accent active:shadow-[0_2px_20px] enabled:active:shadow-accent enabled:active:-translate-y-0.5 "
	),
	menu: clsx(
		"text-[16px] text-white bg-accent focus:bg-accent font-bold text-center",
		"hover:bg-accent hover:shadow-[0_2px_20px] hover:shadow-accent ",
		"active:bg-accent active:shadow-[0_2px_20px] active:shadow-accent "
		// "enabled:hover:bg-accent hover:shadow-[0_2px_20px] enabled:hover:shadow-accent ",
		// "enabled:focus:bg-accent ",
		// "enabled:active:bg-accent active:shadow-[0_2px_20px] enabled:active:shadow-accent "
	),
};

const Button = ({
	variant = "default",
	type = "button",
	form,
	disabled = false,
	children,
	onClick,
	className,
	href,
	replace = false,
}: React.PropsWithChildren<{
	variant?: "default" | "primary" | "menu";
	type?: "button" | "submit" | "reset";
	form?: string;
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
	href?: string;
	replace?: boolean;
}>) => {
	const { pathname } = useLocation();
	const [action, formId] = useGetSearchParams(["action", "formId"]);
	const showForm = !!action && !!formId;

	// const handleClick = (
	// 	e: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
	// ) => {
	// 	e.stopPropogation();
	// };

	return (
		<>
			{href ? (
				<NavLink
					to={href}
					className={clsx(
						"hover:no-underline text-text-muted rounded-xl",
						btnInitStyle,
						btnVariants[variant],
						className
					)}
					onClick={onClick}
					state={{ from: pathname }}
					replace={showForm || replace || undefined}
				>
					{children}
				</NavLink>
			) : (
				<button
					type={type}
					className={clsx(btnInitStyle, btnVariants[variant], className)}
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
