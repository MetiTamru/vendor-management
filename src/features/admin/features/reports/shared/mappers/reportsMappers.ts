import type { ApiReportsRecordDto } from "../dto/reportsRecordDto";
import type { ReportsModel } from "../../feature/types/reportsModel";

export function toReportsModel(
	row: ApiReportsRecordDto,
	index = 0
): ReportsModel {
	const id = row.id != null ? String(row.id) : `reports-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
