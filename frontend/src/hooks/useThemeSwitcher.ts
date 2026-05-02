import { useEffect, useState } from "react";

const useThemeSwitcher = () => {
	const [isDark, setIsDark] = useState(() => {
		const t = localStorage.getItem("theme");
		if (t) return t === "dark";
		return true;
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
	}, [isDark]);

	return {
		isDark,
		toggle: () => setIsDark((d) => !d),
	};
};

export default useThemeSwitcher;
