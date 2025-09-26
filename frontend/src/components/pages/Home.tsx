import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import CustomErrorBoundary from "../CustomErrorBoundary";
import Toolbar from "../Toolbar";

const Home = () => {
	return (
		<div className="flex justify-between items-center h-full w-full ">
			<Sidebar />
			<div className="flex-1 flex flex-col items-stretch h-full w-full">
				<CustomErrorBoundary>
					<Toolbar />
					<Outlet />
				</CustomErrorBoundary>
			</div>
		</div>
	);
};

export default Home;
