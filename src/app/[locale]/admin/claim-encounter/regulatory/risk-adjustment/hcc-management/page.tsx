import { RiskAdjustmentHccManagementTab } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentHccManagementTab";
import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";

export default function Page() {
	return (
		<RiskAdjustmentShell>
			<RiskAdjustmentHccManagementTab />
		</RiskAdjustmentShell>
	);
}
