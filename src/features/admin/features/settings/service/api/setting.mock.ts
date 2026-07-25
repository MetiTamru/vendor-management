import type { ApiSettingDto } from "../../dto/setting.dto";

export const MOCK_SETTINGS: ApiSettingDto[] = [
	{
		id: "set-1",
		key: "app.name",
		value: "Next.js Starter",
		category: "general",
	},
	{
		id: "set-2",
		key: "auth.session_ttl",
		value: "604800",
		category: "auth",
	},
	{
		id: "set-3",
		key: "groups.max_members",
		value: "500",
		category: "groups",
	},
];
