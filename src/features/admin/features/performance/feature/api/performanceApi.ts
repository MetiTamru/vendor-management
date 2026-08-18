import { vmsApi } from "@/features/shared/vms/api";
import type { ScorecardModel } from "@/features/shared/vms/types";

function requireRecord<T>(record: T | null | undefined): T {
	if (!record) throw new Error("VMS record was not found");
	return record;
}

export async function listPerformance(): Promise<ScorecardModel[]> {
	return vmsApi.listScorecards();
}

export async function getPerformance(id: string): Promise<ScorecardModel> {
	const items = await listPerformance();
	return requireRecord(items.find((item) => item.id === id));
}
