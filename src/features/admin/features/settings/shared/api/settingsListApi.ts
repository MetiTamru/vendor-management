import { apiClient } from "@/lib/api/client";

import { settingsEndpoints } from "../../settings-endpoints";
import type { ApiSettingsRecordDto } from "../dto/settingsRecordDto";

export { settingsEndpoints };

export type SettingsListResponse = {
	results?: ApiSettingsRecordDto[] | null;
	count?: number | null;
};

export async function listSettingsRecords(params?: Record<string, string>) {
	return apiClient<SettingsListResponse>(settingsEndpoints.list(), { params });
}

export async function getSettingsRecord(id: string) {
	return apiClient<ApiSettingsRecordDto>(settingsEndpoints.detail(id));
}
