import { apiClient } from "@/lib/api/client";

import { purchaseOrdersEndpoints } from "../../purchase-orders-endpoints";
import type { ApiPurchaseOrdersRecordDto } from "../dto/purchaseOrdersRecordDto";

export { purchaseOrdersEndpoints };

export type PurchaseOrdersListResponse = {
	results?: ApiPurchaseOrdersRecordDto[] | null;
	count?: number | null;
};

export async function listPurchaseOrdersRecords(params?: Record<string, string>) {
	return apiClient<PurchaseOrdersListResponse>(purchaseOrdersEndpoints.list(), { params });
}

export async function getPurchaseOrdersRecord(id: string) {
	return apiClient<ApiPurchaseOrdersRecordDto>(purchaseOrdersEndpoints.detail(id));
}
