import { useGlobal } from "@/context/GlobalContext";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import { Outlet, useSearchParams } from "react-router-dom";
import FormRenderer from "./forms/FormRenderer";
import InnerErrorBoundary from "./InnerErrorBoundary";

const Layout = () => {
	const { showMenu } = useGlobal();
	const [searchParams] = useSearchParams();
	const action = searchParams.get("action");
	const showForm = action === "add" || action === "edit";

	return (
		<>
			<Sidebar />
			<div className="flex-1 flex flex-col items-stretch h-full w-full">
				<InnerErrorBoundary>
					{/* black backdrop for mobile menu */}
					{showMenu && (
						<div className="md:hidden absolute inset-0 bg-black/40 h-full w-full z-10"></div>
					)}
					<Toolbar />
					{showForm ? <FormRenderer /> : <Outlet />}
				</InnerErrorBoundary>
			</div>
		</>
	);
};

export default Layout;
