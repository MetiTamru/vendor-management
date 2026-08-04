import { apiClient } from "@/lib/api/client";

import { settingsEndpoints } from "../../settings-endpoints";
import type {
	ApiSettingsDto,
	SettingsCreateDto,
	SettingsUpdateDto,
} from "../dto/settingsDto";

export async function listSettings() {
	return apiClient<{ results?: ApiSettingsDto[]; count?: number }>(
		settingsEndpoints.list()
	);
}

export async function getSettings(id: string) {
	return apiClient<ApiSettingsDto>(settingsEndpoints.detail(id));
}

export async function createSettings(body: SettingsCreateDto) {
	return apiClient<ApiSettingsDto>(settingsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateSettings(id: string, body: SettingsUpdateDto) {
	return apiClient<ApiSettingsDto>(settingsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteSettings(id: string) {
	return apiClient<void>(settingsEndpoints.delete(id), {
		method: "DELETE",
	});
}
