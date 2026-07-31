"use client";

import { ClaimDirectionFileDashboard } from "@/features/admin/features/claim-encounter/pages/ClaimDirectionFileDashboard";

export function OutboundVendorFilePage() {
	return (
		<ClaimDirectionFileDashboard
			direction="outbound"
			title="Outbound Vendor File"
			description="Claim and encounter responses and remittances sent to trading partners"
		/>
	);
}
