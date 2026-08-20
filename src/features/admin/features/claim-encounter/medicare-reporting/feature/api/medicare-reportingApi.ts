/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";

export async function listPartDSubmissions() {
	return withMockOrRemote(
		() => mock.MEDICARE_PART_D_SUBMISSIONS,
		async () => []
	);
}

export async function getPartDKpis() {
	return withMockOrRemote(
		() => mock.MEDICARE_PART_D_KPIS,
		async () => mock.MEDICARE_PART_D_KPIS
	);
}
