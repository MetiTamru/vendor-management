"use client";

import { notFound } from "next/navigation";

import { ComplianceProgramPage } from "@/features/admin/features/claim-encounter/compliance-program/ComplianceProgramPage";
import type { ComplianceProgramSection } from "@/features/admin/features/claim-encounter/compliance-program/config";

import { useComplianceProgramPageQuery } from "./feature/queries/useComplianceProgramQuery";

export function ComplianceProgramRoutePage({
	slug,
	section,
}: {
	slug: string;
	section: ComplianceProgramSection;
}) {
	const { data: config, isLoading, isError } = useComplianceProgramPageQuery(slug);

	if (isLoading) {
		return (
			<div className="space-y-4 pb-4">
				<div className="h-16 animate-pulse rounded-lg bg-muted" />
				<div className="h-64 animate-pulse rounded-lg bg-muted" />
			</div>
		);
	}

	if (isError || !config || config.section !== section) {
		notFound();
	}

	return <ComplianceProgramPage slug={slug} />;
}
