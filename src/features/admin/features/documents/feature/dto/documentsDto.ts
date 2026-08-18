import type { DocumentModel } from "@/features/shared/vms/types";

export type ApiDocumentsDto = DocumentModel;
export type DocumentsCreateDto = Omit<DocumentModel, "id" | "updatedAt">;
export type DocumentsUpdateDto = Partial<DocumentModel>;
