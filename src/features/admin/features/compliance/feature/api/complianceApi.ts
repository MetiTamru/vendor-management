import { vmsApi } from "@/features/shared/vms/api";
import type { CertificateModel } from "@/features/shared/vms/types";

export async function listCompliance(): Promise<CertificateModel[]> {
	return vmsApi.listCertificates();
}
