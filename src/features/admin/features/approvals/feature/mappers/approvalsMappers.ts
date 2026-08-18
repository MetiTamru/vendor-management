import type { ApprovalRequestModel } from "@/features/shared/vms/types";

import type { ApiApprovalsDto } from "../dto/approvalsDto";

/** VMS records already use the frontend model shape. */
export function toApprovalsModel(dto: ApiApprovalsDto): ApprovalRequestModel {
	return dto;
}
