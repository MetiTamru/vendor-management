import { RiskAdjustmentCodingValidationTab } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentCodingValidationTab";
import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";

export default function Page() {
	return (
		<RiskAdjustmentShell>
			<RiskAdjustmentCodingValidationTab />
		</RiskAdjustmentShell>
	);
}
