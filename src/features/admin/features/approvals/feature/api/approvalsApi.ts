import { vmsApi } from "@/features/shared/vms/api";
import type { ApprovalRequestModel } from "@/features/shared/vms/types";

function requireRecord<T>(record: T | null | undefined): T {
	if (!record) throw new Error("VMS record was not found");
	return record;
}

export async function listApprovals(): Promise<ApprovalRequestModel[]> {
	return vmsApi.listApprovals();
}

export async function getApprovals(id: string): Promise<ApprovalRequestModel> {
	const items = await listApprovals();
	return requireRecord(items.find((item) => item.id === id));
}

export async function updateApprovals(
	id: string,
	status: ApprovalRequestModel["status"]
): Promise<ApprovalRequestModel> {
	return requireRecord(await vmsApi.updateApproval(id, status));
}
