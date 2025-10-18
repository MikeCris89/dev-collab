// import { Outlet, useParams, useSearchParams } from "react-router-dom";
// import Sidebar from "../Sidebar";
// import Toolbar from "../Toolbar";
// import InnerErrorBoundary from "../InnerErrorBoundary";
import GlobalProvider from "@/context/GlobalContext";
// import FormRenderer from "../forms/FormRenderer";
import Layout from "../Layout";
import { useTeam } from "@/hooks/useTeam";

const Home = () => {
	useTeam();

	// const { showMenu, selected } = useGlobal();
	// const [searchParams] = useSearchParams();
	// const action = searchParams.get("action");
	// const showForm = action === "add" || action === "edit";

	// const params = useParams();
	// console.log("HOME selected: ", selected.page);

	return (
		<div className="flex justify-between items-center h-full w-full ">
			<GlobalProvider>
				{/* <Sidebar />
				<div className="flex-1 flex flex-col items-stretch h-full w-full">
					<InnerErrorBoundary>
						// black backdrop for mobile menu
						{showMenu && (
							<div className="md:hidden absolute inset-0 bg-black/40 h-full w-full z-10"></div>
						)}
						<Toolbar />
						{showForm ? <FormRenderer /> : <Outlet />}
					</InnerErrorBoundary>
				</div> */}
				<Layout />
			</GlobalProvider>
		</div>
	);
};

export default Home;
