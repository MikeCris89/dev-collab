// ==== QUERIES ====
// =======================

import type { Project, ProjectInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleter, fetcher, poster, putter } from "@/lib/api";
import { TEAMKEY } from "./useTeam";

export const PROJECTKEY = "projects";
const BASE = "/projects";

// fetch ONE project with folders and notes
export const useProject = (id: string | null) => {
	return useQuery({
		queryKey: [PROJECTKEY, id],
		queryFn: () => fetcher<ProjectWithAll>(`${BASE}/${id}`),
		enabled: !!id,
	});
};

// select one note from folder in project cache
export const useNote = (
	projectId: string | undefined,
	folderId: string | undefined,
	noteId: string | undefined
) => {
	return useQuery({
		queryKey: [PROJECTKEY, projectId],
		queryFn: () => fetcher<ProjectWithAll>(`${BASE}/${projectId}`),
		select: (data) =>
			data?.folders
				?.find((f) => f.id === folderId)
				?.notes?.find((n) => n.id === noteId) ?? null,
		enabled: !!projectId && !!folderId && !!noteId,
	});
};

// ==== MUTATIONS ====
// =======================

// create new project
export const useCreateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ data }: { data: ProjectInput }) =>
			poster<ProjectInput, Project>(`${BASE}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
	});
};

// update existing project
export const useUpdateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ProjectInput }) =>
			putter<ProjectInput, Project>(`${BASE}/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
	});
};

// delete project
export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleter(`${BASE}/${id}`),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });

			queryClient.removeQueries({ queryKey: [PROJECTKEY, id] });
		},
	});
};
