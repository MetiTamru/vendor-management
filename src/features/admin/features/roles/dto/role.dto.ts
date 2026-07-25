export type ApiRoleDto = {
	id?: string | number | null;
	name?: string | null;
	permissions?: string[] | null;
};

export type ApiRoleListResponseDto = {
	results?: ApiRoleDto[] | null;
	count?: number | null;
};
