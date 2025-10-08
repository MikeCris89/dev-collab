import { deleter, fetcher, poster, putter } from "@/lib/api";
import type {
	EditUser,
	ProjectWithUsers,
	SignupRequest,
	TeamMember,
	UserWithProjects,
} from "@shared/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TEAMKEY = "team";
const BASE = "/team";

export type TeamFull = {
	users: UserWithProjects[];
	projects: ProjectWithUsers[];
};

// ==== QUERIES ====
// =======================

export const useTeam = () => {
	return useQuery({
		queryKey: [TEAMKEY],
		queryFn: () => fetcher<TeamFull>(BASE),
	});
};

// fetch all team members - useTeam cache
export const useTeamMembers = () => {
	return useQuery({
		queryKey: [TEAMKEY],
		queryFn: () => fetcher<TeamFull>(BASE),
		select: (data) => data?.users || [],
	});
};

// ==== MUTATIONS ====
// =======================

export const useCreateTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: SignupRequest) =>
			poster<SignupRequest, TeamMember>(BASE, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
		// onSuccess: (resp, data) => {
		// 	queryClient.setQueryData([KEY], (old: TeamWithAll) => {
		// 		return {
		// 			users: [...old.users, resp],
		// 			projects: data.projectIds
		// 				? old.projects.map((p) =>
		// 						data.projectIds?.includes(p.id)
		// 							? { ...p, projectsUsers: [...p.projectsUsers, resp.id] }
		// 							: p
		// 				  )
		// 				: old.projects,
		// 		};
		// 	});
		// },
	});
};

export const useEditTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: EditUser }) =>
			putter<EditUser, TeamMember>(`${BASE}/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
		// onSuccess: (resp, vars) => {
		// 	queryClient.setQueryData([KEY], (old: TeamWithAll) => {
		// 		return {
		// 			...old,
		// 			users: old.users.map((u) => (u.id === vars.id ? resp : u)),
		// 		};
		// 	});
		// },
	});
};

export const useDeleteTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleter(`${BASE}/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
	});
};
