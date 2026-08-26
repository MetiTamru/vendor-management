export type AppSettingModel = {
	id: string;
	key: string;
	value: string;
	category: string;
	valueType: string;
	isSecret: boolean;
	description: string | null;
};
