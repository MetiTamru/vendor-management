import type { ApiNotificationsRecordDto } from "../dto/notificationsRecordDto";
import type { NotificationsModel } from "../../feature/types/notificationsModel";

export function toNotificationsModel(
	row: ApiNotificationsRecordDto,
	index = 0
): NotificationsModel {
	const id = row.id != null ? String(row.id) : `notifications-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
