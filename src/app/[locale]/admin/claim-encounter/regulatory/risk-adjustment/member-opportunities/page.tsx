import { RiskAdjustmentMemberOpportunitiesTab } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentMemberOpportunitiesTab";
import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";

export default function Page() {
	return (
		<RiskAdjustmentShell>
			<RiskAdjustmentMemberOpportunitiesTab />
		</RiskAdjustmentShell>
	);
}
