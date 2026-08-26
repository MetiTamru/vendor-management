import type { ApiSettingDto } from "../../dto/setting.dto";
import type { AppSettingModel } from "../../types/setting.types";

export function toSettingModel(dto: ApiSettingDto): AppSettingModel | null {
	const id = dto.id != null ? String(dto.id) : null;
	const key = dto.key?.trim();
	const value = dto.value != null ? String(dto.value) : "";
	const category = dto.category?.trim() ?? "general";
	if (!id || !key) return null;

	return {
		id,
		key,
		value,
		category,
		valueType:
			typeof dto.value_type === "string" && dto.value_type.trim()
				? dto.value_type
				: "string",
		isSecret: dto.is_secret === true,
		description: typeof dto.description === "string" ? dto.description : null,
	};
}

export function toSettingModelList(dtos: ApiSettingDto[]): AppSettingModel[] {
	return dtos
		.map((dto) => toSettingModel(dto))
		.filter((model): model is AppSettingModel => model !== null);
}
