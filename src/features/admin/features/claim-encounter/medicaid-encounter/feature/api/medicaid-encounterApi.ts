/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";

export async function listDocumentLibrary() {
	return withMockOrRemote(
		() => mock.MEDICAID_DOCUMENT_LIBRARY,
		async () => []
	);
}

export async function listExceptionDetails() {
	return withMockOrRemote(
		() => mock.MEDICAID_EXCEPTION_DETAILS,
		async () => []
	);
}

export async function listResponseFiles() {
	return withMockOrRemote(
		() => mock.MEDICAID_RESPONSE_FILES,
		async () => []
	);
}
