import { deleter, poster, putter } from "@/lib/api";
import type { Note, NoteInput } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROJECTKEY } from "./useProjects";

const BASE = "/notes";

export const useCreateNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: NoteInput) => poster<NoteInput, Note>(BASE, data),
		onSuccess: (resp) => {
			queryClient.setQueryData([PROJECTKEY], (old: Note[]) => {
				return [...old, resp];
			});
		},
	});
};

export const useEditNote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: NoteInput }) =>
			putter<NoteInput, Note>(`${BASE}/${id}`, data),
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
		mutationFn: (id: string) => deleter(`${BASE}/${id}`),
		onSuccess: (_resp, id) => {
			queryClient.setQueryData([PROJECTKEY], (old: Note[]) => {
				return old.filter((n) => n.id !== id);
			});
		},
	});
};
