import { withMockOrRemote } from "@/lib/mock-mode";

import { FILE_RUNS } from "../../../file-management/mock-data";

export async function listNotificationFileRuns() {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}
