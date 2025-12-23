import { deleter, fetcher, poster, putter } from "@/lib/api";
import type { Note, NoteInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROJECTKEY } from "./useProjects";

const BASE = "/notes";

// select all notes from folder in useProject cache
export const useFolderNotes = ({
	projectId,
	folderId,
}: {
	projectId: string | null;
	folderId: string | null;
}) => {
	return useQuery({
		queryKey: [PROJECTKEY, projectId],
		queryFn: () => fetcher<ProjectWithAll>(`/projects/${projectId}`),
		select: (data) =>
			data?.folders?.find((f) => f.id === folderId)?.notes ?? [],
		enabled: !!projectId && !!folderId,
	});
};

export const useCreateNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (args: {
			data: NoteInput;
			folderId: string;
			projectId: string;
		}) => poster<NoteInput, Note>(`${BASE}/${args.folderId}`, args.data),
		onSuccess: (resp, { projectId }) => {
			queryClient.setQueryData(
				[PROJECTKEY, projectId],
				(old: ProjectWithAll) => {
					console.log("USE NOTES: ", old.folders);
					return {
						...old,
						folders: old.folders.map((f) =>
							f.id === resp.folderId
								? { ...f, notes: [...(f.notes ?? []), resp] }
								: f
						),
					};
				}
			);
		},
	});
};

export const useUpdateNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			noteId,
			data,
			folderId,
			projectId,
		}: {
			noteId: string;
			data: NoteInput;
			folderId: string;
			projectId: string;
		}) => putter<NoteInput, Note>(`${BASE}/${folderId}/${noteId}`, data),
		onSuccess: (resp, { folderId, projectId }) => {
			queryClient.setQueryData(
				[PROJECTKEY, projectId],
				(old: ProjectWithAll) => {
					const folder = old.folders.find((f) => f.id === folderId);
					if (!folder) throw new Error("useUpdateNote: folder not found");
					const newFolder = {
						...folder,
						notes: folder.notes.map((n) => (n.id === resp.id ? resp : n)),
					};
					return {
						...old,
						folders: old.folders.map((f) =>
							f.id === folderId ? newFolder : f
						),
					};
				}
			);
		},
	});
};

export const useDeleteNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			folderId,
			projectId,
		}: {
			id: string;
			folderId: string;
			projectId: string;
		}) => deleter(`${BASE}/${folderId}/${id}`),
		onSuccess: (_resp, { id, folderId, projectId }) => {
			queryClient.setQueryData(
				[PROJECTKEY, projectId],
				(old: ProjectWithAll) => {
					console.log("note old", old);
					const folder = old.folders.find((f) => f.id === folderId);
					if (!folder) throw new Error("useUpdateNote: folder not found");
					const newFolder = {
						...folder,
						notes: folder.notes.filter((n) => n.id !== id),
					};
					return {
						...old,
						folders: old.folders.map((f) =>
							f.id === folderId ? newFolder : f
						),
					};
				}
			);
		},
	});
};
