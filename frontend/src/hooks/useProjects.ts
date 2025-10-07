// ==== QUERIES ====
// =======================

import type { Project, ProjectInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleter, fetcher, poster, putter } from "@/lib/api";
import { TEAMKEY } from "./useTeam";

const KEY = "projects";
const BASE = "/projects";

// fetch ONE project with folders and notes
export const useProject = (id: string | null) => {
	return useQuery({
		queryKey: [KEY, id],
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
		mutationFn: (data: ProjectInput) =>
			poster<ProjectInput, Project>(BASE, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
		// onSuccess: (response) => {
		// 	queryClient.setQueryData([TEAMKEY], (old: FullData) => {
		// 		return { users: old.users, projects: [...old.projects, response] };
		// 	});
		// },
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
		// onSuccess: (resp, vars) => {
		// 	queryClient.setQueryData([TEAMKEY], (old: FullData) => {
		// 		return {
		// 			...old,
		// 			projects: old.projects.map((f) => (f.id === vars.id ? resp : f)),
		// 		};
		// 	});
		// },
	});
};

// delete project
export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleter(`${BASE}/${id}`),
		onSuccess: (_, id) => {
			// queryClient.setQueryData([TEAMKEY], (old: FullData) => ({
			// 	users: old.users,
			// 	projects: old.projects.filter((f) => f.id !== id),
			// }));
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });

			queryClient.removeQueries({ queryKey: [KEY, id] });
		},
	});
};
