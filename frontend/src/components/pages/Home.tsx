import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Toolbar from "../Toolbar";
import InnerErrorBoundary from "../InnerErrorBoundary";

const Home = () => {
	return (
		<div className="flex justify-between items-center h-full w-full ">
			<Sidebar />
			<div className="flex-1 flex flex-col items-stretch h-full w-full">
				<InnerErrorBoundary>
					<Toolbar />
					<Outlet />
				</InnerErrorBoundary>
			</div>
		</div>
	);
};

export default Home;
