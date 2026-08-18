"use client";

import { useState } from "react";

import {
	CalendarDays,
	Check,
	CheckCircle2,
	Clock,
	Download,
	FileText,
	Search,
	Settings,
	X,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	RaViewAction,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShared";
import {
	RA_SUBMISSION_DETAIL,
	RA_SUBMISSION_KPIS,
	RA_SUBMISSION_ROWS,
	type RaSubmissionRow,
} from "@/features/admin/features/claim-encounter/risk-adjustment/feature/queries/useRiskAdjustmentQuery";
import { cn } from "@/lib/utils";

function submissionStatusTone(status: RaSubmissionRow["status"]) {
	if (status === "Accepted") return "success";
	if (status === "In Process") return "warning";
	return "danger";
}

function SubmissionFilters() {
	return (
		<RaFilterPanel>
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
				<RaAllFilterSelect label="Submission Type" />
				<RaAllFilterSelect label="Submission Period" />
				<RaAllFilterSelect label="Status" />
				<RaAllFilterSelect label="Payer" />
				<div className="space-y-1 xl:col-span-2">
					<RaFilterLabel>File Name / ID</RaFilterLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 pl-8 text-xs"
							placeholder="Search submissions..."
						/>
					</div>
				</div>
			</div>
			<div className="mt-2 flex flex-wrap items-end gap-2">
				<div className="min-w-[200px] flex-1 space-y-1">
					<RaFilterLabel>Date Range</RaFilterLabel>
					<Button
						variant="outline"
						className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal"
					>
						<CalendarDays className="size-3.5 text-muted-foreground" />
						01/01/2024 – 12/31/2025
					</Button>
				</div>
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
	const k = RA_SUBMISSION_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			<RaMetricCard
				label="Total Submissions"
				value={k.total}
				icon={FileText}
				iconClass="bg-sky-500"
			/>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
						<CheckCircle2 className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Accepted</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.accepted}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.acceptedPct}%)
							</span>
						</p>
						<p className="text-[11px] font-medium text-emerald-700">
							${(k.acceptedPayment / 1_000_000).toFixed(2)}M Est. Payment
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
						<Clock className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">In Process</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.inProcess}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.inProcessPct}%)
							</span>
						</p>
						<p className="text-[11px] font-medium text-emerald-700">
							${(k.inProcessPayment / 1_000_000).toFixed(2)}M Est. Payment
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
						<XCircle className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">
							Rejected / Failed
						</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.rejected}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.rejectedPct}%)
							</span>
						</p>
						<p className="text-[11px] font-medium text-emerald-700">
							${(k.rejectedPayment / 1_000_000).toFixed(2)}M Est. Payment Impact
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function SubmissionDetailPanel({ onClose }: { onClose: () => void }) {
	const d = RA_SUBMISSION_DETAIL;

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="border-b border-border/50 px-3 py-2">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-sm font-semibold text-foreground">
							Submission Details
						</h3>
						<p className="mt-1 font-mono text-xs font-medium text-foreground">
							{d.submissionId}
						</p>
						<div className="mt-1 flex flex-wrap items-center gap-2">
							<RaStatusPill label={d.status} tone="warning" />
							<span className="text-[11px] text-muted-foreground">
								{d.type} | {d.period} | Payer: {d.payer}
							</span>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="size-7"
						onClick={onClose}
					>
						<X className="size-4" />
					</Button>
				</div>
			</div>

			<Tabs defaultValue="summary" className="flex min-h-0 flex-1 flex-col">
				<div className="border-b border-border/50 px-3">
					<TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
						{["Summary", "Files", "Responses", "Validation", "History"].map(
							(tab) => (
								<TabsTrigger
									key={tab}
									value={tab.toLowerCase()}
									className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
								>
									{tab}
								</TabsTrigger>
							)
						)}
					</TabsList>
				</div>

				<TabsContent
					value="summary"
					className="mt-0 flex-1 overflow-y-auto p-3"
				>
					<div className="space-y-3">
						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Submission Information
							</p>
							<dl className="mt-2 grid gap-1.5 text-xs sm:grid-cols-2">
								{[
									["Submitted Date", d.submittedDate],
									["Submission Period", d.period],
									["Records", d.records.toLocaleString()],
									["Risk Model", d.riskModel],
									["Group Type", d.groupType],
									["Submitted By", d.submittedBy],
									["Payer", d.payer],
									["File Type", d.fileType],
									["Program", d.program],
								].map(([label, value]) => (
									<div key={label} className="flex justify-between gap-2">
										<dt className="text-muted-foreground">{label}</dt>
										<dd className="font-medium">{value}</dd>
									</div>
								))}
							</dl>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Status & Response
							</p>
							<div className="mt-2">
								<RaStatusPill label={d.status} tone="warning" />
							</div>
							<div className="mt-3 flex items-center justify-between gap-1">
								{d.steps.map((step, index) => (
									<div
										key={step.label}
										className="flex flex-1 flex-col items-center gap-1"
									>
										<div
											className={cn(
												"flex size-7 items-center justify-center rounded-full border-2 text-[10px] font-semibold",
												step.state === "complete" &&
													"border-emerald-500 bg-emerald-500 text-white",
												step.state === "active" &&
													"border-primary bg-primary text-white",
												step.state === "pending" &&
													"border-muted-foreground/30 bg-muted text-muted-foreground"
											)}
										>
											{step.state === "complete" ? (
												<Check className="size-3.5" />
											) : (
												index + 1
											)}
										</div>
										<p className="text-center text-[10px] font-medium">
											{step.label}
										</p>
										{"date" in step && step.date ? (
											<p className="text-center text-[10px] text-muted-foreground">
												{step.date}
											</p>
										) : null}
										{"sublabel" in step && step.sublabel ? (
											<p
												className={cn(
													"text-center text-[10px]",
													step.state === "active"
														? "text-primary"
														: "text-muted-foreground"
												)}
											>
												{step.sublabel}
											</p>
										) : null}
									</div>
								))}
							</div>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Estimated Impact
							</p>
							<dl className="mt-2 space-y-1.5 text-xs">
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">
										Estimated Payment Impact
									</dt>
									<dd className="font-semibold text-emerald-700">
										${(d.paymentImpact / 1_000_000).toFixed(2)}M
									</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">
										Potential RAF Impact
									</dt>
									<dd className="font-medium tabular-nums">
										{d.rafImpact.toFixed(3)}
									</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Included Members</dt>
									<dd className="font-medium tabular-nums">
										{d.includedMembers.toLocaleString()}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</TabsContent>

				{["files", "responses", "validation", "history"].map((tab) => (
					<TabsContent
						key={tab}
						value={tab}
						className="mt-0 p-6 text-center text-sm text-muted-foreground"
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)} content will appear
						here.
					</TabsContent>
				))}
			</Tabs>

			<div className="flex flex-wrap gap-2 border-t border-border/50 p-3">
				<Button variant="outline" size="sm" className="h-8 text-xs">
					<Download className="mr-1.5 size-3.5" />
					Download Submission Package
				</Button>
				<Button size="sm" className="h-8 text-xs">
					View Full Details
				</Button>
			</div>
		</div>
	);
}

