import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import CustomErrorBoundary from "../CustomErrorBoundary";

const Home = () => {
	return (
		<div className="flex justify-between items-center h-full w-full ">
			<Sidebar />
			<CustomErrorBoundary>
				<Outlet />
			</CustomErrorBoundary>
		</div>
	);
};

export default Home;
