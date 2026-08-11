"use client";

import { useMemo, useState } from "react";

import { Bookmark, ExternalLink, Gauge, MoreVertical, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CMS_EDGE_STATUS_PILL_CLASS } from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	MeasureAsOfBar,
	MeasureDataTable,
	MeasureDonutBreakdown,
	MeasureFilterField,
	MeasureKpiCard,
	MeasurePipeline,
	MeasureSectionPanel,
	MEASURE_TAB_STACK,
	MEASURE_TABLE_MUTED,
	PanelLink,
} from "@/features/admin/features/claim-encounter/quality-performance/measure-library/MeasureDetailShared";
import {
	getMemberStatusStyle,
	type MeasureMembersDetail,
} from "@/features/admin/features/claim-encounter/quality-performance/measure-library/mock-data";
import { cn } from "@/lib/utils";

export function MeasureDetailMembersTab({
	data,
	measurementYear,
}: {
	data: MeasureMembersDetail;
	measurementYear: string;
}) {
	const [search, setSearch] = useState("");
	const summary = data.summary;

	const filteredMembers = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return data.members;
		return data.members.filter(
			(m) =>
				m.id.toLowerCase().includes(q) ||
				m.name.toLowerCase().includes(q) ||
				m.dob.includes(q)
		);
	}, [data.members, search]);

	return (
		<div className={MEASURE_TAB_STACK}>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<MeasureKpiCard
					label="Performance Rate"
					value={`${summary.performanceRate.toFixed(2)}%`}
					hint={`${measurementYear}`}
					icon={Gauge}
					tone="primary"
				/>
				<MeasureKpiCard
					label="Eligible Population"
					value={summary.eligiblePopulation.toLocaleString()}
					icon={Users}
				/>
				<MeasureKpiCard label="Denominator" value={summary.denominator.toLocaleString()} />
				<MeasureKpiCard
					label="Numerator"
					value={summary.numerator.toLocaleString()}
					tone="success"
				/>
			</div>

			<MeasureSectionPanel
				title="Population Flow"
				subtitle="Member counts from eligibility through performance"
				bodyClassName="p-0"
			>
				<MeasurePipeline
					steps={[
						{ label: "Eligible Population", value: summary.eligiblePopulation },
						{ label: "Denominator", value: summary.denominator },
						{ label: "Exclusions", value: summary.exclusions },
						{ label: "Numerator", value: summary.numerator },
						{
							label: "Performance Rate",
							value: `${summary.performanceRate.toFixed(2)}%`,
						},
					]}
				/>
			</MeasureSectionPanel>

			<div className="grid gap-3 lg:grid-cols-2">
				<MeasureSectionPanel
					title="Members by Status"
					subtitle="Distribution across measure statuses"
					bodyClassName="p-0"
				>
					<MeasureDonutBreakdown
						items={data.byStatus.map((s) => ({
							name: s.name,
							value: s.value,
							color: s.color,
							pct: s.pct,
						}))}
						centerValue={summary.denominator.toLocaleString()}
						centerLabel="Denominator"
					/>
				</MeasureSectionPanel>

				<MeasureSectionPanel
					title="Members by Plan"
					subtitle="Denominator and numerator by plan"
					action={
						<PanelLink icon={<ExternalLink className="size-3.5" />}>View All Plans</PanelLink>
					}
					bodyClassName="p-0"
				>
					<MeasureDataTable
						columns={[
							{ key: "plan", header: "Plan Name" },
							{ key: "den", header: "Denominator", align: "right" },
							{ key: "num", header: "Numerator", align: "right" },
							{ key: "rate", header: "Rate", align: "right", className: "font-semibold text-primary" },
						]}
						rows={data.byPlan.map((row) => ({
							plan: row.planName,
							den: row.denominator > 0 ? row.denominator.toLocaleString() : "—",
							num: row.numerator > 0 ? row.numerator.toLocaleString() : "—",
							rate: row.rate != null ? `${row.rate.toFixed(2)}%` : "N/A",
						}))}
						getRowKey={(row) => String(row.plan)}
					/>
				</MeasureSectionPanel>
			</div>

			<div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
				<MeasureSectionPanel
					title="Filters"
					subtitle="Narrow the member list"
					bodyClassName="space-y-2 p-0"
					action={
						<Button variant="link" size="sm" className="h-8 px-0 text-sm text-primary">
							Clear All
						</Button>
					}
				>
					{[
						{ label: "Plan", options: data.filterOptions.plans },
						{ label: "Line of Business", options: data.filterOptions.linesOfBusiness },
						{ label: "Status", options: data.filterOptions.statuses },
						{ label: "Provider", options: data.filterOptions.providers },
						{ label: "Risk Group", options: data.filterOptions.riskGroups },
						{ label: "Last Outreach", options: data.filterOptions.lastOutreach },
					].map((filter) => (
						<MeasureFilterField key={filter.label} label={filter.label}>
							<Select defaultValue="All">
								<SelectTrigger className="h-9 text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{filter.options.map((opt) => (
										<SelectItem key={opt} value={opt} className="text-sm">
											{opt}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</MeasureFilterField>
					))}
					<MeasureFilterField label="Search Member">
						<div className="relative">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Member ID, name, or DOB"
								className="h-9 pl-9 text-sm"
							/>
						</div>
					</MeasureFilterField>
					<div className="space-y-2 pt-2">
						<Button className="h-9 w-full text-sm">Apply Filters</Button>
						<Button variant="outline" className="h-9 w-full gap-1.5 text-sm">
							<Bookmark className="size-4" />
							Save Filter
						</Button>
					</div>
				</MeasureSectionPanel>

				<MeasureSectionPanel
					title={`Member List (${data.totalMembers.toLocaleString()})`}
					subtitle="Individual member measure status and outreach"
					bodyClassName="space-y-0 p-0"
				>
					<div className="border-b border-border/50 px-3 py-2">
						<MeasureAsOfBar asOf={data.summaryAsOf} />
					</div>
					<MeasureDataTable
						columns={[
							{
								key: "select",
								header: "",
								className: "w-10",
							},
							{ key: "id", header: "Member ID", className: "font-mono text-xs" },
							{ key: "name", header: "Member Name" },
							{ key: "dob", header: "DOB", className: MEASURE_TABLE_MUTED },
							{ key: "age", header: "Age", align: "right" },
							{ key: "plan", header: "Plan Name" },
							{ key: "status", header: "Status" },
							{ key: "bp", header: "Last BP Reading" },
							{ key: "bpDate", header: "Last BP Date", className: MEASURE_TABLE_MUTED },
							{ key: "provider", header: "Provider" },
							{ key: "risk", header: "Risk Group", className: MEASURE_TABLE_MUTED },
							{ key: "outreach", header: "Last Outreach", className: MEASURE_TABLE_MUTED },
							{ key: "actions", header: "Actions", align: "right" },
						]}
						rows={filteredMembers.map((member) => ({
							select: <Checkbox aria-label={`Select ${member.id}`} />,
							id: (
								<Button variant="link" className="h-auto p-0 text-sm text-primary">
									{member.id}
								</Button>
							),
							name: member.name,
							dob: member.dob,
							age: member.age,
							plan: member.planName,
							status: (
								<span
									className={cn(
										CMS_EDGE_STATUS_PILL_CLASS,
										getMemberStatusStyle(member.status)
									)}
								>
									{member.status}
								</span>
							),
							bp: member.lastBpReading,
							bpDate: member.lastBpDate,
							provider: (
								<Button variant="link" className="h-auto p-0 text-sm text-primary">
									{member.provider}
								</Button>
							),
							risk: member.riskGroup,
							outreach: member.lastOutreach,
							actions: (
								<Button variant="ghost" size="icon" className="size-8">
									<MoreVertical className="size-4" />
								</Button>
							),
						}))}
						getRowKey={(_, index) => filteredMembers[index]?.id ?? String(index)}
					/>
					<div className="border-t border-border/50 px-3 py-2 text-sm text-muted-foreground">
						Showing 1 to {filteredMembers.length} of {data.totalMembers.toLocaleString()} entries
					</div>
				</MeasureSectionPanel>
			</div>
		</div>
	);
}
