import { useLocation, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";

const Toolbar = () => {
	const {
		selected,
		// setSelected,
		// error,
		showForm,
		setShowForm,
		// showMenu,
		// setShowMenu,
	} = useGlobal();

	const { pathname } = useLocation();
	const navigate = useNavigate();

	const isTeam = pathname.includes("/team");

	return (
		<div
			id="note-bar"
			className="flex flex-col-reverse md:flex-row md:justify-between items-center w-full bg-bg-elevated border-b border-b-border-light h-[65px] relative p-2 md:p-3 md:pl-3 "
		>
			{pathname === "/team" && (
				<div className="grid grid-cols-3 items-center justify-center w-full h-full">
					<div></div>
					<h1>Team</h1>
					<div>
						<Button
							variant="primary"
							className="m-auto"
							onClick={() => {
								setShowForm((prev) => ({ ...prev, form: "user-add-form" }));
								navigate("/team/new");
							}}
						>
							add
						</Button>
					</div>
				</div>
			)}
			{
				<>
					{/* {selected.n && (
						<div className="flex justify-between w-full md:flex-col md:justify-start md:w-fit text-left">
							<p className="text-xs text-text-muted font-bold md:p-1 m-0 text-balance">
								created: <br />
								{selected
									? new Date(selected.n.createdAt).toLocaleString()
									: " - "}
							</p>

							<p className="text-right md:text-left text-text-muted text-xs text-balance md:p-1 m-0">
								last updated: <br />
								{selected
									? new Date(selected.n.updatedAt).toLocaleString()
									: " - "}
							</p>
						</div>
					)} */}

					<div className="flex flex-nowrap justify-end gap-3">
						{/* {!showForm && selected && (
							<>
								<Button
									onClick={() => setShowForm({ show: true, note: selected })}
								>
									✏️ edit
								</Button>
								<Button>🗑️ delete</Button>
							</>
						)} */}
						{showForm.show && showForm.form && (
							<>
								<Button
									onClick={() => {
										navigate(-1);
									}}
								>
									❌ cancel
								</Button>
								<Button type="submit" form={showForm.form} variant="primary">
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
