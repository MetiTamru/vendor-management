import { REPORT_TABS, getReportTabLayout } from "../../mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

export { REPORT_TABS, getReportTabLayout };
export type { ReportTabId } from "../../mock-data";

export async function listReportTabs() {
	return withMockOrRemote(() => REPORT_TABS, async () => [], []);
}
