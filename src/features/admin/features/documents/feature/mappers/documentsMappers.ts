import type { DocumentModel } from "@/features/shared/vms/types";

import type { ApiDocumentsDto } from "../dto/documentsDto";

/** VMS records already use the frontend model shape. */
export function toDocumentsModel(dto: ApiDocumentsDto): DocumentModel {
	return dto;
}
