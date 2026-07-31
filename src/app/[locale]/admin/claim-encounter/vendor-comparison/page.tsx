"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { claimVendorsForComparison } from "@/features/admin/features/claim-encounter/mock-data";
import { VendorComparisonPage } from "@/features/admin/features/vendor-comparison/pages/VendorComparisonPage";
import { Link } from "@/i18n/navigation";
import { useAdminModuleStore } from "@/stores/admin-module-store";

export default function ClaimVendorComparisonPage() {
	const programFilter = useAdminModuleStore((s) => s.fileType);

	const vendors = useMemo(
		() => claimVendorsForComparison(programFilter),
		[programFilter]
	);

	return (
		<VendorComparisonPage
			key={programFilter}
			title="Vendor Comparison"
			description={`Compare claim & encounter vendor performance for ${programFilter} — acceptance SLA, volume, and open exceptions.`}
			vendors={vendors}
			vendorHref={() => null}
			headerActions={
				<>
					<Button asChild size="sm" variant="outline" className="h-9">
						<Link href="/admin/claim-encounter/inbound">Inbound</Link>
					</Button>
					<Button asChild size="sm" variant="outline" className="h-9">
						<Link href="/admin/claim-encounter/acceptance-analytics">
							Acceptance Analytics
						</Link>
					</Button>
				</>
			}
		/>
	);
}
