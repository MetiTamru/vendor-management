"use client";

import { type ReactNode } from "react";

import {
	AlertTriangle,
	CalendarDays,
	CheckCircle2,
	ClipboardCheck,
	FileCheck,
	Shield,
	type LucideIcon,
} from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_STATUS_PILL_CLASS,
	CmsEdgePageFooter,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	MEDICARE_COMPLIANCE_ATTESTATIONS,
	MEDICARE_COMPLIANCE_KPIS,
	MEDICARE_COMPLIANCE_REQUIREMENTS,
} from "@/features/admin/features/claim-encounter/program-reporting/mock-data";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-5";
const SECTION_GAP = "gap-4";
const TABLE_HEAD = "h-9 bg-muted/30 px-4 text-[11px] font-semibold text-foreground";
const TABLE_CELL = "px-4 py-2.5";

function StatusPill({ label, className }: { label: string; className: string }) {
	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, className)}>{label}</span>
	);
}

function MetricCard({
	label,
	value,
	hint,
	icon: Icon,
	tone = "text-primary bg-primary/10",
	valueClassName,
}: {
	label: string;
	value: ReactNode;
	hint?: ReactNode;
	icon: LucideIcon;
	tone?: string;
	valueClassName?: string;
}) {
	return (
		<div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-sm">
			<div className="flex items-center gap-3">
				<div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", tone)}>
					<Icon className="size-4" aria-hidden />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
						{label}
					</p>
					<p
						className={cn(
							"mt-0.5 text-sm font-semibold tabular-nums leading-tight text-foreground",
							valueClassName
						)}
					>
						{value}
					</p>
					{hint != null && hint !== "" ? (
						<div className="mt-0.5 truncate text-[10px] text-muted-foreground">{hint}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function ComplianceKpiRow() {
	const k = MEDICARE_COMPLIANCE_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<MetricCard
				label="Requirements Met"
				value={`${k.requirementsMet}/${k.requirementsTotal}`}
				hint={`${((k.requirementsMet / k.requirementsTotal) * 100).toFixed(1)}% Complete`}
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
			<MetricCard
				label="Upcoming Deadlines"
				value={k.upcomingDeadlines}
				hint="Next 90 Days"
				icon={CalendarDays}
				tone="text-amber-700 bg-amber-500/10"
				valueClassName="text-amber-600"
			/>
			<MetricCard
				label="Overdue Items"
				value={k.overdueItems}
				hint="Requires Immediate Action"
				icon={AlertTriangle}
				tone="text-red-700 bg-red-500/10"
				valueClassName={k.overdueItems > 0 ? "text-red-600" : "text-emerald-700"}
			/>
			<MetricCard
				label="Attestations Complete"
				value={`${k.attestationsComplete}/${k.attestationsTotal}`}
				hint={`${((k.attestationsComplete / k.attestationsTotal) * 100).toFixed(0)}% Complete`}
				icon={ClipboardCheck}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<MetricCard
				label="Open Gaps"
				value={k.openGaps}
				hint="Compliance Gaps Identified"
				icon={FileCheck}
				tone="text-violet-700 bg-violet-500/10"
				valueClassName="text-amber-600"
			/>
			<MetricCard
				label="Overall Status"
				value="Good"
				hint="All Critical Requirements Met"
				icon={Shield}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
		</div>
	);
}

function RequirementsTablePanel() {
	return (
		<CmsEdgeSectionPanel title="Compliance Requirements">
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={TABLE_HEAD}>Requirement</TableHead>
							<TableHead className={TABLE_HEAD}>Regulation</TableHead>
							<TableHead className={TABLE_HEAD}>Due Date</TableHead>
							<TableHead className={TABLE_HEAD}>Owner</TableHead>
							<TableHead className={cn(TABLE_HEAD, "pr-5")}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEDICARE_COMPLIANCE_REQUIREMENTS.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={cn(TABLE_CELL, "font-medium")}>{row.requirement}</TableCell>
								<TableCell className={cn(TABLE_CELL, "font-mono text-[11px] text-muted-foreground")}>
									{row.regulation}
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "tabular-nums")}>{row.dueDate}</TableCell>
								<TableCell className={TABLE_CELL}>{row.owner}</TableCell>
								<TableCell className={cn(TABLE_CELL, "pr-5")}>
									<StatusPill label={row.status} className={row.statusStyle} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function AttestationsTablePanel() {
	return (
		<CmsEdgeSectionPanel title="Attestations">
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={TABLE_HEAD}>Attestation</TableHead>
							<TableHead className={TABLE_HEAD}>Submitted By</TableHead>
							<TableHead className={TABLE_HEAD}>Submitted Date</TableHead>
							<TableHead className={cn(TABLE_HEAD, "pr-5")}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEDICARE_COMPLIANCE_ATTESTATIONS.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={cn(TABLE_CELL, "font-medium")}>{row.name}</TableCell>
								<TableCell className={TABLE_CELL}>{row.submittedBy}</TableCell>
								<TableCell className={cn(TABLE_CELL, "tabular-nums")}>{row.submittedDate}</TableCell>
								<TableCell className={cn(TABLE_CELL, "pr-5")}>
									<StatusPill label={row.status} className={row.statusStyle} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

export function MedicareComplianceTab() {
	return (
		<div className={PAGE_STACK}>
			<ComplianceKpiRow />
			<div className={cn("flex flex-col", SECTION_GAP)}>
				<RequirementsTablePanel />
				<AttestationsTablePanel />
			</div>
			<CmsEdgePageFooter />
		</div>
	);
}
