import GlobalProvider from "@/context/GlobalContext";
import Layout from "../Layout";
import { useTeam } from "@/hooks/useTeam";
import ModalProvider from "@/context/DeleteModalContext";

const Home = () => {
	useTeam();

	return (
		<div className="flex h-full w-full border-x border-x-border-medium">
			<GlobalProvider>
				<ModalProvider>
					<Layout />
				</ModalProvider>
			</GlobalProvider>
		</div>
	);
};

export default Home;
