import type { PurchaseOrderModel } from "@/features/shared/vms/types";

export type ApiPurchaseOrdersDto = PurchaseOrderModel;
export type PurchaseOrdersCreateDto = Omit<
	PurchaseOrderModel,
	"id" | "updatedAt" | "acknowledgedAt"
>;
export type PurchaseOrdersUpdateDto = Partial<PurchaseOrderModel>;
