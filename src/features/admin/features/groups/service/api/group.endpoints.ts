export const groupEndpoints = {
	list: () => "/api/admin/identity-groups/",
	detail: (id: string) => `/api/admin/identity-groups/${id}/`,
	create: () => "/api/admin/identity-groups/",
	update: (id: string) => `/api/admin/identity-groups/${id}/`,
	delete: (id: string) => `/api/admin/identity-groups/${id}/`,
} as const;
