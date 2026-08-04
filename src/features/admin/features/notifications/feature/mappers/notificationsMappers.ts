export { toNotificationsModel } from "../../shared/mappers/notificationsMappers";

import type { NotificationsCreateDto, NotificationsUpdateDto } from "../dto/notificationsDto";
import type { NotificationsModel } from "../types/notificationsModel";

export function toNotificationsCreateDto(model: Pick<NotificationsModel, "name">): NotificationsCreateDto {
	return { name: model.name };
}

export function toNotificationsUpdateDto(
	model: Partial<Pick<NotificationsModel, "name">>
): NotificationsUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
