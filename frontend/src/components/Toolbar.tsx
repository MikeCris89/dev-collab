import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";

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

	return (
		<div
			id="note-bar"
			className="flex flex-col-reverse md:flex-row md:justify-between md:items-center w-full bg-bg-elevated border-b border-b-border-light h-fit relative p-1 md:p-3 md:pl-3"
		>
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

					{/* <div className="flex flex-nowrap justify-end gap-3 py-3 md:py-0 h-[65px] md:h-fit">
						{!showForm.show && selected && (
							<>
								<Button
									onClick={() => setShowForm({ show: true, note: selected })}
								>
									✏️ edit
								</Button>
								<Button>🗑️ delete</Button>
							</>
						)}
						{showForm.show && (
							<>
								<Button
									onClick={() => setShowForm({ show: false, note: null })}
								>
									❌ cancel
								</Button>
								<Button type="submit" form="note-form" variant="primary">
									save
								</Button>
							</>
						)}
					</div> */}
				</>
			}
		</div>
	);
};

export default Toolbar;
