/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";
import * as mock from "../../mock-data";

export async function rowsForComplianceProgramPage(...args: Parameters<typeof mock.rowsForComplianceProgramPage>) {
	return withMockOrRemote(
		() => mock.rowsForComplianceProgramPage(...args),
		async () => [] as Awaited<ReturnType<typeof mock.rowsForComplianceProgramPage>>
	);
}

export async function statsForRows(...args: Parameters<typeof mock.statsForRows>) {
	return withMockOrRemote(
		() => mock.statsForRows(...args),
		async () => [] as Awaited<ReturnType<typeof mock.statsForRows>>
	);
}
