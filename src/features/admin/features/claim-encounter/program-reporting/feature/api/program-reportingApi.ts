/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";

export async function getOverviewData(
	...args: Parameters<typeof mock.getOverviewData>
) {
	return withMockOrRemote(
		() => mock.getOverviewData(...args),
		async () =>
			undefined as unknown as Awaited<ReturnType<typeof mock.getOverviewData>>
	);
}

export async function getAuditData(
	...args: Parameters<typeof mock.getAuditData>
) {
	return withMockOrRemote(
		() => mock.getAuditData(...args),
		async () =>
			undefined as unknown as Awaited<ReturnType<typeof mock.getAuditData>>
	);
}

export async function getProgramScale(
	...args: Parameters<typeof mock.getProgramScale>
) {
	return withMockOrRemote(
		() => mock.getProgramScale(...args),
		async () =>
			undefined as unknown as Awaited<ReturnType<typeof mock.getProgramScale>>
	);
}

export async function getSubmissionsData(
	...args: Parameters<typeof mock.getSubmissionsData>
) {
	return withMockOrRemote(
		() => mock.getSubmissionsData(...args),
		async () =>
			undefined as unknown as Awaited<
				ReturnType<typeof mock.getSubmissionsData>
			>
	);
}
