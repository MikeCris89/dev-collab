import { useNavigate, useParams } from "react-router-dom";
import { useNote } from "@/hooks/useProjects";
import Loading from "../Loading";

const NotePreview = () => {
	const { projectId, folderId, noteId } = useParams();
	const navigate = useNavigate();

	const { data: note, isLoading, error } = useNote(projectId, folderId, noteId);

	if (error) throw new Error(`Error getting noteId: ${noteId}`);

	if (isLoading) return <Loading />;

	if (!note) throw new Error("Note not found");

	return (
		<section className="flex-1 flex flex-col gap-3 justify-start items-center h-full w-full border-r border-r-border-medium overflow-hidden">
			<div className="flex-1 flex flex-col gap-5 justify-start items-center w-full p-3 overflow-y-auto">
				<div className="flex flex-col  w-full ">
					<div
						className="text-[12px] cursor-pointer hover:text-accent transition-none p-1 text-right text-nowrap self-end "
						onClick={() => navigate("/")}
					>
						x close
					</div>
					<h1 className="flex-1 text-center ">{note.title}</h1>
				</div>
				<p className="sidebar-list flex-1 card w-full p-6 text-center text-balance whitespace-pre-line text-2xl overflow-y-auto">
					{note.body}
				</p>
			</div>
		</section>
	);
};

export default NotePreview;
