import { withMockOrRemote } from "@/lib/mock-mode";

import { REPORT_TABS, getReportTabLayout } from "../../mock-data";

export { REPORT_TABS, getReportTabLayout };
export type { ReportTabId } from "../../mock-data";

export async function listReportTabs() {
	return withMockOrRemote(
		() => REPORT_TABS,
		async () => [],
		[]
	);
}
