import { vmsApi } from "@/features/shared/vms/api";
import type { PurchaseOrderModel } from "@/features/shared/vms/types";

import type {
	PurchaseOrdersCreateDto,
	PurchaseOrdersUpdateDto,
} from "../dto/purchaseOrdersDto";

function requireRecord<T>(record: T | null): T {
	if (!record) throw new Error("VMS record was not found");
	return record;
}

export async function listPurchaseOrders(): Promise<PurchaseOrderModel[]> {
	return vmsApi.listPurchaseOrders();
}

export async function getPurchaseOrders(
	id: string
): Promise<PurchaseOrderModel> {
	return requireRecord(await vmsApi.getPurchaseOrder(id));
}

export async function createPurchaseOrders(
	input: PurchaseOrdersCreateDto
): Promise<PurchaseOrderModel> {
	return vmsApi.createPurchaseOrder(input);
}

export async function updatePurchaseOrders(
	id: string,
	patch: PurchaseOrdersUpdateDto
): Promise<PurchaseOrderModel> {
	return requireRecord(await vmsApi.updatePurchaseOrder(id, patch));
}
