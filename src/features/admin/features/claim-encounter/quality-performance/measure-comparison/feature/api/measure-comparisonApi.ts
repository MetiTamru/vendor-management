/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";
import * as mock from "../../mock-data";

export async function listMeasures() {
	return withMockOrRemote(() => mock.MCR_MEASURES, async () => []);
}

export async function listReadinessRows() {
	return withMockOrRemote(() => mock.MCR_READINESS_ROWS, async () => []);
}

export async function getKpis() {
	return withMockOrRemote(
		() => mock.MCR_KPIS,
		async () => mock.MCR_KPIS
	);
}
