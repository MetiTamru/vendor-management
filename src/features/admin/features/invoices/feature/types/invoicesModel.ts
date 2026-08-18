import type { InvoiceModel } from "@/features/shared/vms/types";

export type InvoicesModel = InvoiceModel;

export type InvoicesListResult = {
	items: InvoiceModel[];
	total: number;
};
