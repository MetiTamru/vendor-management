import { RiskAdjustmentOverviewTab } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentOverviewTab";
import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";

export default function Page() {
	return (
		<RiskAdjustmentShell>
			<RiskAdjustmentOverviewTab />
		</RiskAdjustmentShell>
	);
}
