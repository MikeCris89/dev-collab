// ==== QUERIES ====
// =======================

import type { Project, ProjectInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleter, fetcher, poster, putter } from "@/lib/api";
import { TEAMKEY, type TeamFull } from "./useTeam";

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

// ==== MUTATIONS ====
// =======================

// create new project
export const useCreateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			data,
			projectId,
		}: {
			data: ProjectInput;
			projectId: string;
		}) => poster<ProjectInput, Project>(`${BASE}/${projectId}`, data),
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
