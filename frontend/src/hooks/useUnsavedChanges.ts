import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChanges(isDirty: boolean) {
	// Block in-app navigation
	const blocker = useBlocker(isDirty);

	useEffect(() => {
		if (!isDirty) return;
		if (blocker.state === "blocked") {
			const ok = window.confirm("You have unsaved changes. Leave anyway?");
			ok ? blocker.proceed() : blocker.reset();
		}
	}, [isDirty, blocker]);

	// Block tab close / reload
	useEffect(() => {
		if (!isDirty) return;
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = ""; // required by Chrome
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [isDirty]);
}
