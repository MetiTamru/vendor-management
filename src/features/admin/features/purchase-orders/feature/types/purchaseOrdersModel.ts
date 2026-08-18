import type { PurchaseOrderModel } from "@/features/shared/vms/types";

export type PurchaseOrdersModel = PurchaseOrderModel;

export type PurchaseOrdersListResult = {
	items: PurchaseOrderModel[];
	total: number;
};
