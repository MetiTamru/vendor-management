import { withMockOrRemote } from "@/lib/mock-mode";

import {
	FILE_RUNS,
	displayRunStatus,
} from "../../../file-management/mock-data";

export { displayRunStatus };

export async function listActivityFileRuns() {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}
