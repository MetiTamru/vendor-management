import { apiClient } from "@/lib/api/client";
import { isMockEnabled, isNestApiEnabled } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { AppSettingDto } from "@/lib/vendor-core/types";

import type {
	ApiSettingDto,
	ApiSettingListResponseDto,
} from "../../dto/setting.dto";
import type { AppSettingModel } from "../../types/setting.types";
import { toSettingModelList } from "../mappers/setting.mapper";
import { settingEndpoints } from "./setting.endpoints";
import { MOCK_SETTINGS } from "./setting.mock";

function coreDtoToApiDto(dto: AppSettingDto): ApiSettingDto {
	return {
		id: dto.id,
		key: dto.key,
		value: dto.value,
		value_type: dto.value_type,
		category: dto.category,
		description: dto.description,
		is_secret: dto.is_secret,
	};
}

async function fetchNestList(): Promise<ApiSettingDto[]> {
	const res = await apiClient<ApiSettingListResponseDto | ApiSettingDto[]>(
		settingEndpoints.list()
	);
	return Array.isArray(res) ? res : (res.results ?? []);
}

async function fetchRemoteList(): Promise<ApiSettingDto[]> {
	if (isNestApiEnabled()) {
		return fetchNestList();
	}
	const page = await vendorCoreApi.listAllAppSettings();
	return (page.results ?? []).map(coreDtoToApiDto);
}

export const settingApi = {
	async list(): Promise<AppSettingModel[]> {
		const dtos = isMockEnabled() ? MOCK_SETTINGS : await fetchRemoteList();
		return toSettingModelList(dtos);
	},
};
