import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Toolbar from "../Toolbar";
import InnerErrorBoundary from "../InnerErrorBoundary";
import { useGlobal } from "@/context/GlobalContext";

const Home = () => {
	const { showMenu } = useGlobal();
	return (
		<div className="flex justify-between items-center h-full w-full ">
			<Sidebar />
			<div className="flex-1 flex flex-col items-stretch h-full w-full">
				<InnerErrorBoundary>
					{showMenu && (
						<div className="md:hidden absolute inset-0 bg-black/40 h-full w-full z-10"></div>
					)}
					<Toolbar />
					<Outlet />
				</InnerErrorBoundary>
			</div>
		</div>
	);
};

export default Home;
