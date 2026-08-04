import type { ApiContractsRecordDto } from "../dto/contractsRecordDto";
import type { ContractsModel } from "../../feature/types/contractsModel";

export function toContractsModel(
	row: ApiContractsRecordDto,
	index = 0
): ContractsModel {
	const id = row.id != null ? String(row.id) : `contracts-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
