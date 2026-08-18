import { FILE_RUNS, displayRunStatus } from "../../../file-management/mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

export { displayRunStatus };

export async function listActivityFileRuns() {
	return withMockOrRemote(() => FILE_RUNS, async () => [], []);
}
