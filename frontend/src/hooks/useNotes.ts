import { deleter, poster, putter } from "@/lib/api";
import type { Note, NoteInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PROJECTKEY } from "./useProjects";

const BASE = "/notes";

export const useCreateNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			data,
			folderId,
			projectId,
		}: {
			data: NoteInput;
			folderId: string;
			projectId: string;
		}) => poster<NoteInput, Note>(`${BASE}/${folderId}`, data),
		onSuccess: (resp, { projectId }) => {
			queryClient.setQueryData(
				[PROJECTKEY, projectId],
				(old: ProjectWithAll) => {
					return {
						...old,
						folders: old.folders.map((f) =>
							f.id === resp.folderId ? { ...f, notes: [...f.notes, resp] } : f
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
			id,
			data,
			folderId,
		}: {
			id: string;
			data: NoteInput;
			folderId: string;
		}) => putter<NoteInput, Note>(`${BASE}/${folderId}/${id}`, data),
		onSuccess: (resp) => {
			queryClient.setQueryData([PROJECTKEY], (old: Note[]) => {
				return old.map((n) => (n.id === resp.id ? resp : n));
			});
		},
	});
};

export const useDeleteNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, folderId }: { id: string; folderId: string }) =>
			deleter(`${BASE}/${folderId}/${id}`),
		onSuccess: (_resp, { id }) => {
			queryClient.setQueryData([PROJECTKEY], (old: Note[]) => {
				return old.filter((n) => n.id !== id);
			});
		},
	});
};
