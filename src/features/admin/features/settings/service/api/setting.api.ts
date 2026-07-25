import { apiClient } from "@/lib/api/client";

import type {
	ApiSettingDto,
	ApiSettingListResponseDto,
} from "../../dto/setting.dto";
import type { AppSettingModel } from "../../types/setting.types";
import { toSettingModelList } from "../mappers/setting.mapper";
import { settingEndpoints } from "./setting.endpoints";
import { MOCK_SETTINGS } from "./setting.mock";

function isMockDataEnabled(): boolean {
	return process.env.NEXT_PUBLIC_USE_MOCK_SETTINGS === "true";
}

async function withMockFallback<T>(
	remote: () => Promise<T>,
	fallback: () => T
): Promise<T> {
	if (isMockDataEnabled()) return fallback();
	return remote();
}

export const settingApi = {
	async list(): Promise<AppSettingModel[]> {
		const dtos = await withMockFallback(
			() =>
				apiClient<ApiSettingListResponseDto | ApiSettingDto[]>(
					settingEndpoints.list()
				).then((res) => (Array.isArray(res) ? res : (res.results ?? []))),
			() => MOCK_SETTINGS
		);
		return toSettingModelList(dtos);
	},
};
