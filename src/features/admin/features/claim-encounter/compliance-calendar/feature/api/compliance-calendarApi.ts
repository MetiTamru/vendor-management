/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";

export async function listObligations() {
	return withMockOrRemote(
		() => mock.COMPLIANCE_OBLIGATIONS,
		async () => []
	);
}

export async function listUpcomingDeadlines() {
	return withMockOrRemote(
		() => mock.COMPLIANCE_UPCOMING_DEADLINES,
		async () => []
	);
}

export async function getObligationDetail(
	...args: Parameters<typeof mock.getObligationDetail>
) {
	return withMockOrRemote(
		() => mock.getObligationDetail(...args),
		async () =>
			undefined as unknown as Awaited<
				ReturnType<typeof mock.getObligationDetail>
			>
	);
}
