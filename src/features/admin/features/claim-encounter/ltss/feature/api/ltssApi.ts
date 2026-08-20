/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";

export async function listAuthorizations() {
	return withMockOrRemote(
		() => mock.LTSS_AUTHORIZATIONS,
		async () => []
	);
}

export async function listUtilization() {
	return withMockOrRemote(
		() => mock.LTSS_UTILIZATION,
		async () => []
	);
}

export async function listVendors() {
	return withMockOrRemote(
		() => mock.LTSS_VENDORS,
		async () => []
	);
}

export async function listExceptions() {
	return withMockOrRemote(
		() => mock.LTSS_EXCEPTIONS,
		async () => []
	);
}

export async function listSubmissions() {
	return withMockOrRemote(
		() => mock.LTSS_SUBMISSIONS,
		async () => []
	);
}

export async function getKpis() {
	return withMockOrRemote(
		() => mock.LTSS_KPI,
		async () => mock.LTSS_KPI
	);
}
