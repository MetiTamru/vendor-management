"use client";

import {
	Bookmark,
	CalendarDays,
	DollarSign,
	FileText,
	LayoutGrid,
	Search,
	Settings,
	Target,
	TrendingUp,
	User,
} from "lucide-react";
import { toast } from "sonner";

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
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	RA_STACK,
	RA_TABLE_CELL,
	RA_TABLE_HEAD,
	RaAllFilterSelect,
	RaFilterLabel,
	RaFilterPanel,
	RaMetricCard,
	RaSectionTitle,
	RaStatusPill,
	RaTablePagination,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShared";
import {
	MEMBER_OPPORTUNITY_KPIS,
	MEMBER_OPPORTUNITY_ROWS,
	type MemberOpportunityRow,
} from "@/features/admin/features/claim-encounter/risk-adjustment/feature/queries/useRiskAdjustmentQuery";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function opportunityStatusTone(status: MemberOpportunityRow["status"]) {
	if (status === "New") return "success";
	if (status === "In Progress") return "warning";
	return "info";
}

function OpportunityFilters() {
	return (
		<RaFilterPanel>
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
				<div className="space-y-1 xl:col-span-2">
					<RaFilterLabel>Search Member</RaFilterLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 pl-8 text-xs"
							placeholder="Search by Member ID, Name..."
						/>
					</div>
				</div>
				<RaAllFilterSelect label="Opportunity Type" />
				<RaAllFilterSelect label="HCC" />
				<RaAllFilterSelect label="HCC Category" />
				<RaAllFilterSelect label="Provider / Group" />
				<RaAllFilterSelect label="Status" />
			</div>
			<div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
				<RaAllFilterSelect label="RAF Impact" />
				<RaAllFilterSelect label="Coding Source" />
				<div className="space-y-1">
					<RaFilterLabel>Last Service Date</RaFilterLabel>
					<Button
						variant="outline"
						className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal"
					>
						<CalendarDays className="size-3.5 text-muted-foreground" />
						01/01/2024 – 12/31/2025
					</Button>
				</div>
				<div className="space-y-1">
					<RaFilterLabel>Date Identified</RaFilterLabel>
					<Button
						variant="outline"
						className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal"
					>
						<CalendarDays className="size-3.5 text-muted-foreground" />
						01/01/2024 – 12/31/2025
					</Button>
				</div>
				<RaAllFilterSelect label="Assigned To" />
			</div>
			<div className="mt-2 flex items-center gap-2">
				<Button
					size="sm"
					className="h-8 text-xs"
					onClick={() => toast.message("Filters applied")}
				>
					Apply Filters
				</Button>
				<Button
					variant="link"
					size="sm"
					className="h-8 px-0 text-xs text-primary"
				>
					Reset
				</Button>
			</div>
		</RaFilterPanel>
	);
}

function KpiRow() {
	const k = MEMBER_OPPORTUNITY_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
			<RaMetricCard
				label="Total Opportunities"
				value={k.totalOpportunities.toLocaleString()}
				icon={LayoutGrid}
				iconClass="bg-sky-500"
			/>
			<RaMetricCard
				label="Potential RAF Impact"
				value={k.potentialRafImpact.toFixed(3)}
				icon={Target}
				iconClass="bg-orange-500"
			/>
			<RaMetricCard
				label="Payment Impact (Est.)"
				value={`$${(k.paymentImpactEst / 1_000_000).toFixed(1)}M`}
				icon={DollarSign}
				iconClass="bg-emerald-600"
			/>
			<RaMetricCard
				label="High Impact (RAF ≥ 0.200)"
				value={k.highImpact.toLocaleString()}
				icon={TrendingUp}
				iconClass="bg-red-500"
			/>
			<RaMetricCard
				label="Documentation Needed"
				value={k.documentationNeeded.toLocaleString()}
				icon={FileText}
				iconClass="bg-amber-500"
			/>
			<RaMetricCard
				label="Pending Provider Review"
				value={k.pendingProviderReview.toLocaleString()}
				icon={User}
				iconClass="bg-blue-500"
			/>
		</div>
	);
}

