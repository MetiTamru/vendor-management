import type { ApiSlaMonitoringRecordDto } from "../dto/slaMonitoringRecordDto";
import type { SlaMonitoringModel } from "../../feature/types/slaMonitoringModel";

export function toSlaMonitoringModel(
	row: ApiSlaMonitoringRecordDto,
	index = 0
): SlaMonitoringModel {
	const id = row.id != null ? String(row.id) : `sla-monitoring-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
