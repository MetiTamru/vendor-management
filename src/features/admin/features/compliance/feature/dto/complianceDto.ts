import type { CertificateModel } from "@/features/shared/vms/types";

export type ApiComplianceDto = CertificateModel;
export type ComplianceCreateDto = Omit<CertificateModel, "id" | "updatedAt">;
export type ComplianceUpdateDto = Partial<CertificateModel>;
