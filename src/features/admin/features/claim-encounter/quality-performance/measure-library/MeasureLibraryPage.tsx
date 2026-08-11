"use client";

import { useMemo, useState } from "react";

import {
	ArrowDownRight,
	ArrowUpRight,
	ChevronLeft,
	ChevronRight,
	Eye,
	FileText,
	MoreVertical,
	Search,
} from "lucide-react";

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
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import {
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	MEASURE_LIBRARY_FILTERS,
	MEASURE_LIBRARY_ROWS,
	type MeasureListItem,
} from "@/features/admin/features/claim-encounter/quality-performance/measure-library/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABLE_HEAD = "h-9 bg-muted/30 px-4 text-[11px] font-semibold text-foreground";
const TABLE_CELL = "px-4 py-2.5";

function StatusPill({ status }: { status: MeasureListItem["status"] }) {
	const styles =
		status === "Active"
			? "border-emerald-200 bg-emerald-50 text-emerald-800"
			: "border-border bg-muted text-muted-foreground";
	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, styles)}>{status}</span>
	);
}

function TrendCell({ value }: { value: number }) {
	if (value === 0) {
		return <span className="text-muted-foreground">—</span>;
	}
	const up = value > 0;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 font-medium tabular-nums",
				up ? "text-emerald-700" : "text-red-600"
			)}
		>
			{up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
			{Math.abs(value).toFixed(1)}%
		</span>
	);
}

export function MeasureLibraryPage() {
	const [search, setSearch] = useState("");
	const [measureSet, setMeasureSet] = useState("HEDIS");
	const [statusFilter, setStatusFilter] = useState("All");

	const filteredRows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return MEASURE_LIBRARY_ROWS.filter((row) => {
			if (measureSet !== "All" && row.measureSet !== measureSet) return false;
			if (statusFilter !== "All" && row.status !== statusFilter) return false;
			if (!q) return true;
			return (
				row.id.toLowerCase().includes(q) ||
				row.name.toLowerCase().includes(q)
			);
		});
	}, [search, measureSet, statusFilter]);

	return (
		<div className="space-y-4 pb-4">
			<ClaimPageHeader
				title="Measure Library"
				description="Browse HEDIS and quality measures, review compliance rates, and open measure specifications."
			/>

			<CmsEdgeSectionPanel
				title="1. Measure Selection"
				bodyClassName="p-4"
			>
				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
					<div className="space-y-1.5">
						<p className="text-[11px] font-medium text-muted-foreground">Measurement Year</p>
						<Select defaultValue={MEASURE_LIBRARY_FILTERS.measurementYears[0]}>
							<SelectTrigger className="h-9 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{MEASURE_LIBRARY_FILTERS.measurementYears.map((year) => (
									<SelectItem key={year} value={year} className="text-xs">
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<p className="text-[11px] font-medium text-muted-foreground">Plan</p>
						<Select defaultValue="All Plans">
							<SelectTrigger className="h-9 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{MEASURE_LIBRARY_FILTERS.plans.map((plan) => (
									<SelectItem key={plan} value={plan} className="text-xs">
										{plan}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<p className="text-[11px] font-medium text-muted-foreground">Line of Business</p>
						<Select defaultValue="All">
							<SelectTrigger className="h-9 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{MEASURE_LIBRARY_FILTERS.linesOfBusiness.map((lob) => (
									<SelectItem key={lob} value={lob} className="text-xs">
										{lob}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<p className="text-[11px] font-medium text-muted-foreground">Measure Set</p>
						<Select value={measureSet} onValueChange={setMeasureSet}>
							<SelectTrigger className="h-9 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{MEASURE_LIBRARY_FILTERS.measureSets.map((set) => (
									<SelectItem key={set} value={set} className="text-xs">
										{set}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<p className="text-[11px] font-medium text-muted-foreground">Measure Status</p>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="h-9 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{MEASURE_LIBRARY_FILTERS.measureStatuses.map((status) => (
									<SelectItem key={status} value={status} className="text-xs">
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5 xl:col-span-1">
						<p className="text-[11px] font-medium text-muted-foreground">Search Measure</p>
						<div className="relative">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by measure name or ID..."
								className="h-9 pl-8 text-xs"
							/>
						</div>
					</div>
				</div>
			</CmsEdgeSectionPanel>

			<CmsEdgeSectionPanel title="2. Measures List" bodyClassName="p-0">
				<CmsEdgeTableScroll>
					<Table className={CMS_EDGE_TABLE_CLASS} containerClassName={CMS_EDGE_TABLE_CONTAINER}>
						<TableHeader>
							<TableRow>
								<TableHead className={TABLE_HEAD}>Measure ID</TableHead>
								<TableHead className={TABLE_HEAD}>Measure Name</TableHead>
								<TableHead className={TABLE_HEAD}>Measure Set</TableHead>
								<TableHead className={TABLE_HEAD}>Domain</TableHead>
								<TableHead className={TABLE_HEAD}>Eligible Population</TableHead>
								<TableHead className={TABLE_HEAD}>Status</TableHead>
								<TableHead className={TABLE_HEAD}>Compliance Rate</TableHead>
								<TableHead className={TABLE_HEAD}>vs MY 2024</TableHead>
								<TableHead className={TABLE_HEAD}>Last Calculated</TableHead>
								<TableHead className={cn(TABLE_HEAD, "text-right")}>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredRows.map((row) => (
								<TableRow key={row.id} className="hover:bg-muted/20">
									<TableCell className={cn(TABLE_CELL, "font-mono text-[11px] font-semibold")}>
										{row.id}
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.name}</TableCell>
									<TableCell className={TABLE_CELL}>{row.measureSet}</TableCell>
									<TableCell className={TABLE_CELL}>{row.domain}</TableCell>
									<TableCell className={TABLE_CELL}>{row.eligiblePopulation}</TableCell>
									<TableCell className={TABLE_CELL}>
										<StatusPill status={row.status} />
									</TableCell>
									<TableCell className={cn(TABLE_CELL, "font-semibold tabular-nums")}>
										{row.complianceRate.toFixed(1)}%
									</TableCell>
									<TableCell className={TABLE_CELL}>
										<TrendCell value={row.vsPriorYear} />
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.lastCalculated}</TableCell>
									<TableCell className={cn(TABLE_CELL, "text-right")}>
										<div className="flex items-center justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="size-7"
												asChild
											>
												<Link
													href={`/admin/claim-encounter/regulatory/quality-performance/measure-library/${row.id}`}
													aria-label={`View ${row.id}`}
												>
													<Eye className="size-3.5" />
												</Link>
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
				<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/50 px-5 py-3 text-xs text-muted-foreground">
					<span>
						Showing 1 to {filteredRows.length} of {filteredRows.length} entries
					</span>
					<div className="flex items-center gap-2">
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
						<span className="text-[11px]">Rows per page: 25</span>
					</div>
				</div>
			</CmsEdgeSectionPanel>

			<CmsEdgeSectionPanel
				title="3. Measure Details (Select a measure)"
				bodyClassName="p-10"
			>
				<div className="flex flex-col items-center justify-center gap-3 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<FileText className="size-5 text-muted-foreground" />
					</div>
					<p className="text-sm font-medium text-foreground">
						Select a measure from the list above to view details.
					</p>
					<p className="max-w-lg text-xs leading-relaxed text-muted-foreground">
						Measure details include specifications, performance, gap summary, provider
						performance, and associated activities.
					</p>
				</div>
			</CmsEdgeSectionPanel>
		</div>
	);
}
