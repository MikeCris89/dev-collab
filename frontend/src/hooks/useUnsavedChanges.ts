import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChanges(isDirty: boolean) {
	const allowNav = useRef(false);
	// Block in-app navigation
	const blocker = useBlocker(isDirty && !allowNav.current);

	useEffect(() => {
		if (!isDirty) return;
		if (blocker.state === "blocked") {
			const ok = window.confirm("You have unsaved changes. Leave anyway?");
			if (ok) blocker.proceed();
			else blocker.reset();
		}
	}, [isDirty, blocker]);

	// Block tab close / reload
	useEffect(() => {
		if (!isDirty) return;
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [isDirty]);

	const allowNavigation = (value = true) => {
		allowNav.current = value;
	};

	return allowNavigation;
}
