/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../fixtures";

export async function loadEdiFixture(
	...args: Parameters<typeof mock.loadEdiFixture>
) {
	return withMockOrRemote(
		() => mock.loadEdiFixture(...args),
		async () => ""
	);
}

export async function loadEdiByPath(
	...args: Parameters<typeof mock.loadEdiByPath>
) {
	return withMockOrRemote(
		() => mock.loadEdiByPath(...args),
		async () => ""
	);
}
