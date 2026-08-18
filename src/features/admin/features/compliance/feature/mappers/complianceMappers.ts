import type { CertificateModel } from "@/features/shared/vms/types";

import type { ApiComplianceDto } from "../dto/complianceDto";

/** VMS records already use the frontend model shape. */
export function toComplianceModel(dto: ApiComplianceDto): CertificateModel {
	return dto;
}
