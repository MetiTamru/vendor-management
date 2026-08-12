"use client";

import { useState } from "react";

import { CalendarDays, Download, Search } from "lucide-react";
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
	HCC_37_MEMBERS,
	HCC_SUMMARY_ROWS,
	type HccMemberRow,
	type HccSummaryRow,
} from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";
import {
	RaAllFilterSelect,
	RaCaptureBar,
	RaCountPct,
	RaFilterLabel,
	RaFilterPanel,
	RaPanelLink,
	RaSectionTitle,
	RA_STACK,
	RaStatusPill,
	RaTablePagination,
	RA_TABLE_CELL,
	RA_TABLE_HEAD,
	RaViewAction,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShared";
import { cn } from "@/lib/utils";

function categoryToneClass(tone: HccSummaryRow["categoryTone"]) {
	return {
		purple: "border-violet-200 bg-violet-50 text-violet-800",
		blue: "border-sky-200 bg-sky-50 text-sky-800",
		green: "border-emerald-200 bg-emerald-50 text-emerald-800",
		red: "border-red-200 bg-red-50 text-red-800",
		orange: "border-orange-200 bg-orange-50 text-orange-800",
	}[tone];
}

function memberStatusTone(status: HccMemberRow["status"]) {
	if (status === "Captured") return "success";
	if (status === "Identified") return "warning";
	return "danger";
}

function docStatusTone(status: HccMemberRow["docStatus"]) {
	if (status === "Complete") return "success";
	if (status === "Documentation Issue") return "warning";
	return "danger";
}

function HccFiltersBar() {
	return (
		<RaFilterPanel>
			<div className="grid gap-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))_auto] lg:items-end">
				<div className="space-y-1">
					<RaFilterLabel>Search HCC</RaFilterLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 pl-8 text-xs"
							placeholder="Search HCC or description..."
						/>
					</div>
				</div>
				<RaAllFilterSelect label="HCC Category" />
				<RaAllFilterSelect label="Provider / Group" />
				<RaAllFilterSelect label="Capture Status" />
				<RaAllFilterSelect label="Documentation Status" />
				<RaAllFilterSelect label="RAF Impact" />
				<div className="space-y-1">
					<RaFilterLabel>Date / Service Year</RaFilterLabel>
					<Button
						variant="outline"
						className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal"
					>
						<CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
						01/01/2025 – 12/31/2025
					</Button>
				</div>
			</div>
			<div className="mt-2 flex items-center gap-2">
				<Button size="sm" className="h-8 text-xs" onClick={() => toast.message("Filters applied")}>
					Apply Filters
				</Button>
				<Button variant="link" size="sm" className="h-8 px-0 text-xs text-primary">
					Reset
				</Button>
			</div>
		</RaFilterPanel>
	);
}

function HccSummaryTable({
	rows,
	selectedId,
	onSelect,
}: {
	rows: HccSummaryRow[];
	selectedId: string;
	onSelect: (id: string) => void;
}) {
	return (
		<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<RaSectionTitle
				title="HCC Summary"
				info
				subtitle="Showing 1 to 10 of 126 HCCs"
			/>
			<CmsEdgeTableScroll>
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1100px]")}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={RA_TABLE_HEAD}>HCC Code</TableHead>
							<TableHead className={RA_TABLE_HEAD}>HCC Description</TableHead>
							<TableHead className={RA_TABLE_HEAD}>HCC Category</TableHead>
							<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>Eligible Members</TableHead>
							<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>Captured</TableHead>
							<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>Not Captured</TableHead>
							<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>Documentation Issues</TableHead>
							<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>RAF Impact</TableHead>
							<TableHead className={RA_TABLE_HEAD}>Capture Rate</TableHead>
							<TableHead className={RA_TABLE_HEAD}>Status</TableHead>
							<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row) => (
							<TableRow
								key={row.id}
								className={cn(
									"cursor-pointer border-b border-border/40 hover:bg-muted/20",
									selectedId === row.id && "bg-primary/5"
								)}
								onClick={() => onSelect(row.id)}
							>
								<TableCell className={RA_TABLE_CELL}>
									<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
										{row.code}
									</Button>
								</TableCell>
								<TableCell className={RA_TABLE_CELL}>{row.description}</TableCell>
								<TableCell className={RA_TABLE_CELL}>
									<span
										className={cn(
											"inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium",
											categoryToneClass(row.categoryTone)
										)}
									>
										{row.category}
									</span>
								</TableCell>
								<TableCell className={cn(RA_TABLE_CELL, "text-right tabular-nums")}>
									{row.eligibleMembers.toLocaleString()}
								</TableCell>
								<TableCell className={cn(RA_TABLE_CELL, "text-right")}>
									<RaCountPct count={row.captured} pct={row.capturedPct} tone="success" />
								</TableCell>
								<TableCell className={cn(RA_TABLE_CELL, "text-right")}>
									<RaCountPct count={row.notCaptured} pct={row.notCapturedPct} tone="danger" />
								</TableCell>
								<TableCell className={cn(RA_TABLE_CELL, "text-right")}>
									<RaCountPct count={row.docIssues} pct={row.docIssuesPct} tone="warning" />
								</TableCell>
								<TableCell className={cn(RA_TABLE_CELL, "text-right tabular-nums")}>
									{row.rafImpact.toFixed(3)}
								</TableCell>
								<TableCell className={RA_TABLE_CELL}>
									<RaCaptureBar pct={row.captureRate} />
								</TableCell>
								<TableCell className={RA_TABLE_CELL}>
									<RaStatusPill
										label={row.status}
										tone={row.status === "Active" ? "success" : "warning"}
									/>
								</TableCell>
								<TableCell className={cn(RA_TABLE_CELL, "pr-3 text-right")}>
									<RaViewAction />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
			<div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
				<RaPanelLink>View All HCCs</RaPanelLink>
				<RaTablePagination shown={10} total={126} />
			</div>
		</div>
	);
}

