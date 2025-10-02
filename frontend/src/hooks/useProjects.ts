// ==== QUERIES ====
// =======================

import type { Project, ProjectInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleter, fetcher, poster, putter } from "src/lib/api";

const KEY = "projects";
const BASE = "/projects";

// fetch all projects (no content)
export const useProjects = () => {
	return useQuery({
		queryKey: [KEY],
		queryFn: () => fetcher<Project[]>(BASE),
	});
};

// fetch ONE project with folders and notes
export const useProject = (id: string) => {
	return useQuery({
		queryKey: [KEY, id],
		queryFn: () => fetcher<ProjectWithAll>(`${BASE}/${id}`),
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
		onSuccess: (response) => {
			queryClient.setQueryData([KEY], (old: Project[]) => {
				return [...old, response];
			});
		},
	});
};

// update existing project
export const useUpdateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ProjectInput }) =>
			putter<ProjectInput, Project>(`${BASE}/${id}`, data),
		onSuccess: (resp, vars) => {
			queryClient.setQueryData([KEY, resp.id], (old: ProjectWithAll) => {
				return {
					...old,
					...vars.data,
				};
			});

			queryClient.setQueryData([KEY], (old: Project[]) => {
				return old.map((f) => (f.id === vars.id ? resp : f));
			});
		},
	});
};

// delete project
export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleter(`${BASE}/${id}`),
		onSuccess: (_, id) => {
			queryClient.setQueryData([KEY], (old: Project[]) =>
				old.filter((f) => f.id !== id)
			);

			queryClient.removeQueries({ queryKey: [KEY, id] });
		},
	});
};
