"use client";

import { Construction } from "lucide-react";

import { CmsEdgeSectionPanel } from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";

export function RiskAdjustmentPlaceholderTab({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<CmsEdgeSectionPanel title={title} bodyClassName="p-6">
			<div className="flex flex-col items-center justify-center gap-3 text-center">
				<div className="flex size-10 items-center justify-center rounded-full bg-muted">
					<Construction className="size-4 text-muted-foreground" />
				</div>
				<p className="text-sm font-medium text-foreground">This section is coming soon</p>
				<p className="max-w-md text-xs text-muted-foreground">{description}</p>
			</div>
		</CmsEdgeSectionPanel>
	);
}
