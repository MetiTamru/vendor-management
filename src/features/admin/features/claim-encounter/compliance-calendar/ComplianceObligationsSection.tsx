"use client";

import {
	ArrowUp,
	CalendarDays,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	COMPLIANCE_OBLIGATIONS,
	COMPLIANCE_PROGRAM_LABELS,
	COMPLIANCE_UPCOMING_DEADLINES,
	complianceProgramPillClass,
	complianceStatusPillClass,
} from "@/features/admin/features/claim-encounter/compliance-calendar/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABLE_HEAD =
	"h-9 whitespace-nowrap bg-muted/30 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL = "whitespace-nowrap px-3 py-2.5 text-xs";

function DeadlineBadge({ tone, label }: { tone: "overdue" | "warning" | "info"; label: string }) {
	const toneClass =
		tone === "overdue"
			? "border-red-200 bg-red-50 text-red-700"
			: tone === "warning"
				? "border-amber-200 bg-amber-50 text-amber-800"
				: "border-sky-200 bg-sky-50 text-sky-800";

	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, toneClass, "shrink-0 text-[10px]")}>
			{label}
		</span>
	);
}

export function ComplianceObligationsSection() {
	const total = 156;

	return (
		<div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
			<CmsEdgeSectionPanel
				title={
					<div className="flex flex-wrap items-baseline gap-2">
						<span>Compliance Obligations</span>
						<span className="text-xs font-normal text-muted-foreground">
							Showing 1 to 10 of {total} obligations
						</span>
					</div>
				}
				bodyClassName="p-0"
				footer={
					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 px-4 py-2.5">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<span>Rows per page:</span>
							<Select defaultValue="10">
								<SelectTrigger className="h-8 w-[68px] bg-card text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="25">25</SelectItem>
									<SelectItem value="50">50</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-xs tabular-nums text-muted-foreground">1–10 of {total}</span>
							<div className="flex items-center gap-0.5">
								<Button variant="outline" size="icon" className="size-8" aria-label="First page">
									<ChevronsLeft className="size-3.5" />
								</Button>
								<Button variant="outline" size="icon" className="size-8" aria-label="Previous page">
									<ChevronLeft className="size-3.5" />
								</Button>
								{[1, 2, 3, 4, 5].map((page) => (
									<Button
										key={page}
										variant={page === 1 ? "default" : "outline"}
										size="icon"
										className="size-8 text-xs"
									>
										{page}
									</Button>
								))}
								<span className="px-1 text-xs text-muted-foreground">…</span>
								<Button variant="outline" size="icon" className="size-8 text-xs">
									16
								</Button>
								<Button variant="outline" size="icon" className="size-8" aria-label="Next page">
									<ChevronRight className="size-3.5" />
								</Button>
								<Button variant="outline" size="icon" className="size-8" aria-label="Last page">
									<ChevronsRight className="size-3.5" />
								</Button>
							</div>
						</div>
					</div>
				}
			>
				<CmsEdgeTableScroll>
					<Table className={CMS_EDGE_TABLE_CLASS} containerClassName={CMS_EDGE_TABLE_CONTAINER}>
						<TableHeader>
							<TableRow>
								<TableHead className={cn(TABLE_HEAD, "min-w-[220px]")}>
									Obligation / Description
								</TableHead>
								<TableHead className={TABLE_HEAD}>Program</TableHead>
								<TableHead className={TABLE_HEAD}>Obligation Type</TableHead>
								<TableHead className={TABLE_HEAD}>Frequency</TableHead>
								<TableHead className={TABLE_HEAD}>
									<span className="inline-flex items-center gap-0.5">
										Due Date
										<ArrowUp className="size-3 text-primary" />
									</span>
								</TableHead>
								<TableHead className={TABLE_HEAD}>Status</TableHead>
								<TableHead className={TABLE_HEAD}>Days to Due / Overdue</TableHead>
								<TableHead className={TABLE_HEAD}>Owner / Assigned To</TableHead>
								<TableHead className={TABLE_HEAD}>Source / Module</TableHead>
								<TableHead className={cn(TABLE_HEAD, "text-right")}>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{COMPLIANCE_OBLIGATIONS.map((row) => (
								<TableRow key={row.id}>
									<TableCell className={cn(TABLE_CELL, "max-w-[240px] font-medium text-foreground")}>
										<Link
											href={`/admin/claim-encounter/regulatory/compliance-calendar/${row.id}`}
											className="text-primary hover:underline"
										>
											{row.title}
										</Link>
									</TableCell>
									<TableCell className={TABLE_CELL}>
										<span
											className={cn(
												CMS_EDGE_STATUS_PILL_CLASS,
												complianceProgramPillClass(row.program)
											)}
										>
											{COMPLIANCE_PROGRAM_LABELS[row.program]}
										</span>
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.obligationType}</TableCell>
									<TableCell className={TABLE_CELL}>{row.frequency}</TableCell>
									<TableCell className={cn(TABLE_CELL, "tabular-nums")}>{row.dueDate}</TableCell>
									<TableCell className={TABLE_CELL}>
										<span
											className={cn(
												CMS_EDGE_STATUS_PILL_CLASS,
												complianceStatusPillClass(row.status)
											)}
										>
											{row.status}
										</span>
									</TableCell>
									<TableCell
										className={cn(
											TABLE_CELL,
											"tabular-nums font-medium",
											row.daysToDue < 0 ? "text-red-600" : "text-foreground"
										)}
									>
										{row.daysToDue}
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.owner}</TableCell>
									<TableCell className={TABLE_CELL}>{row.sourceModule}</TableCell>
									<TableCell className={cn(TABLE_CELL, "text-right")}>
										<div className="inline-flex overflow-hidden rounded-md border border-border/70">
											<Button
												variant="ghost"
												size="sm"
												className="h-7 rounded-none px-2.5 text-xs text-primary"
												asChild
											>
												<Link
													href={`/admin/claim-encounter/regulatory/compliance-calendar/${row.id}`}
												>
													View
												</Link>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="size-7 rounded-none border-l border-border/70"
												aria-label="More actions"
											>
												<ChevronDown className="size-3.5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CmsEdgeTableScroll>
			</CmsEdgeSectionPanel>

			<CmsEdgeSectionPanel
				title={
					<div className="flex w-full items-center justify-between gap-2">
						<span className="text-sm">Upcoming Deadlines (Next 7 Days)</span>
						<Button variant="link" size="sm" className="h-auto px-0 text-xs">
							View All
						</Button>
					</div>
				}
				bodyClassName="p-0"
				footer={
					<div className="border-t border-border/50 p-3">
						<Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
							<CalendarDays className="size-3.5" />
							View Full Calendar
						</Button>
					</div>
				}
			>
				<ul className="divide-y divide-border/40">
					{COMPLIANCE_UPCOMING_DEADLINES.map((item) => (
						<li key={item.id}>
							<Link
								href={`/admin/claim-encounter/regulatory/compliance-calendar/${item.obligationId}`}
								className="flex items-start gap-2.5 px-3 py-3 transition-colors hover:bg-muted/30"
							>
								<div className="flex shrink-0 items-start gap-1.5 pt-0.5">
									<span
										className="mt-1.5 size-2 shrink-0 rounded-full"
										style={{ backgroundColor: item.dotColor }}
									/>
									<div className="text-center leading-tight">
										<p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
											{item.month}
										</p>
										<p className="text-lg font-bold tabular-nums text-foreground">{item.day}</p>
									</div>
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-xs font-semibold leading-snug text-foreground">{item.title}</p>
									<p className="mt-0.5 text-[10px] text-muted-foreground">
										{COMPLIANCE_PROGRAM_LABELS[item.program]} • {item.obligationType}
									</p>
								</div>
								<DeadlineBadge tone={item.badgeTone} label={item.badge} />
							</Link>
						</li>
					))}
				</ul>
			</CmsEdgeSectionPanel>
		</div>
	);
}
