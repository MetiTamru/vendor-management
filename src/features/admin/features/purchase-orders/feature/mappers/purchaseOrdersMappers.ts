export { toPurchaseOrdersModel } from "../../shared/mappers/purchaseOrdersMappers";

import type { PurchaseOrdersCreateDto, PurchaseOrdersUpdateDto } from "../dto/purchaseOrdersDto";
import type { PurchaseOrdersModel } from "../types/purchaseOrdersModel";

export function toPurchaseOrdersCreateDto(model: Pick<PurchaseOrdersModel, "name">): PurchaseOrdersCreateDto {
	return { name: model.name };
}

export function toPurchaseOrdersUpdateDto(
	model: Partial<Pick<PurchaseOrdersModel, "name">>
): PurchaseOrdersUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
