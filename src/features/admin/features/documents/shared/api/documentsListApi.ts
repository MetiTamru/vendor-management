import { apiClient } from "@/lib/api/client";

import { documentsEndpoints } from "../../documents-endpoints";
import type { ApiDocumentsRecordDto } from "../dto/documentsRecordDto";

export { documentsEndpoints };

export type DocumentsListResponse = {
	results?: ApiDocumentsRecordDto[] | null;
	count?: number | null;
};

export async function listDocumentsRecords(params?: Record<string, string>) {
	return apiClient<DocumentsListResponse>(documentsEndpoints.list(), {
		params,
	});
}

export async function getDocumentsRecord(id: string) {
	return apiClient<ApiDocumentsRecordDto>(documentsEndpoints.detail(id));
}
