import clsx from "clsx";
import { useEffect, useState } from "react";

const getIsDark = () => {
	if (typeof document === "undefined") return false;
	if (localStorage.getItem("theme") === "dark") return true;
	return document.documentElement.classList.contains("dark");
};

const ThemeSwitcher = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		if (typeof document === "undefined") return;

		setIsDark(getIsDark());

		const obs = new MutationObserver(() => {
			setIsDark(getIsDark());
		});
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		const onStorage = (e: StorageEvent) => {
			if (e.key === "theme") setIsDark(getIsDark());
		};
		window.addEventListener("storage", onStorage);

		return () => {
			obs.disconnect();
			window.removeEventListener("storage", onStorage);
		};
	}, []);

	const toggle = () => {
		const el = document.documentElement;
		el.classList.toggle("dark");
		localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "");
	};
	// console.log(localStorage.getItem("theme"));
	return (
		<div
			className="cursor-pointer transition-all duration-300 relative h-10"
			onClick={toggle}
		>
			<span
				className={clsx(
					" absolute right-0 top-0 text-4xl opacity-0 transition-all duration-300",
					!isDark && "opacity-100"
				)}
				style={{ textShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6" }}
			>
				☾
			</span>

			<span
				className={clsx(
					"absolute right-0 top-0 text-4xl opacity-0 transition-all duration-500",
					isDark && "opacity-100"
				)}
				style={{ textShadow: "0 0 10px #facc15, 0 0 20px #facc15" }}
			>
				☀️
			</span>
		</div>
	);
};

export default ThemeSwitcher;
