export type ApiUserDto = {
	id?: string | number | null;
	email?: string | null;
	name?: string | null;
	roles?: string[] | null;
	is_active?: boolean | null;
};

export type ApiUserListResponseDto = {
	results?: ApiUserDto[] | null;
	count?: number | null;
};
