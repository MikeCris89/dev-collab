import GlobalProvider from "@/context/GlobalContext";
import Layout from "../Layout";
import { useTeam } from "@/hooks/useTeam";

const Home = () => {
	useTeam();

	return (
		<div className="flex h-full w-full border-x border-x-border-medium">
			<GlobalProvider>
				<Layout />
			</GlobalProvider>
		</div>
	);
};

export default Home;
