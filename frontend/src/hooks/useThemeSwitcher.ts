import { useEffect, useState } from "react";

const getIsDark = () => {
	if (typeof document === "undefined") return false;
	return document.documentElement.classList.contains("dark");
};

const getStorageIsDark = () => {
	if (localStorage.getItem("theme") === "dark") return true;
	return false;
};

const useThemeSwitcher = () => {
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

	return {
		toggle,
		isDark,
	};
};

export default useThemeSwitcher;
