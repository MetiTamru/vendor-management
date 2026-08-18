import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { AuditRecordDto } from "@/lib/vendor-core/types";

export async function listAuditRecords(): Promise<AuditRecordDto[]> {
	const page = await vendorCoreApi.listAudit();
	return page.results ?? [];
}
