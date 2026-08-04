import { apiClient } from "@/lib/api/client";

import { documentsEndpoints } from "../../documents-endpoints";
import type {
	ApiDocumentsDto,
	DocumentsCreateDto,
	DocumentsUpdateDto,
} from "../dto/documentsDto";

export async function listDocuments() {
	return apiClient<{ results?: ApiDocumentsDto[]; count?: number }>(
		documentsEndpoints.list()
	);
}

export async function getDocuments(id: string) {
	return apiClient<ApiDocumentsDto>(documentsEndpoints.detail(id));
}

export async function createDocuments(body: DocumentsCreateDto) {
	return apiClient<ApiDocumentsDto>(documentsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateDocuments(id: string, body: DocumentsUpdateDto) {
	return apiClient<ApiDocumentsDto>(documentsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteDocuments(id: string) {
	return apiClient<void>(documentsEndpoints.delete(id), {
		method: "DELETE",
	});
}
