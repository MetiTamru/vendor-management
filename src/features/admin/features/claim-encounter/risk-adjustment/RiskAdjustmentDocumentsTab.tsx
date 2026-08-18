"use client";

import { useState } from "react";

import {
	CalendarDays,
	Download,
	FileSpreadsheet,
	FileText,
	FolderOpen,
	Grid3x3,
	List,
	MoreVertical,
	Search,
	Share2,
	Upload,
	X,
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
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
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
	RA_DOCUMENT_DETAIL,
	RA_DOCUMENT_KPIS,
	RA_DOCUMENT_ROWS,
	type RaDocumentRow,
} from "@/features/admin/features/claim-encounter/risk-adjustment/feature/queries/useRiskAdjustmentQuery";
import { cn } from "@/lib/utils";

function FileIcon({ type }: { type: RaDocumentRow["fileType"] }) {
	if (type === "pdf") return <FileText className="size-4 text-red-500" />;
	if (type === "xlsx")
		return <FileSpreadsheet className="size-4 text-emerald-600" />;
	return <FileText className="size-4 text-blue-600" />;
}

function DocumentFilters() {
	return (
		<RaFilterPanel>
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
				<div className="space-y-1 xl:col-span-2">
					<RaFilterLabel>Search Documents</RaFilterLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 pl-8 text-xs"
							placeholder="Search by name, type, tags..."
						/>
					</div>
				</div>
				<RaAllFilterSelect label="Document Type" />
				<RaAllFilterSelect label="Category" />
				<RaAllFilterSelect label="Subcategory" />
			</div>
			<div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-6">
				<RaAllFilterSelect label="Tags" />
				<RaAllFilterSelect label="Program" />
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
				<RaAllFilterSelect label="Uploaded By" />
				<div className="space-y-1">
					<RaFilterLabel>Date Range</RaFilterLabel>
					<Button
						variant="outline"
						className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal"
					>
						<CalendarDays className="size-3.5 text-muted-foreground" />
						01/01/2024 – 12/31/2025
					</Button>
				</div>
				<div className="flex items-end gap-2">
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
			</div>
		</RaFilterPanel>
	);
}

