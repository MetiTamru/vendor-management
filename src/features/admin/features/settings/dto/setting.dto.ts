export type ApiSettingDto = {
	id?: string | number | null;
	key?: string | null;
	value?: string | null;
	value_type?: string | null;
	category?: string | null;
	description?: string | null;
	is_secret?: boolean | null;
};

export type ApiSettingListResponseDto = {
	results?: ApiSettingDto[] | null;
	count?: number | null;
};
