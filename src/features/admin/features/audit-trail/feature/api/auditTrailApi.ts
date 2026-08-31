import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { AuditListQuery, AuditRecordDto } from "@/lib/vendor-core/types";

export async function listAuditRecords(
	params?: AuditListQuery
): Promise<AuditRecordDto[]> {
	const page = await vendorCoreApi.listAudit(params);
	return page.results ?? [];
}
