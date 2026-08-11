"use client";

import { type ReactNode } from "react";

import {
	AlertCircle,
	ArrowUpDown,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock3,
	Download,
	Eye,
	FileText,
	type LucideIcon,
	Mail,
} from "lucide-react";
import {
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CMS_EDGE_PAGE_STACK,
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CELL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_HEAD_CLASS,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgePageFooter,
	CmsEdgePairRow,
	CmsEdgeSectionPanel,
	CmsEdgeSplitRow,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	CMS_EDGE_RESPONSES_LIST,
	CMS_EDGE_RESPONSE_KPIS,
	CMS_EDGE_RESPONSE_SELECTED,
	CMS_EDGE_RESPONSE_STATUS_TREND,
	CMS_EDGE_RESPONSE_TYPE_MIX,
	CMS_RESPONSE_STATUS_STYLES,
} from "@/features/admin/features/claim-encounter/cms-edge/mock-data";
import { formatCount } from "@/features/admin/features/claim-encounter/mock-data";
import { cn } from "@/lib/utils";

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

function StatusPill({
	label,
	className,
}: {
	label: string;
	className: string;
}) {
	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, className)}>{label}</span>
	);
}

function SortableHead({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1">
			{children}
			<ArrowUpDown className="size-3 text-muted-foreground/70" />
		</span>
	);
}

function ResponseMetricCard({
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
		<div className="rounded-lg border border-border/70 bg-card p-2.5 shadow-sm">
			<div className="flex items-center gap-2.5">
				<div
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-md",
						tone
					)}
				>
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
						<div className="mt-0.5 truncate text-[10px] text-muted-foreground">
							{hint}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function ResponsesKpiRow() {
	const k = CMS_EDGE_RESPONSE_KPIS;

	return (
		<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			<ResponseMetricCard
				label="Total Responses"
				value={k.total}
				hint="This period"
				icon={FileText}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<ResponseMetricCard
				label="Completed"
				value={k.completed.count}
				hint={`${k.completed.percent.toFixed(2)}%`}
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
			/>
			<ResponseMetricCard
				label="Pending"
				value={k.pending.count}
				hint={`${k.pending.percent.toFixed(2)}%`}
				icon={Clock3}
				tone="text-amber-700 bg-amber-500/10"
			/>
			<ResponseMetricCard
				label="Errors"
				value={k.errors.count}
				hint={`${k.errors.percent.toFixed(2)}%`}
				icon={AlertCircle}
				tone="text-red-700 bg-red-500/10"
			/>
			<ResponseMetricCard
				label="Last Response Received"
				value={<span className="text-xs font-semibold">{k.lastReceived}</span>}
				hint={<PanelLink>View Details</PanelLink>}
				icon={Mail}
				tone="text-violet-700 bg-violet-500/10"
			/>
		</div>
	);
}

function CmsResponsesTable() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="CMS Responses"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			action={
				<div className="flex items-center gap-3">
					<PanelLink>View All</PanelLink>
					<Button
						variant="outline"
						size="sm"
						className="h-8 border-primary/30 text-primary"
						onClick={() => toast.success("Download queued for all responses")}
					>
						<Download className="mr-1.5 size-3.5" />
						Download All
					</Button>
				</div>
			}
			footer={
				<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/50 px-4 py-3 text-xs text-muted-foreground">
					<span>Showing 1 to 8 of 8 entries</span>
					<div className="flex items-center gap-1">
						<Button variant="outline" size="icon" className="size-7" disabled>
							<ChevronLeft className="size-3.5" />
						</Button>
						<Button variant="default" size="icon" className="size-7 text-xs">
							1
						</Button>
						<Button variant="outline" size="icon" className="size-7" disabled>
							<ChevronRight className="size-3.5" />
						</Button>
					</div>
				</div>
			}
		>
			<CmsEdgeTableScroll className="min-h-[300px] flex-1 border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[920px]")}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Response File
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Response Type
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Related Submission
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								<SortableHead>Date Received</SortableHead>
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Status
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
							>
								Records
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4 text-right")}
							>
								Action
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_RESPONSES_LIST.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
										{row.responseFile}
									</Button>
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									{row.responseType}
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
										{row.relatedSubmission}
									</Button>
								</TableCell>
								<TableCell
									className={cn(CMS_EDGE_TABLE_CELL_CLASS, "tabular-nums")}
								>
									{row.dateReceived}
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									<StatusPill
										label={row.status}
										className={CMS_RESPONSE_STATUS_STYLES[row.status]}
									/>
								</TableCell>
								<TableCell
									className={cn(
										CMS_EDGE_TABLE_CELL_CLASS,
										"text-right tabular-nums"
									)}
								>
									{formatCount(row.records)}
								</TableCell>
								<TableCell
									className={cn(CMS_EDGE_TABLE_CELL_CLASS, "pr-4 text-right")}
								>
									<div className="inline-flex items-center gap-0.5">
										<Button
											variant="ghost"
											size="icon"
											className="size-7 text-primary"
											onClick={() => toast.message(`View ${row.responseFile}`)}
										>
											<Eye className="size-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="size-7 text-primary"
											onClick={() =>
												toast.success(`Download ${row.responseFile}`)
											}
										>
											<Download className="size-3.5" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function ResponseDetailsPanel() {
	const d = CMS_EDGE_RESPONSE_SELECTED;

	type DetailRow = { label: string; value: ReactNode };

	const rows: DetailRow[] = [
		{
			label: "Response File",
			value: (
				<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
					{d.responseFile}
				</Button>
			),
		},
		{ label: "Response Type", value: d.responseType },
		{
			label: "Related Submission",
			value: (
				<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
					{d.relatedSubmission}
				</Button>
			),
		},
		{ label: "Date Received", value: d.dateReceived },
		{
			label: "Status",
			value: (
				<StatusPill
					label={d.status}
					className={CMS_RESPONSE_STATUS_STYLES[d.status]}
				/>
			),
		},
		{
			label: "Records",
			value: (
				<span className="font-semibold tabular-nums">
					{formatCount(d.records)}
				</span>
			),
		},
	];

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Response Details"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			action={
				<Button variant="ghost" size="icon" className="size-7 text-primary">
					<ChevronDown className="size-4" />
				</Button>
			}
			footer={
				<div className="mt-auto flex gap-2 border-t border-border/50 px-4 py-3">
					<Button
						size="sm"
						className="h-9 flex-1"
						onClick={() => toast.success("File download queued")}
					>
						<Download className="mr-1.5 size-3.5" />
						Download File
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 flex-1 border-primary/30 text-primary"
					>
						View File Details
					</Button>
				</div>
			}
		>
			<dl className="flex-1 divide-y divide-border/40 border-t border-border/50 px-4 py-1 text-xs">
				{rows.map((row) => (
					<div
						key={row.label}
						className="grid grid-cols-[118px_1fr] items-center gap-3 py-2.5"
					>
						<dt className="font-medium text-muted-foreground">{row.label}</dt>
						<dd className="font-medium text-foreground">{row.value}</dd>
					</div>
				))}
				<div className="py-2.5">
					<p className="mb-2 text-[11px] font-semibold text-foreground">
						File Information
					</p>
					<div className="space-y-2 text-xs">
						<div className="flex justify-between gap-3">
							<span className="text-muted-foreground">File Name</span>
							<span className="truncate font-medium">{d.fileName}</span>
						</div>
						<div className="flex justify-between gap-3">
							<span className="text-muted-foreground">Size</span>
							<span className="font-medium tabular-nums">{d.fileSize}</span>
						</div>
						<div className="flex justify-between gap-3">
							<span className="text-muted-foreground">Format</span>
							<span className="font-medium">{d.fileFormat}</span>
						</div>
					</div>
				</div>
				<div className="py-2.5">
					<p className="mb-1.5 text-[11px] font-semibold text-foreground">
						Description / Notes
					</p>
					<p className="text-xs leading-relaxed text-muted-foreground">
						{d.description}
					</p>
				</div>
			</dl>
		</CmsEdgeSectionPanel>
	);
}

