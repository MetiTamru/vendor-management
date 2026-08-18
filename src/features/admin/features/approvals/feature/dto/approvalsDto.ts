import type { ApprovalRequestModel } from "@/features/shared/vms/types";

export type ApiApprovalsDto = ApprovalRequestModel;
export type ApprovalsCreateDto = Omit<ApprovalRequestModel, "id" | "requestedAt">;
export type ApprovalsUpdateDto = Pick<ApprovalRequestModel, "status">;
