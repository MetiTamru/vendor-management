import { FILE_RUNS } from "../../../file-management/mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

export async function listNotificationFileRuns() {
	return withMockOrRemote(() => FILE_RUNS, async () => [], []);
}
