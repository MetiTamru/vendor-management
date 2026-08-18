/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";
import * as mock from "../../mock-data";

export async function listOpenGapsByMeasure() {
	return withMockOrRemote(() => mock.QUALITY_OPEN_GAPS_BY_MEASURE, async () => []);
}

export async function listGapClosureActivity() {
	return withMockOrRemote(() => mock.QUALITY_GAP_CLOSURE_ACTIVITY, async () => []);
}

export async function getKpis() {
	return withMockOrRemote(
		() => mock.QUALITY_PERFORMANCE_KPIS,
		async () => mock.QUALITY_PERFORMANCE_KPIS
	);
}
