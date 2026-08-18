"use client";

import { useSettingsList } from "../../service/queries/setting.query";

export { useSettingsList };

export function useSettingsQuery() {
	const { settings, isInitialLoading, error, refetch } = useSettingsList();
	return {
		data: { items: settings, total: settings.length },
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
	};
}

export function useSettingsDetailQuery(id: string | null | undefined) {
	const { settings, isInitialLoading, error, refetch } = useSettingsList();
	const setting = id ? settings.find((item) => item.id === id) : undefined;
	return {
		data: setting,
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
		enabled: Boolean(id),
	};
}