export function RiskAdjustmentMemberOpportunitiesTab() {
	return (
		<div className={RA_STACK}>
			<div className="grid gap-2 sm:grid-cols-2">
				<div className="space-y-1">
					<RaFilterLabel>Program</RaFilterLabel>
					<Select defaultValue="medicare-advantage">
						<SelectTrigger className="h-8 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="medicare-advantage">
								Medicare Advantage
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<RaFilterLabel>Measurement Year</RaFilterLabel>
					<Select defaultValue="2025">
						<SelectTrigger className="h-8 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="2025">2025</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<OpportunityFilters />
			<KpiRow />

			<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
				<RaSectionTitle
					title="Opportunities List"
					subtitle="Showing 1 to 10 of 7,962 opportunities"
					action={
						<div className="flex flex-wrap items-center gap-2">
							<Button variant="outline" size="sm" className="h-7 text-xs">
								Bulk Assign
							</Button>
							<Select defaultValue="my-view">
								<SelectTrigger className="h-7 w-[110px] text-xs">
									<SelectValue placeholder="View" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="my-view">My View</SelectItem>
									<SelectItem value="all">All</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="ghost" size="icon" className="size-7">
								<Bookmark className="size-3.5" />
							</Button>
							<Button variant="ghost" size="icon" className="size-7">
								<Settings className="size-3.5" />
							</Button>
						</div>
					}
				/>
				<CmsEdgeTableScroll>
					<Table
						containerClassName={CMS_EDGE_TABLE_CONTAINER}
						className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1400px]")}
					>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className={cn(RA_TABLE_HEAD, "w-10")}>
									<Checkbox aria-label="Select all" />
								</TableHead>
								<TableHead className={RA_TABLE_HEAD}>Member ID</TableHead>
								<TableHead className={RA_TABLE_HEAD}>Member Name</TableHead>
								<TableHead className={RA_TABLE_HEAD}>DOB</TableHead>
								<TableHead className={RA_TABLE_HEAD}>HCC</TableHead>
								<TableHead className={RA_TABLE_HEAD}>HCC Description</TableHead>
								<TableHead className={RA_TABLE_HEAD}>
									Opportunity Type
								</TableHead>
								<TableHead className={RA_TABLE_HEAD}>
									Last Service Date
								</TableHead>
								<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>
									RAF Impact
								</TableHead>
								<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>
									Payment Impact (Est.)
								</TableHead>
								<TableHead className={RA_TABLE_HEAD}>Status</TableHead>
								<TableHead className={RA_TABLE_HEAD}>Assigned To</TableHead>
								<TableHead className={RA_TABLE_HEAD}>Coding Source</TableHead>
								<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>
									Action
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{MEMBER_OPPORTUNITY_ROWS.map((row) => (
								<TableRow
									key={row.id}
									className="border-b border-border/40 hover:bg-muted/20"
								>
									<TableCell className={RA_TABLE_CELL}>
										<Checkbox aria-label={`Select ${row.memberId}`} />
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>
										<Button
											variant="link"
											className={CMS_EDGE_TABLE_LINK_CLASS}
											asChild
										>
											<Link
												href={`/admin/claim-encounter/regulatory/risk-adjustment/member-opportunities/${row.id}`}
											>
												{row.memberId}
											</Link>
										</Button>
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>{row.name}</TableCell>
									<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>
										{row.dob}
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>
										<Button
											variant="link"
											className={CMS_EDGE_TABLE_LINK_CLASS}
										>
											{row.hcc}
										</Button>
									</TableCell>
									<TableCell
										className={cn(RA_TABLE_CELL, "max-w-[180px] truncate")}
									>
										{row.hccDescription}
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>
										{row.opportunityType}
									</TableCell>
									<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>
										{row.lastServiceDate}
									</TableCell>
									<TableCell
										className={cn(RA_TABLE_CELL, "text-right tabular-nums")}
									>
										{row.rafImpact.toFixed(3)}
									</TableCell>
									<TableCell
										className={cn(RA_TABLE_CELL, "text-right tabular-nums")}
									>
										${row.paymentImpact.toLocaleString()}
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>
										<RaStatusPill
											label={row.status}
											tone={opportunityStatusTone(row.status)}
										/>
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>
										{row.assignedTo}
									</TableCell>
									<TableCell className={RA_TABLE_CELL}>
										{row.codingSource}
									</TableCell>
									<TableCell className={cn(RA_TABLE_CELL, "pr-3 text-right")}>
										<Button
											variant="outline"
											size="sm"
											className="h-7 px-2 text-xs"
											asChild
										>
											<Link
												href={`/admin/claim-encounter/regulatory/risk-adjustment/member-opportunities/${row.id}`}
											>
												View
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CmsEdgeTableScroll>
				<RaTablePagination shown={10} total={7_962} />
			</div>
		</div>
	);
}
