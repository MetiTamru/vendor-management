import type { ApiProcessingLogsRecordDto } from "../dto/processingLogsRecordDto";
import type { ProcessingLogsModel } from "../../feature/types/processingLogsModel";

export function toProcessingLogsModel(
	row: ApiProcessingLogsRecordDto,
	index = 0
): ProcessingLogsModel {
	const id = row.id != null ? String(row.id) : `processing-logs-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
