import useThemeSwitcher from "@/hooks/useThemeSwitcher";
import clsx from "clsx";

const ThemeSwitcher = () => {
	const { toggle, isDark } = useThemeSwitcher();
	const baseStyle = clsx(
		"absolute right-0 top-0 text-3xl transition-opacity duration-[300ms]"
	);
	return (
		<div className="cursor-pointer relative h-10" onClick={toggle}>
			<span
				className={clsx(
					baseStyle,
					isDark ? "opacity-100" : "opacity-0 pointer-events-none",
					"hover:text-shadow-[0_0_10px_#facc15,0_0_20px_#facc15]",
					"active:text-shadow-[0_0_10px_#facc15,0_0_20px_#facc15]"
				)}
			>
				☀️
			</span>
			<span
				className={clsx(
					baseStyle,
					!isDark ? "opacity-100" : "opacity-0 pointer-events-none",
					"hover:text-shadow-[0_0_10px_#3b82f6,0_0_20px_#3b82f6]",
					"active:text-shadow-[0_0_10px_#3b82f6,0_0_20px_#3b82f6]"
				)}
			>
				☾
			</span>
		</div>
	);
};

export default ThemeSwitcher;
