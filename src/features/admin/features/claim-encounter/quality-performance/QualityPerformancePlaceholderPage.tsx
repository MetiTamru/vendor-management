"use client";

import { Construction } from "lucide-react";
import { notFound } from "next/navigation";

import { CmsEdgeSectionPanel } from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";

import { useQualityPerformancePlaceholderQuery } from "./feature/queries/useQualityPerformanceQuery";
import type { QualityPerformancePlaceholderSlug } from "./feature/types/qualityPerformanceModel";

export function QualityPerformancePlaceholderPage({
	slug,
}: {
	slug: QualityPerformancePlaceholderSlug;
}) {
	const { data, isLoading, isError } = useQualityPerformancePlaceholderQuery(slug);

	if (isLoading) {
		return (
			<div className="space-y-4 pb-4">
				<div className="h-16 animate-pulse rounded-lg bg-muted" />
				<div className="h-48 animate-pulse rounded-lg bg-muted" />
			</div>
		);
	}

	if (isError || !data) {
		notFound();
	}

	return (
		<div className="space-y-4 pb-4">
			<ClaimPageHeader title={data.title} description={data.description} />
			<CmsEdgeSectionPanel title={data.title} bodyClassName="p-8">
				<div className="flex flex-col items-center justify-center gap-3 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<Construction className="size-5 text-muted-foreground" />
					</div>
					<p className="text-sm font-medium text-foreground">
						This section is coming soon
					</p>
					<p className="max-w-md text-xs text-muted-foreground">
						{data.description}
					</p>
				</div>
			</CmsEdgeSectionPanel>
		</div>
	);
}
