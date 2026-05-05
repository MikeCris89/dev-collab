import useRequireAuth from "@/hooks/useRequireAuth";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }: PropsWithChildren) => {
	const { isAdmin } = useRequireAuth();
	console.log(isAdmin);

	if (!isAdmin) return <Navigate to="/" replace />;

	return <>{children}</>;
};

export default RequireAdmin;
