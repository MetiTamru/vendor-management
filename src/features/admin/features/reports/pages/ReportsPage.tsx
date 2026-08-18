"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import { ReportTabPanel } from "@/features/admin/features/reports/ReportTabPanel";
import { useReportTabsList } from "@/features/admin/features/reports/feature/queries/useReportsQuery";
import { cn } from "@/lib/utils";

const TAB_TRIGGER_CLASS = cn(
	"rounded-md px-3 py-1.5 text-[11px] font-semibold shadow-none transition-colors",
	"text-muted-foreground hover:text-primary",
	"data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
);

export function ReportsPage() {
	const { tabs } = useReportTabsList();

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Reports"
				description="Run enrollment, claim, error, and overlap reports across issuers and file submissions."
			/>

			<Tabs defaultValue="enrollment-detail" className="gap-4">
				<div className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm">
					<div className="border-b border-primary/15 px-4 pt-3">
						<TabsList className="inline-flex h-auto max-w-full flex-wrap justify-start gap-1 rounded-lg bg-muted/40 p-1">
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className={TAB_TRIGGER_CLASS}
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<div className="p-4">
						{tabs.map((tab) => (
							<TabsContent key={tab.id} value={tab.id} className="mt-0">
								<ReportTabPanel tabId={tab.id} />
							</TabsContent>
						))}
					</div>
				</div>
			</Tabs>
		</div>
	);
}
