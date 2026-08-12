"use client";

import { useState } from "react";

import {
	CalendarDays,
	CheckCircle2,
	Clock,
	FileText,
	Search,
	Settings,
	X,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	CODING_VALIDATION_DETAIL,
	CODING_VALIDATION_KPIS,
	CODING_VALIDATION_ROWS,
	type CodingValidationRow,
} from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";
import {
	RaAllFilterSelect,
	RaFilterLabel,
	RaFilterPanel,
	RaMetricCard,
	RaSectionTitle,
	RA_STACK,
	RaStatusPill,
	RaTablePagination,
	RA_TABLE_CELL,
	RA_TABLE_HEAD,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShared";
import { cn } from "@/lib/utils";

function validationStatusTone(status: CodingValidationRow["status"]) {
	if (status === "Pending") return "info";
	if (status === "In Review") return "warning";
	if (status === "Rejected") return "danger";
	return "info";
}

function ValidationFilters() {
	return (
		<RaFilterPanel>
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
				<div className="space-y-1 xl:col-span-2">
					<RaFilterLabel>Search Member</RaFilterLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input className="h-8 pl-8 text-xs" placeholder="Search by Member ID, Name..." />
					</div>
				</div>
				<RaAllFilterSelect label="HCC" />
				<RaAllFilterSelect label="Validation Status" />
				<RaAllFilterSelect label="Coding Source" />
				<RaAllFilterSelect label="Provider / Group" />
			</div>
			<div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
				<RaAllFilterSelect label="Risk Score Impact" />
				<div className="space-y-1">
					<RaFilterLabel>Date of Service</RaFilterLabel>
					<Button variant="outline" className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal">
						<CalendarDays className="size-3.5 text-muted-foreground" />
						01/01/2024 – 12/31/2025
					</Button>
				</div>
				<div className="flex items-end gap-2 xl:col-span-2">
					<Button size="sm" className="h-8 text-xs" onClick={() => toast.message("Filters applied")}>
						Apply Filters
					</Button>
					<Button variant="link" size="sm" className="h-8 px-0 text-xs text-primary">
						Reset
					</Button>
				</div>
			</div>
		</RaFilterPanel>
	);
}

function KpiRow() {
	const k = CODING_VALIDATION_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
			<RaMetricCard
				label="Total for Review"
				value={k.totalForReview.toLocaleString()}
				icon={FileText}
				iconClass="bg-violet-500"
			/>
			<RaMetricCard
				label="Pending Validation"
				value={k.pendingValidation.toLocaleString()}
				icon={Clock}
				iconClass="bg-sky-500"
			/>
			<RaMetricCard
				label="Validated"
				value={k.validated.toLocaleString()}
				icon={CheckCircle2}
				iconClass="bg-emerald-500"
			/>
			<RaMetricCard
				label="Rejected"
				value={k.rejected.toLocaleString()}
				icon={XCircle}
				iconClass="bg-red-500"
			/>
			<RaMetricCard
				label="Documentation Requested"
				value={k.documentationRequested.toLocaleString()}
				icon={FileText}
				iconClass="bg-amber-500"
			/>
		</div>
	);
}

