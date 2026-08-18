/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import {
	COMPLIANCE_PROGRAM_PAGES,
	getComplianceProgramPage,
} from "../../config";
import type { ApiComplianceProgramPageDto } from "../dto/complianceProgramDto";

export async function getComplianceProgramPageConfig(
	slug: string
): Promise<ApiComplianceProgramPageDto | null> {
	return withMockOrRemote(
		() => getComplianceProgramPage(slug) ?? null,
		async () => null
	);
}

export async function listComplianceProgramPageConfigs(): Promise<
	ApiComplianceProgramPageDto[]
> {
	return withMockOrRemote(
		() => COMPLIANCE_PROGRAM_PAGES,
		async () => []
	);
}
