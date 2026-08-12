import {
	RiskAdjustmentDocumentsHeaderAction,
	RiskAdjustmentDocumentsTab,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentDocumentsTab";
import { RiskAdjustmentShell } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShell";

export default function Page() {
	return (
		<RiskAdjustmentShell headerAction={<RiskAdjustmentDocumentsHeaderAction />}>
			<RiskAdjustmentDocumentsTab />
		</RiskAdjustmentShell>
	);
}
