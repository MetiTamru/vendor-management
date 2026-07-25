import type { ApiSettingDto } from "../../dto/setting.dto";
import type { AppSettingModel } from "../../types/setting.types";

export function toSettingModel(dto: ApiSettingDto): AppSettingModel | null {
	const id = dto.id != null ? String(dto.id) : null;
	const key = dto.key?.trim();
	const value = dto.value != null ? String(dto.value) : "";
	const category = dto.category?.trim() ?? "general";
	if (!id || !key) return null;

	return { id, key, value, category };
}

export function toSettingModelList(dtos: ApiSettingDto[]): AppSettingModel[] {
	return dtos
		.map((dto) => toSettingModel(dto))
		.filter((model): model is AppSettingModel => model !== null);
}
