"use client";

import { ClaimDirectionFileDashboard } from "@/features/admin/features/claim-encounter/pages/ClaimDirectionFileDashboard";

export function InboundVendorFilePage() {
	return (
		<ClaimDirectionFileDashboard
			direction="inbound"
			title="Inbound Vendor File"
			description="Claim and encounter files received from trading partners"
		/>
	);
}
