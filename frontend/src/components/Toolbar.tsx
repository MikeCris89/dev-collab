import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import clsx from "clsx";
import { FORMS } from "@shared/contract";
import useGetSearchParams from "@/hooks/useGetSearchParams";

const Toolbar = () => {
	const {
		selected,
		// setSelected,
		// error,
		// showForm,
		// setShowForm,
		// showMenu,
		// setShowMenu,
	} = useGlobal();

	const location = useLocation();
	const navigate = useNavigate();

	const { pathname } = location;
	const { noteId } = useParams();
	const [action, formId] = useGetSearchParams(["action", "formId"]);

	const showForm = !!action && !!formId;

	return (
		<div
			id="note-bar"
			className={clsx(
				// "flex flex-col-reverse md:flex-row md:justify-between ",
				"grid grid-cols-3 justify-center items-center",
				" w-full bg-bg-elevated border-b border-b-border-light h-[80px] relative "
			)}
		>
			{/* {pathname === "/team" && (
				<div className="grid grid-cols-3 items-center justify-center w-full h-full">
					<div></div> */}
			<div></div>
			{pathname.includes("/team") && <h1 className="p-0 m-0">Team</h1>}
			{pathname === "/team" && (
				<div>
					<Button
						variant="primary"
						className="m-auto"
						onClick={() => {
							// setShowForm((prev) => ({ ...prev, form: "user-add-form" }));
							// navigate(`/team?action=add&formId=${FORMS.userAdd}`);
						}}
						href={`${pathname}?action=add&formId=${FORMS.userAdd}`}
					>
						add
					</Button>
				</div>
			)}
			{/* </div>
			)} */}
			{
				<>
					{selected.n && (
						<div className="flex justify-between w-full md:flex-col md:justify-start md:w-fit text-left">
							<p className="text-xs text-text-muted font-bold md:p-1 m-0 text-balance">
								created: <br />
								{/* {selected
									? new Date(selected.n.createdAt).toLocaleString()
									: " - "} */}
							</p>

							<p className="text-right md:text-left text-text-muted text-xs text-balance md:p-1 m-0">
								last updated: <br />
								{/* {selected
									? new Date(selected.n.updatedAt).toLocaleString()
									: " - "} */}
							</p>
						</div>
					)}

					<div className="flex flex-nowrap justify-end gap-3 col-start-3">
						{!showForm && noteId && (
							<>
								<Button
									onClick={() => {
										// setShowForm((prev) => ({ ...prev, form: FORMS.n }));
										navigate(`${pathname}?action=edit&formId=${FORMS.n}`, {
											state: { from: pathname },
										});
									}}
								>
									✏️ edit
								</Button>
								<Button>🗑️ delete</Button>
							</>
						)}
						{showForm && (
							<>
								<Button
									onClick={() => {
										navigate(location.state?.from ?? "/", {
											replace: true,
										});
									}}
								>
									❌ cancel
								</Button>
								<Button type="submit" form={formId} variant="primary">
									save
								</Button>
							</>
						)}
					</div>
				</>
			}
		</div>
	);
};

export default Toolbar;
