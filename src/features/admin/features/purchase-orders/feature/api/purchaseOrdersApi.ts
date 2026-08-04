import { apiClient } from "@/lib/api/client";

import { purchaseOrdersEndpoints } from "../../purchase-orders-endpoints";
import type {
	ApiPurchaseOrdersDto,
	PurchaseOrdersCreateDto,
	PurchaseOrdersUpdateDto,
} from "../dto/purchaseOrdersDto";

export async function listPurchaseOrders() {
	return apiClient<{ results?: ApiPurchaseOrdersDto[]; count?: number }>(
		purchaseOrdersEndpoints.list()
	);
}

export async function getPurchaseOrders(id: string) {
	return apiClient<ApiPurchaseOrdersDto>(purchaseOrdersEndpoints.detail(id));
}

export async function createPurchaseOrders(body: PurchaseOrdersCreateDto) {
	return apiClient<ApiPurchaseOrdersDto>(purchaseOrdersEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updatePurchaseOrders(
	id: string,
	body: PurchaseOrdersUpdateDto
) {
	return apiClient<ApiPurchaseOrdersDto>(purchaseOrdersEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deletePurchaseOrders(id: string) {
	return apiClient<void>(purchaseOrdersEndpoints.delete(id), {
		method: "DELETE",
	});
}
