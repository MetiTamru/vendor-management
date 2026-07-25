export type ApiSettingDto = {
	id?: string | number | null;
	key?: string | null;
	value?: string | null;
	category?: string | null;
};

export type ApiSettingListResponseDto = {
	results?: ApiSettingDto[] | null;
	count?: number | null;
};
