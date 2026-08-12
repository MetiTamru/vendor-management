import { RiskAdjustmentAuditReconciliationTab } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentAuditReconciliationTab";
import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";

export default function Page() {
	return (
		<RiskAdjustmentShell>
			<RiskAdjustmentAuditReconciliationTab />
		</RiskAdjustmentShell>
	);
}
