import type { InvoiceModel } from "@/features/shared/vms/types";

export type ApiInvoicesDto = InvoiceModel;
export type InvoicesCreateDto = Omit<InvoiceModel, "id" | "updatedAt">;
export type InvoicesUpdateDto = Partial<InvoiceModel>;
