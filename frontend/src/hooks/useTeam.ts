import { deleter, fetcher, poster, putter } from "@/lib/api";
import type {
	EditUser,
	PasswordChangeDTO,
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

// fetch all users and projects from team
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

// select one team member from useTeam cache
export const useTeamMember = (memberId: string | null) => {
	return useQuery({
		queryKey: [TEAMKEY],
		queryFn: () => fetcher<TeamFull>(BASE),
		select: (data) => data?.users.find((u) => u.id === memberId) || null,
		enabled: !!memberId,
	});
};

// fetch all projects (no content) - useTeam cache
export const useTeamProjects = () => {
	return useQuery({
		queryKey: [TEAMKEY],
		queryFn: () => fetcher<TeamFull>(BASE),
		select: (data) => data?.projects || [],
	});
};

// fetch one project (no content) - useTeam cache
export const useTeamProject = (projectId: string | null) => {
	return useQuery({
		queryKey: [TEAMKEY],
		queryFn: () => fetcher<TeamFull>(BASE),
		select: (data) => data?.projects.find((p) => p.id === projectId),
		enabled: !!projectId,
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

export const usePasswordChange = () => {
	return useMutation({
		mutationFn: (data: PasswordChangeDTO) =>
			putter<PasswordChangeDTO, void>(`${BASE}/password-change`, data),
	});
};

export const useDeleteTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleter(`${BASE}/user/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
	});
};
export const useDeleteTeam = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleter(`${BASE}/`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TEAMKEY] });
		},
	});
};
