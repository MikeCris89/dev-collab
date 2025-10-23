import { deleter, fetcher, poster, putter } from "@/lib/api";
import type { Folder, FolderInput, ProjectWithAll } from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROJECTKEY } from "./useProjects";

const BASE = "/folders";

// get one folder from the useProject cache
export const useFolder = ({
	projectId,
	folderId,
}: {
	projectId: string | null | undefined;
	folderId: string | null | undefined;
}) => {
	return useQuery({
		queryKey: [PROJECTKEY, projectId],
		queryFn: () => fetcher<ProjectWithAll>(`/projects/${projectId}`),
		select: (data) => data?.folders.find((f) => f.id === folderId),
		enabled: !!projectId && !!folderId,
	});
};

export const useCreateFolder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			data,
			projectId,
		}: {
			data: FolderInput;
			projectId: string;
		}) => poster<FolderInput, Folder>(`${BASE}/${projectId}/folders`, data),
		onSuccess: (resp) => {
			queryClient.setQueryData([PROJECTKEY], (old: ProjectWithAll) => ({
				...old,
				folders: [...(old.folders ?? []), resp],
			}));
		},
	});
};

export const useEditFolder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			folderId,
			data,
			projectId,
		}: {
			folderId: string;
			data: FolderInput;
			projectId: string;
		}) => putter<FolderInput, Folder>(`${BASE}/${projectId}/${folderId}`, data),
		onSuccess: (resp) => {
			queryClient.setQueryData([PROJECTKEY], (old: ProjectWithAll) => ({
				...old,
				folders: old.folders.map((f) => (f.id === resp.id ? resp : f)),
			}));
		},
	});
};
export const useDeleteFolder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
			deleter(`${BASE}/${projectId}/${id}`),
		onSuccess: (_, { id }) => {
			queryClient.setQueryData([PROJECTKEY], (old: ProjectWithAll) => ({
				...old,
				folders: old.folders.filter((f) => f.id !== id),
			}));
		},
	});
};
