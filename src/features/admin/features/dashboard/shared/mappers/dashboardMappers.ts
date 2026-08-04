import type { ApiDashboardRecordDto } from "../dto/dashboardRecordDto";
import type { DashboardModel } from "../../feature/types/dashboardModel";

export function toDashboardModel(
	row: ApiDashboardRecordDto,
	index = 0
): DashboardModel {
	const id = row.id != null ? String(row.id) : `dashboard-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
