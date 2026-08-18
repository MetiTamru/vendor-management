import type { InvoiceModel } from "@/features/shared/vms/types";

import type { ApiInvoicesDto } from "../dto/invoicesDto";

/** VMS records already use the frontend model shape. */
export function toInvoicesModel(dto: ApiInvoicesDto): InvoiceModel {
	return dto;
}
