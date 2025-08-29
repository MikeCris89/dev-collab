import clsx from "clsx";
import { useEffect, useState } from "react";

const getIsDark = () => {
	if (typeof document === "undefined") return false;
	return document.documentElement.classList.contains("dark");
};

const getStorageIsDark = () => {
	if (localStorage.getItem("theme") === "dark") return true;
	return false;
};

const ThemeSwitcher = () => {
	const [isDark, setIsDark] = useState(getStorageIsDark());

	useEffect(() => {
		if (typeof document === "undefined") return;

		const el = document.documentElement;

		const storage = getStorageIsDark();

		if (storage !== el.classList.contains("dark")) {
			if (storage) {
				// console.log("storage is dark, element is not");
				el.classList.add("dark");
			} else {
				// console.log("storage is light, element is not");
				el.classList.remove("dark");
			}
		}

		const obs = new MutationObserver(() => {
			setIsDark(getIsDark());
		});
		obs.observe(el, {
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
		setTimeout(() => {
			const el = document.documentElement;
			el.classList.toggle("dark");
			localStorage.setItem(
				"theme",
				el.classList.contains("dark") ? "dark" : ""
			);
		}, 150);
	};

	// const shadowColor = isDark ? "#facc15" : "#3b82f6";
	const baseStyle = clsx(
		"absolute right-0 top-0 text-3xl transition-opacity duration-[300ms]"
		// "[transition-property:colors] [transition-duration:200ms]",
		// `hover:text-shadow-[0_0_10px_${shadowColor},0_0_20px_${shadowColor}]`,
		// `active:text-shadow-[0_0_10px_${shadowColor},0_0_20px_${shadowColor}]`
	);
	// console.log(localStorage.getItem("theme"), isDark);
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

			{/* <span
				className={clsx(
					"absolute right-0 top-0 text-3xl transition-all duration-300",
					`hover:text-shadow-[0_0_10px_${shadowColor},0_0_20px_${shadowColor}]`,
		
				)}
				// style={{ textShadow: "0 0 10px #facc15, 0 0 20px #facc15" }}
			>
				<i className={clsx(isDark ? "opacity-100" : "opacity-0")}>☀️</i>
				<i className={clsx(!isDark ? "opacity-100" : "opacity-0")}>☾</i>
			</span> */}
		</div>
	);
};

export default ThemeSwitcher;
