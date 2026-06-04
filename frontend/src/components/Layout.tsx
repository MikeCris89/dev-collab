import { useGlobal } from "@/context/GlobalContext";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import { Outlet, useSearchParams } from "react-router-dom";
import FormRenderer from "./forms/FormRenderer";
import InnerErrorBoundary from "./InnerErrorBoundary";
import CustomErrorBoundary from "./CustomErrorBoundary";

const Layout = () => {
	const { showMenu } = useGlobal();
	const [searchParams] = useSearchParams();
	const action = searchParams.get("action");
	const showForm = action === "add" || action === "edit";

	return (
		// Outer boundary (inside the router, so it actually catches route-render
		// errors) — wraps the Sidebar too, so a Sidebar/team-data error is caught.
		<CustomErrorBoundary>
			<Sidebar />
			<div className="flex-1 flex flex-col justify-center items-center  h-full w-full overflow-hidden ">
				{/* Inner boundary — beneath the Sidebar. A content error shows the
				    fallback here while the Sidebar keeps rendering and stays usable. */}
				<InnerErrorBoundary>
					{/* black backdrop for mobile menu */}
					{showMenu && (
						<div className="md:hidden absolute inset-0 bg-black/40 h-full w-full z-10"></div>
					)}
					<Toolbar />
					{showForm ? <FormRenderer /> : <Outlet />}
				</InnerErrorBoundary>
			</div>
		</CustomErrorBoundary>
	);
};

export default Layout;
