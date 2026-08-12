import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";
import { RiskAdjustmentSubmissionsTab } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentSubmissionsTab";

export default function Page() {
	return (
		<RiskAdjustmentShell>
			<RiskAdjustmentSubmissionsTab />
		</RiskAdjustmentShell>
	);
}
