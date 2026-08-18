import type { CertificateModel } from "@/features/shared/vms/types";

export type ComplianceModel = CertificateModel;

export type ComplianceListResult = {
	items: CertificateModel[];
	total: number;
};
