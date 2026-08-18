import type { ApprovalRequestModel } from "@/features/shared/vms/types";

export type ApprovalsModel = ApprovalRequestModel;

export type ApprovalsListResult = {
	items: ApprovalRequestModel[];
	total: number;
};