export function RiskAdjustmentSubmissionsTab() {
	const [selectedId, setSelectedId] = useState(RA_SUBMISSION_ROWS[0]?.id ?? "");
	const showDetail = Boolean(selectedId);

	return (
		<div className={RA_STACK}>
			<SubmissionFilters />
			<KpiRow />

			<div
				className={cn(
					"grid gap-3",
					showDetail ? "xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]" : ""
				)}
			>
				<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
					<RaSectionTitle
						title="Submissions"
						subtitle="Showing 1 to 10 of 32 submissions"
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
										<SelectItem value="date">Submitted Date</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="ghost" size="icon" className="size-7">
									<Settings className="size-3.5" />
								</Button>
							</div>
						}
					/>
					<CmsEdgeTableScroll>
						<Table
							containerClassName={CMS_EDGE_TABLE_CONTAINER}
							className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1100px]")}
						>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className={RA_TABLE_HEAD}>Submission ID</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Submission Type
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Submission Period
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Payer</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Submitted Date
									</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>
										Records
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Status</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Response Received
									</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>
										Acceptance Rate
									</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>
										Est. Payment Impact
									</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{RA_SUBMISSION_ROWS.map((row) => (
									<TableRow
										key={row.id}
										className={cn(
											"cursor-pointer border-b border-border/40 hover:bg-muted/20",
											selectedId === row.id && "bg-primary/5"
										)}
										onClick={() => setSelectedId(row.id)}
									>
										<TableCell className={RA_TABLE_CELL}>
											<Button
												variant="link"
												className={CMS_EDGE_TABLE_LINK_CLASS}
											>
												{row.submissionId}
											</Button>
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.type}</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.period}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.payer}</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>
											{row.submittedDate}
										</TableCell>
										<TableCell
											className={cn(RA_TABLE_CELL, "text-right tabular-nums")}
										>
											{row.records.toLocaleString()}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<RaStatusPill
												label={row.status}
												tone={submissionStatusTone(row.status)}
											/>
										</TableCell>
										<TableCell
											className={cn(
												RA_TABLE_CELL,
												"tabular-nums text-muted-foreground"
											)}
										>
											{row.responseReceived ?? "—"}
										</TableCell>
										<TableCell
											className={cn(RA_TABLE_CELL, "text-right tabular-nums")}
										>
											{row.acceptanceRate != null ? (
												<span className="font-medium text-emerald-700">
													{row.acceptanceRate}%
												</span>
											) : (
												"—"
											)}
										</TableCell>
										<TableCell
											className={cn(
												RA_TABLE_CELL,
												"text-right tabular-nums font-medium",
												row.paymentImpact < 0
													? "text-red-600"
													: "text-foreground"
											)}
										>
											{row.paymentImpactLabel}
										</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "pr-3 text-right")}>
											<RaViewAction />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
					<RaTablePagination shown={10} total={32} />
				</div>

				{showDetail ? (
					<SubmissionDetailPanel onClose={() => setSelectedId("")} />
				) : null}
			</div>

			<p className="text-[11px] text-muted-foreground">
				Note: Estimated payment impact is based on current risk model and may
				change after final reconciliation.
			</p>
		</div>
	);
}
