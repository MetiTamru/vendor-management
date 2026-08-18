/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";
import * as mock from "../../mock-data";

export async function listAuditRequests() {
	return withMockOrRemote(() => mock.CMS_EDGE_AUDIT_REQUESTS, async () => []);
}

export async function listAuditReports() {
	return withMockOrRemote(() => mock.CMS_EDGE_AUDIT_REPORTS, async () => []);
}

export async function listSubmissionHistory() {
	return withMockOrRemote(() => mock.CMS_EDGE_SUBMISSION_HISTORY, async () => []);
}

export async function listCmsResponses() {
	return withMockOrRemote(() => mock.CMS_EDGE_RESPONSES_LIST, async () => []);
}

export async function listDocumentLibrary() {
	return withMockOrRemote(() => mock.CMS_EDGE_DOCUMENT_LIBRARY, async () => []);
}