function HccDetailPanel({ hcc }: { hcc: HccSummaryRow }) {
	return (
		<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
				<div className="border-b border-border/50 bg-muted/10 p-3 lg:border-b-0 lg:border-r">
					<h3 className="text-base font-semibold text-foreground">{hcc.code}</h3>
					<p className="mt-0.5 text-xs text-muted-foreground">{hcc.description}</p>
					<span
						className={cn(
							"mt-2 inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium",
							categoryToneClass(hcc.categoryTone)
						)}
					>
						{hcc.category}
					</span>
					<dl className="mt-3 space-y-2 text-xs">
						<div className="flex justify-between gap-2">
							<dt className="text-muted-foreground">Eligible Members</dt>
							<dd className="font-medium tabular-nums">{hcc.eligibleMembers.toLocaleString()}</dd>
						</div>
						<div className="flex justify-between gap-2">
							<dt className="text-muted-foreground">Captured</dt>
							<dd>
								<RaCountPct count={hcc.captured} pct={hcc.capturedPct} tone="success" />
							</dd>
						</div>
						<div className="flex justify-between gap-2">
							<dt className="text-muted-foreground">Not Captured</dt>
							<dd>
								<RaCountPct count={hcc.notCaptured} pct={hcc.notCapturedPct} tone="danger" />
							</dd>
						</div>
						<div className="flex justify-between gap-2">
							<dt className="text-muted-foreground">Documentation Issues</dt>
							<dd>
								<RaCountPct count={hcc.docIssues} pct={hcc.docIssuesPct} tone="warning" />
							</dd>
						</div>
						<div className="flex justify-between gap-2">
							<dt className="text-muted-foreground">RAF Impact</dt>
							<dd className="font-medium tabular-nums">{hcc.rafImpact.toFixed(3)}</dd>
						</div>
						<div className="space-y-1 pt-1">
							<dt className="text-muted-foreground">Capture Rate</dt>
							<dd>
								<RaCaptureBar pct={hcc.captureRate} />
							</dd>
						</div>
					</dl>
				</div>

				<div className="min-w-0">
					<Tabs defaultValue="members">
						<div className="border-b border-border/50 px-3">
							<TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
								{["Members", "Diagnoses", "Documentation", "Providers", "History"].map((tab) => (
									<TabsTrigger
										key={tab}
										value={tab.toLowerCase()}
										className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
									>
										{tab}
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						<TabsContent value="members" className="mt-0">
							<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-3 py-2">
								<div>
									<p className="text-sm font-semibold text-foreground">
										Members Associated with {hcc.code}
									</p>
									<p className="text-xs text-muted-foreground">
										Showing 1 to 10 of {hcc.eligibleMembers.toLocaleString()} members
									</p>
								</div>
								<div className="relative w-full max-w-[200px]">
									<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
									<Input className="h-8 pl-8 text-xs" placeholder="Search members..." />
								</div>
							</div>
							<CmsEdgeTableScroll>
								<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[960px]")}>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className={RA_TABLE_HEAD}>Member ID</TableHead>
											<TableHead className={RA_TABLE_HEAD}>Member Name</TableHead>
											<TableHead className={RA_TABLE_HEAD}>DOB</TableHead>
											<TableHead className={RA_TABLE_HEAD}>Status</TableHead>
											<TableHead className={RA_TABLE_HEAD}>Last Service Date</TableHead>
											<TableHead className={RA_TABLE_HEAD}>Coding Source</TableHead>
											<TableHead className={cn(RA_TABLE_HEAD, "text-right")}>RAF Impact</TableHead>
											<TableHead className={RA_TABLE_HEAD}>Documentation Status</TableHead>
											<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{HCC_37_MEMBERS.map((member) => (
											<TableRow key={member.id} className="border-b border-border/40 hover:bg-muted/20">
												<TableCell className={RA_TABLE_CELL}>
													<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
														{member.memberId}
													</Button>
												</TableCell>
												<TableCell className={RA_TABLE_CELL}>{member.name}</TableCell>
												<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>{member.dob}</TableCell>
												<TableCell className={RA_TABLE_CELL}>
													<RaStatusPill
														label={member.status}
														tone={memberStatusTone(member.status)}
													/>
												</TableCell>
												<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>
													{member.lastServiceDate}
												</TableCell>
												<TableCell className={RA_TABLE_CELL}>{member.codingSource}</TableCell>
												<TableCell className={cn(RA_TABLE_CELL, "text-right tabular-nums")}>
													{member.rafImpact.toFixed(3)}
												</TableCell>
												<TableCell className={RA_TABLE_CELL}>
													<RaStatusPill
														label={member.docStatus}
														tone={docStatusTone(member.docStatus)}
													/>
												</TableCell>
												<TableCell className={cn(RA_TABLE_CELL, "pr-3 text-right")}>
													<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
														{member.action}
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CmsEdgeTableScroll>
							<div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
								<RaPanelLink>View All Members for {hcc.code}</RaPanelLink>
								<Button
									variant="outline"
									size="sm"
									className="h-8 text-xs"
									onClick={() => toast.success("Export queued")}
								>
									<Download className="mr-1.5 size-3.5" />
									Export Members
								</Button>
							</div>
						</TabsContent>

						{["diagnoses", "documentation", "providers", "history"].map((tab) => (
							<TabsContent key={tab} value={tab} className="mt-0 p-6 text-center text-sm text-muted-foreground">
								{tab.charAt(0).toUpperCase() + tab.slice(1)} content for {hcc.code} will appear here.
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
}

export function RiskAdjustmentHccManagementTab() {
	const [selectedId, setSelectedId] = useState(HCC_SUMMARY_ROWS[0]?.id ?? "");
	const selectedHcc = HCC_SUMMARY_ROWS.find((row) => row.id === selectedId) ?? HCC_SUMMARY_ROWS[0];

	return (
		<div className={RA_STACK}>
			<div className="grid gap-2 sm:grid-cols-3">
				<div className="space-y-1">
					<RaFilterLabel>Program</RaFilterLabel>
					<Select defaultValue="medicare-advantage">
						<SelectTrigger className="h-8 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="medicare-advantage">Medicare Advantage</SelectItem>
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
				<div className="space-y-1">
					<RaFilterLabel>Risk Model</RaFilterLabel>
					<Select defaultValue="v28">
						<SelectTrigger className="h-8 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="v28">CMS-HCC V28</SelectItem>
							<SelectItem value="v24">CMS-HCC V24</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<HccFiltersBar />
			<HccSummaryTable
				rows={HCC_SUMMARY_ROWS}
				selectedId={selectedId}
				onSelect={setSelectedId}
			/>
			{selectedHcc ? <HccDetailPanel hcc={selectedHcc} /> : null}
		</div>
	);
}
