/** Raw API contracts — infrastructure layer only. */

export type ApiGroupMemberDto = {
	id?: string | null;
	external_id?: string | null;
	display_name?: string | null;
	role?: string | null;
};

export type ApiGroupCharacteristicDto = {
	id?: string | null;
	key?: string | null;
	operator?: string | null;
	value?: unknown;
};

export type ApiIdentityGroupDto = {
	id?: string | number | null;
	name?: string | null;
	description?: string | null;
	membership_mode?: string | null;
	members?: ApiGroupMemberDto[] | null;
	characteristics?: ApiGroupCharacteristicDto[] | null;
	period_start?: string | null;
	period_end?: string | null;
	is_active?: boolean | null;
	sync_status?: string | null;
	updated_at?: string | null;
};

export type ApiGroupListResponseDto = {
	results?: ApiIdentityGroupDto[] | null;
	count?: number | null;
};

export type GroupCreateDto = {
	name: string;
	description?: string | null;
	membership_mode: string;
	members?: ApiGroupMemberDto[];
	characteristics?: ApiGroupCharacteristicDto[];
	period_start?: string | null;
	period_end?: string | null;
};

export type GroupUpdateDto = Partial<GroupCreateDto>;
