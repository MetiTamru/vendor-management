"use client";

import { Construction } from "lucide-react";

import { CmsEdgeSectionPanel } from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";

export function QualityPerformancePlaceholderPage({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="space-y-4 pb-4">
			<ClaimPageHeader title={title} description={description} />
			<CmsEdgeSectionPanel title={title} bodyClassName="p-8">
				<div className="flex flex-col items-center justify-center gap-3 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<Construction className="size-5 text-muted-foreground" />
					</div>
					<p className="text-sm font-medium text-foreground">
						This section is coming soon
					</p>
					<p className="max-w-md text-xs text-muted-foreground">
						{description}
					</p>
				</div>
			</CmsEdgeSectionPanel>
		</div>
	);
}
