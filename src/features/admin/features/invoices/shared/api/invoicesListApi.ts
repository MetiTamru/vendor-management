import { apiClient } from "@/lib/api/client";

import { invoicesEndpoints } from "../../invoices-endpoints";
import type { ApiInvoicesRecordDto } from "../dto/invoicesRecordDto";

export { invoicesEndpoints };

export type InvoicesListResponse = {
	results?: ApiInvoicesRecordDto[] | null;
	count?: number | null;
};

export async function listInvoicesRecords(params?: Record<string, string>) {
	return apiClient<InvoicesListResponse>(invoicesEndpoints.list(), { params });
}

export async function getInvoicesRecord(id: string) {
	return apiClient<ApiInvoicesRecordDto>(invoicesEndpoints.detail(id));
}
