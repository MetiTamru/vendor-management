import type { PurchaseOrderModel } from "@/features/shared/vms/types";

import type { ApiPurchaseOrdersDto } from "../dto/purchaseOrdersDto";

/** VMS records already use the frontend model shape. */
export function toPurchaseOrdersModel(
	dto: ApiPurchaseOrdersDto
): PurchaseOrderModel {
	return dto;
}
