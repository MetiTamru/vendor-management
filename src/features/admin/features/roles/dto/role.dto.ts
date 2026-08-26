export type ApiRoleDto = {
	id?: string | number | null;
	name?: string | null;
	display_name?: string | null;
	description?: string | null;
	permissions?: string[] | null;
	is_system_role?: boolean | null;
};

export type ApiRoleListResponseDto = {
	results?: ApiRoleDto[] | null;
	count?: number | null;
};
