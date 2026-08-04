import { apiClient } from "@/lib/api/client";

import { invoicesEndpoints } from "../../invoices-endpoints";
import type {
	ApiInvoicesDto,
	InvoicesCreateDto,
	InvoicesUpdateDto,
} from "../dto/invoicesDto";

export async function listInvoices() {
	return apiClient<{ results?: ApiInvoicesDto[]; count?: number }>(
		invoicesEndpoints.list()
	);
}

export async function getInvoices(id: string) {
	return apiClient<ApiInvoicesDto>(invoicesEndpoints.detail(id));
}

export async function createInvoices(body: InvoicesCreateDto) {
	return apiClient<ApiInvoicesDto>(invoicesEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateInvoices(id: string, body: InvoicesUpdateDto) {
	return apiClient<ApiInvoicesDto>(invoicesEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteInvoices(id: string) {
	return apiClient<void>(invoicesEndpoints.delete(id), {
		method: "DELETE",
	});
}
