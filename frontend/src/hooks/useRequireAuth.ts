import { useAuth } from "@/context/AuthContext";

const useRequireAuth = () => {
	const auth = useAuth();

	if (!auth.user) throw new Error("User not found");

	return {
		...auth,
		user: auth.user,
	};
};

export default useRequireAuth;