function ResponseTypeLegend({
	items,
}: {
	items: { name: string; color: string; count: number; pct: number }[];
}) {
	return (
		<ul className="grid gap-1.5 text-xs">
			{items.map((item) => (
				<li key={item.name} className="flex items-center justify-between gap-2">
					<span className="flex min-w-0 items-center gap-1.5 font-medium">
						<span
							className="size-2 shrink-0 rounded-full"
							style={{ backgroundColor: item.color }}
						/>
						<span className="truncate">{item.name}</span>
					</span>
					<span className="shrink-0 tabular-nums text-muted-foreground">
						{item.count}
						<span className="ml-1">({item.pct.toFixed(1)}%)</span>
					</span>
				</li>
			))}
		</ul>
	);
}

function ResponseTypeSummaryPanel() {
	const total = CMS_EDGE_RESPONSE_KPIS.total;
	const pieData = CMS_EDGE_RESPONSE_TYPE_MIX.map((item) => ({
		name: item.name,
		value: item.count,
		color: item.color,
	}));

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Response Type Summary (This Period)"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-[220px] flex-1 flex-col border-t border-border/50">
				<div className="relative mx-auto w-full max-w-[168px] flex-1 px-4 pt-4">
					<ResponsiveContainer width="100%" height="100%" minHeight={120}>
						<PieChart>
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="name"
								innerRadius="58%"
								outerRadius="88%"
								paddingAngle={2}
								stroke="none"
								isAnimationActive={false}
							>
								{pieData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4 text-center">
						<p className="text-sm font-bold tabular-nums text-foreground">
							{total}
						</p>
						<p className="text-[10px] text-muted-foreground">Total</p>
					</div>
				</div>
				<div className="shrink-0 px-4 pb-3 pt-1">
					<ResponseTypeLegend items={CMS_EDGE_RESPONSE_TYPE_MIX} />
				</div>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function ResponseStatusTrendPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Response Status Over Time"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="min-h-[220px] flex-1 border-t border-border/50 px-2 py-3">
				<ResponsiveContainer width="100%" height="100%" minHeight={180}>
					<LineChart
						data={CMS_EDGE_RESPONSE_STATUS_TREND}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
						<YAxis tick={{ fontSize: 11 }} width={28} allowDecimals={false} />
						<RechartsTooltip />
						<Legend
							verticalAlign="top"
							align="center"
							iconType="circle"
							iconSize={8}
							wrapperStyle={{ fontSize: 11, paddingBottom: 4 }}
						/>
						<Line
							type="monotone"
							dataKey="completed"
							name="Completed"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
						<Line
							type="monotone"
							dataKey="pending"
							name="Pending"
							stroke="#f59e0b"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
						<Line
							type="monotone"
							dataKey="errors"
							name="Errors"
							stroke="#ef4444"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</CmsEdgeSectionPanel>
	);
}

export function CmsEdgeResponsesTab() {
	return (
		<div className={CMS_EDGE_PAGE_STACK}>
			<ResponsesKpiRow />

			<CmsEdgeSplitRow
				wideMain
				main={<CmsResponsesTable />}
				side={<ResponseDetailsPanel />}
			/>

			<CmsEdgePairRow
				left={<ResponseTypeSummaryPanel />}
				right={<ResponseStatusTrendPanel />}
			/>

			<CmsEdgePageFooter />
		</div>
	);
}