function ValidationDetailPanel({ onClose }: { onClose: () => void }) {
	const d = CODING_VALIDATION_DETAIL;

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="flex items-start justify-between gap-2 border-b border-border/50 px-3 py-2">
				<div className="min-w-0">
					<h3 className="text-sm font-semibold text-foreground">Coding Validation Detail</h3>
					<p className="text-xs text-muted-foreground">
						{d.memberId} · {d.name} · {d.hcc}
					</p>
					<p className="text-xs text-muted-foreground">{d.condition}</p>
				</div>
				<Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={onClose}>
					<X className="size-4" />
				</Button>
			</div>

			<Tabs defaultValue="summary" className="flex min-h-0 flex-1 flex-col">
				<div className="border-b border-border/50 px-3">
					<TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
						{["Summary", "Diagnosis Codes", "Documentation", "History"].map((tab) => (
							<TabsTrigger
								key={tab}
								value={tab.toLowerCase().replace(/\s+/g, "-")}
								className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
							>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="summary" className="mt-0 flex-1 overflow-y-auto p-3">
					<div className="space-y-3">
						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Opportunity Information
							</p>
							<dl className="mt-2 space-y-1.5 text-xs">
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Date Identified</dt>
									<dd>{d.dateIdentified}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Risk Score Impact</dt>
									<dd className="font-medium tabular-nums">{d.riskScoreImpact.toFixed(3)}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Estimated Payment Impact</dt>
									<dd className="font-medium tabular-nums">${d.paymentImpact.toLocaleString()}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Risk Model</dt>
									<dd>{d.riskModel}</dd>
								</div>
							</dl>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Clinical / Coding Evidence
							</p>
							<dl className="mt-2 space-y-1.5 text-xs">
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Diagnosis Code</dt>
									<dd className="font-mono">{d.diagnosisCode}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Description</dt>
									<dd className="max-w-[180px] text-right">{d.diagnosisDescription}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Provider</dt>
									<dd>{d.provider}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Place of Service</dt>
									<dd>{d.placeOfService}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Claim / Encounter</dt>
									<dd>
										<Button variant="link" className="h-auto p-0 text-xs text-primary">
											{d.claimEncounter}
										</Button>
									</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Documentation Available</dt>
									<dd>
										<RaStatusPill label="Yes" tone="success" />
									</dd>
								</div>
							</dl>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Validation Form
							</p>
							<div className="mt-2 space-y-2">
								<div className="grid gap-2 sm:grid-cols-2">
									<div className="space-y-1">
										<Label className="text-[11px]">Status</Label>
										<Select defaultValue="pending">
											<SelectTrigger className="h-8 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="in-review">In Review</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label className="text-[11px]">Assigned To</Label>
										<Select defaultValue="sarah">
											<SelectTrigger className="h-8 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="sarah">Sarah L.</SelectItem>
												<SelectItem value="michael">Michael T.</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label className="text-[11px]">Priority</Label>
										<Select defaultValue="high">
											<SelectTrigger className="h-8 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="high">High</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label className="text-[11px]">Due Date</Label>
										<Input className="h-8 text-xs" defaultValue="05/20/2025" />
									</div>
								</div>
								<div className="space-y-1">
									<Label className="text-[11px]">Notes</Label>
									<Textarea className="min-h-[72px] text-xs" placeholder="Add validation notes..." />
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				{["diagnosis-codes", "documentation", "history"].map((tab) => (
					<TabsContent key={tab} value={tab} className="mt-0 p-6 text-center text-sm text-muted-foreground">
						{tab.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} content will appear here.
					</TabsContent>
				))}
			</Tabs>

			<div className="flex flex-wrap gap-2 border-t border-border/50 p-3">
				<Button size="sm" className="h-8 bg-emerald-600 text-xs hover:bg-emerald-700">
					Validate
				</Button>
				<Button variant="outline" size="sm" className="h-8 border-red-200 text-xs text-red-600">
					Reject
				</Button>
				<Button variant="outline" size="sm" className="h-8 text-xs">
					Request Documentation
				</Button>
				<Button variant="outline" size="sm" className="h-8 text-xs">
					Assign
				</Button>
			</div>
		</div>
	);
}

export function RiskAdjustmentCodingValidationTab() {
	const [selectedId, setSelectedId] = useState(CODING_VALIDATION_ROWS[0]?.id ?? "");
	const showDetail = Boolean(selectedId);

	return (
		<div className={RA_STACK}>
			<ValidationFilters />
			<KpiRow />

			<div className={cn("grid gap-3", showDetail ? "xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]" : "")}>
				<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
					<RaSectionTitle
						title="Validation Queue"
						subtitle="Showing 1 to 10 of 3,214 records"
						action={
							<div className="flex items-center gap-2">
								<Select defaultValue="my-view">
									<SelectTrigger className="h-7 w-[100px] text-xs">
										<SelectValue placeholder="View" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="my-view">My View</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue="date">
									<SelectTrigger className="h-7 w-[120px] text-xs">
										<SelectValue placeholder="Sort" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="date">Date Identified</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="ghost" size="icon" className="size-7">
									<Settings className="size-3.5" />
								</Button>
							</div>
						}
					/>
					<CmsEdgeTableScroll>
						<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1000px]")}>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className={cn(RA_TABLE_HEAD, "w-10")}>
										<Checkbox aria-label="Select all" />
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Member ID</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Member Name</TableHead>
									<TableHead className={RA_TABLE_HEAD}>HCC</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Condition / Description</TableHead>
									<TableHead className={RA_TABLE_HEAD}>DOS</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Coding Source</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>Risk Score Impact</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Status</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Assigned To</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{CODING_VALIDATION_ROWS.map((row) => (
									<TableRow
										key={row.id}
										className={cn(
											"cursor-pointer border-b border-border/40 hover:bg-muted/20",
											selectedId === row.id && "bg-primary/5"
										)}
										onClick={() => setSelectedId(row.id)}
									>
										<TableCell className={RA_TABLE_CELL} onClick={(e) => e.stopPropagation()}>
											<Checkbox aria-label={`Select ${row.memberId}`} />
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
												{row.memberId}
											</Button>
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.name}</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
												{row.hcc}
											</Button>
										</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "max-w-[160px] truncate")}>
											{row.condition}
										</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>{row.dos}</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.codingSource}</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "text-right tabular-nums")}>
											{row.riskScoreImpact.toFixed(3)}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<RaStatusPill label={row.status} tone={validationStatusTone(row.status)} />
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.assignedTo}</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "pr-3 text-right")}>
											<Button variant="outline" size="sm" className="h-7 px-2 text-xs">
												Review
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
					<RaTablePagination shown={10} total={3_214} />
				</div>

				{showDetail ? (
					<ValidationDetailPanel onClose={() => setSelectedId("")} />
				) : null}
			</div>
		</div>
	);
}
