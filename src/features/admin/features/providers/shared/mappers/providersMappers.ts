import type { ApiProvidersRecordDto } from "../dto/providersRecordDto";
import type { ProvidersModel } from "../../feature/types/providersModel";

export function toProvidersModel(
	row: ApiProvidersRecordDto,
	index = 0
): ProvidersModel {
	const id = row.id != null ? String(row.id) : `providers-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