function KpiRow() {
	const k = RA_DOCUMENT_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
			<RaMetricCard
				label="Total Documents"
				value={k.total.toLocaleString()}
				icon={FolderOpen}
				iconClass="bg-sky-500"
			/>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
						<FileText className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Policies & SOPs</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.policies}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.policiesPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white">
						<FileText className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Templates</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.templates}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.templatesPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
						<FileSpreadsheet className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Reports</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.reports}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.reportsPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
						<FileText className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Other Files</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.other}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.otherPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function DocumentDetailPanel({ onClose }: { onClose: () => void }) {
	const d = RA_DOCUMENT_DETAIL;

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="flex items-start justify-between gap-2 border-b border-border/50 px-3 py-2">
				<h3 className="text-sm font-semibold text-foreground">
					Document Details
				</h3>
				<Button
					variant="ghost"
					size="icon"
					className="size-7"
					onClick={onClose}
				>
					<X className="size-4" />
				</Button>
			</div>

			<div className="border-b border-border/50 p-3 text-center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-50">
					<FileText className="size-6 text-red-500" />
				</div>
				<p className="mt-2 text-sm font-medium text-foreground">{d.name}</p>
				<p className="text-xs text-muted-foreground">PDF · {d.size}</p>
				<div className="mt-3 flex justify-center gap-2">
					<Button size="sm" className="h-8 text-xs">
						<Download className="mr-1.5 size-3.5" />
						Download
					</Button>
					<Button variant="outline" size="sm" className="h-8 text-xs">
						<Share2 className="mr-1.5 size-3.5" />
						Share
					</Button>
					<Button variant="outline" size="icon" className="size-8">
						<MoreVertical className="size-3.5" />
					</Button>
				</div>
			</div>

			<Tabs defaultValue="details" className="flex min-h-0 flex-1 flex-col">
				<div className="border-b border-border/50 px-3">
					<TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
						{["Details", "Preview", "Versions", "History"].map((tab) => (
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

				<TabsContent
					value="details"
					className="mt-0 flex-1 overflow-y-auto p-3"
				>
					<dl className="space-y-2 text-xs">
						{[
							["Document Type", d.docType],
							["Category", d.category],
							["Subcategory", d.subcategory],
							["Program", d.program],
							["Measurement Year", d.measurementYear],
						].map(([label, value]) => (
							<div
								key={label}
								className="flex justify-between gap-2 border-b border-border/40 pb-2"
							>
								<dt className="text-muted-foreground">{label}</dt>
								<dd className="font-medium">{value}</dd>
							</div>
						))}
						<div className="border-b border-border/40 pb-2">
							<dt className="text-muted-foreground">Tags</dt>
							<dd className="mt-1 flex flex-wrap gap-1">
								{d.tags.map((tag) => (
									<span
										key={tag}
										className={cn(
											CMS_EDGE_STATUS_PILL_CLASS,
											"border-border bg-muted text-[10px]"
										)}
									>
										{tag}
									</span>
								))}
							</dd>
						</div>
						<div className="border-b border-border/40 pb-2">
							<dt className="text-muted-foreground">Description</dt>
							<dd className="mt-1 leading-relaxed text-foreground">
								{d.description}
							</dd>
						</div>
						{[
							["Uploaded By", d.uploadedBy],
							["Date Uploaded", d.dateUploaded],
							["Last Modified", d.lastModified],
							["Version", d.version],
						].map(([label, value]) => (
							<div
								key={label}
								className="flex justify-between gap-2 border-b border-border/40 pb-2"
							>
								<dt className="text-muted-foreground">{label}</dt>
								<dd className="font-medium">{value}</dd>
							</div>
						))}
						<div className="flex justify-between gap-2 border-b border-border/40 pb-2">
							<dt className="text-muted-foreground">Status</dt>
							<dd>
								<RaStatusPill label={d.status} tone="success" />
							</dd>
						</div>
						<div className="flex justify-between gap-2">
							<dt className="text-muted-foreground">Access</dt>
							<dd className="font-medium">{d.access}</dd>
						</div>
					</dl>
				</TabsContent>

				{["preview", "versions", "history"].map((tab) => (
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
		</div>
	);
}

export function RiskAdjustmentDocumentsTab() {
	const [selectedId, setSelectedId] = useState(RA_DOCUMENT_ROWS[0]?.id ?? "");
	const showDetail = Boolean(selectedId);

	return (
		<div className={RA_STACK}>
			<DocumentFilters />
			<KpiRow />

			<div
				className={cn(
					"grid gap-3",
					showDetail ? "xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]" : ""
				)}
			>
				<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
					<RaSectionTitle
						title="Documents Library"
						subtitle="Showing 1 to 10 of 1,248 documents"
						action={
							<div className="flex items-center gap-2">
								<Select defaultValue="newest">
									<SelectTrigger className="h-7 w-[160px] text-xs">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="newest">
											Date Modified (Newest)
										</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="ghost" size="icon" className="size-7">
									<List className="size-3.5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="size-7 text-muted-foreground"
								>
									<Grid3x3 className="size-3.5" />
								</Button>
							</div>
						}
					/>
					<CmsEdgeTableScroll>
						<Table
							containerClassName={CMS_EDGE_TABLE_CONTAINER}
							className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1000px]")}
						>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className={RA_TABLE_HEAD}>Document Name</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Type</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Category</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Program</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Measurement Year
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Uploaded By</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Date Modified</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Size</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Tags</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{RA_DOCUMENT_ROWS.map((row) => (
									<TableRow
										key={row.id}
										className={cn(
											"cursor-pointer border-b border-border/40 hover:bg-muted/20",
											selectedId === row.id && "bg-primary/5"
										)}
										onClick={() => setSelectedId(row.id)}
									>
										<TableCell className={RA_TABLE_CELL}>
											<span className="flex items-center gap-2">
												<FileIcon type={row.fileType} />
												<span className="font-medium text-primary">
													{row.name}
												</span>
											</span>
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.docType}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.category}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.program}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.measurementYear}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.uploadedBy}
										</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>
											{row.dateModified}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.size}</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<div className="flex flex-wrap gap-1">
												{row.tags.map((tag) => (
													<span
														key={tag}
														className={cn(
															CMS_EDGE_STATUS_PILL_CLASS,
															"border-border bg-muted text-[10px]"
														)}
													>
														{tag}
													</span>
												))}
											</div>
										</TableCell>
										<TableCell
											className={cn(RA_TABLE_CELL, "pr-3 text-right")}
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex justify-end gap-1">
												<Button
													variant="ghost"
													size="icon"
													className="size-7 text-primary"
												>
													<Download className="size-3.5" />
												</Button>
												<Button variant="ghost" size="icon" className="size-7">
													<MoreVertical className="size-3.5" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
					<RaTablePagination shown={10} total={1_248} />
				</div>

				{showDetail ? (
					<DocumentDetailPanel onClose={() => setSelectedId("")} />
				) : null}
			</div>
		</div>
	);
}

export function RiskAdjustmentDocumentsHeaderAction() {
	return (
		<Button
			variant="outline"
			size="sm"
			className="h-8"
			onClick={() => toast.success("Upload dialog opened")}
		>
			<Upload className="mr-1.5 size-3.5" />
			Upload Document
		</Button>
	);
}
