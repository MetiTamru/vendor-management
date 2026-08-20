/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";
import * as regulatoryMock from "../../regulatory-quality-mock";
import * as riskMock from "../../risk-exceptions-mock";

export async function listDomains() {
	return withMockOrRemote(
		() => mock.EXECUTIVE_DOMAINS,
		async () => []
	);
}

export async function listAlerts() {
	return withMockOrRemote(
		() => mock.EXECUTIVE_ALERTS,
		async () => []
	);
}

export async function listRegulatoryQualityMeasures() {
	return withMockOrRemote(
		() => regulatoryMock.RQ_QUALITY_MEASURES,
		async () => []
	);
}

export async function listRiskExceptions() {
	return withMockOrRemote(
		() => riskMock.RE_TOP_EXCEPTIONS,
		async () => []
	);
}
