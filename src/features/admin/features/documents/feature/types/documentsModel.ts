import type { DocumentModel } from "@/features/shared/vms/types";

export type DocumentsModel = DocumentModel;

export type DocumentsListResult = {
	items: DocumentModel[];
	total: number;
};
