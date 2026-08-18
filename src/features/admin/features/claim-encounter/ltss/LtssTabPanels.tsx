"use client";

import { useMemo, useState } from "react";

import { Download, Filter, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	LTSS_AUTHORIZATIONS,
	LTSS_EXCEPTIONS,
	LTSS_SUBMISSIONS,
	LTSS_UTILIZATION,
	LTSS_VENDORS,
} from "./feature/queries/useLtssQuery";
import {
	LTSS_TABLE_CELL,
	LTSS_TABLE_HEAD,
	PanelCard,
	PanelLink,
	SortableHead,
	StatusDot,
	StatusPill,
	TableFooterBar,
	TrendHint,
	formatCount,
} from "./LtssShared";
import { LTSS_LIST_HREF } from "./auth-detail-data";

const PAGE_SIZE = 5;

const SUMMARY_HEAD = cn(
	LTSS_TABLE_HEAD,
	"bg-sky-50 uppercase tracking-wide text-sky-900 dark:bg-sky-950/40 dark:text-sky-100"
);

function Toolbar({
	placeholder,
	onRefresh,
}: {
	placeholder: string;
	onRefresh?: () => void;
}) {
	const [q, setQ] = useState("");
	return (
		<div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
			<div className="relative min-w-[12rem] flex-1">
				<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder={placeholder}
					className="h-8 pl-8 text-xs"
				/>
			</div>
			<Button
				variant="outline"
				size="sm"
				className="h-8 gap-1.5 text-xs"
				onClick={() => toast.message("Filters coming soon")}
			>
				<Filter className="size-3.5" />
				Filters
			</Button>
			<Button
				variant="outline"
				size="sm"
				className="h-8 gap-1.5 text-xs"
				onClick={() => toast.success("Export started")}
			>
				<Download className="size-3.5" />
				Export
			</Button>
			<Button
				size="sm"
				className="h-8 gap-1.5 text-xs"
				onClick={() => {
					onRefresh?.();
					toast.success("Refreshed");
				}}
			>
				<RefreshCw className="size-3.5" />
				Refresh
			</Button>
		</div>
	);
}

export function AuthorizationsTab() {
	const [page, setPage] = useState(1);
	const total = 100;
	const pageCount = Math.ceil(total / PAGE_SIZE);
	const rows = useMemo(() => {
		const start =
			((page - 1) % Math.ceil(LTSS_AUTHORIZATIONS.length / PAGE_SIZE)) *
			PAGE_SIZE;
		return LTSS_AUTHORIZATIONS.slice(start, start + PAGE_SIZE);
	}, [page]);

	const from = (page - 1) * PAGE_SIZE + 1;
	const to = Math.min(page * PAGE_SIZE, total);

	return (
		<PanelCard title="Authorization & Services Register">
			<Toolbar placeholder="Search member, service, provider..." />
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={LTSS_TABLE_HEAD}>
								<SortableHead>Member</SortableHead>
							</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>
								<SortableHead>Service</SortableHead>
							</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>
								Authorization Period
							</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>Authorized Units</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>Used Units</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>Remaining Units</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>Status</TableHead>
							<TableHead className={LTSS_TABLE_HEAD}>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id}>
								<TableCell className={cn(LTSS_TABLE_CELL, "font-medium")}>
									{row.member}
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>{row.service}</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "whitespace-nowrap")}>
									{row.period}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.authorizedUnits}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.usedUnits}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.remainingUnits}
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>
									<StatusPill status={row.status} />
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>
									<Button
										variant="link"
										className="h-auto p-0 text-xs text-primary"
										asChild
									>
										<Link href={`${LTSS_LIST_HREF}/${row.id}`}>View</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<TableFooterBar
				from={from}
				to={to}
				total={total}
				page={page}
				pageCount={pageCount}
				onPageChange={setPage}
			/>
		</PanelCard>
	);
}

export function UtilizationTab() {
	return (
		<PanelCard
			title="Utilization Summary"
			action={
				<PanelLink onClick={() => toast.message("Full utilization view")}>
					View full utilization →
				</PanelLink>
			}
		>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={SUMMARY_HEAD}>Service</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Authorized Units
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Used Units
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Utilization %
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								vs Prior 30 Days
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{LTSS_UTILIZATION.map((row) => (
							<TableRow key={row.service}>
								<TableCell className={cn(LTSS_TABLE_CELL, "font-medium")}>
									{row.service}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{formatCount(row.authorized)}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{formatCount(row.used)}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.utilizationPct}%
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>
									<TrendHint pct={row.trendPct} suffix="" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</PanelCard>
	);
}

export function VendorsTab() {
	return (
		<PanelCard
			title="Vendors"
			action={
				<PanelLink onClick={() => toast.message("All vendors view")}>
					View all vendors →
				</PanelLink>
			}
		>
			<div className="border-b border-border px-3 pb-2.5">
				<p className="text-xs font-semibold text-foreground">
					Vendor Performance (LTSS)
				</p>
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={SUMMARY_HEAD}>Vendor</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Expected Files
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Received
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Encounters
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Completeness
							</TableHead>
							<TableHead className={SUMMARY_HEAD}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{LTSS_VENDORS.map((row) => (
							<TableRow key={row.vendor}>
								<TableCell className={cn(LTSS_TABLE_CELL, "font-medium")}>
									{row.vendor}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.expected}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.received}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{formatCount(row.encounters)}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.completenessPct.toFixed(1)}%
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>
									<StatusDot status={row.status} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</PanelCard>
	);
}

export function ExceptionsTab() {
	return (
		<PanelCard
			title="Exceptions"
			action={
				<PanelLink onClick={() => toast.message("All exceptions view")}>
					View all exceptions →
				</PanelLink>
			}
		>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={SUMMARY_HEAD}>Exception Type</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Count
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								vs Prior 30 Days
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{LTSS_EXCEPTIONS.map((row) => (
							<TableRow key={row.type}>
								<TableCell className={cn(LTSS_TABLE_CELL, "font-medium")}>
									{row.type}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.count}
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>
									<TrendHint pct={row.trendPct} suffix="" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</PanelCard>
	);
}

export function SubmissionsTab() {
	return (
		<PanelCard
			title="Submissions"
			action={
				<PanelLink onClick={() => toast.message("All submissions view")}>
					View all submissions →
				</PanelLink>
			}
		>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={SUMMARY_HEAD}>Vendor</TableHead>
							<TableHead className={SUMMARY_HEAD}>Period</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Expected
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Received
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Records
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Accepted
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Rejected
							</TableHead>
							<TableHead className={cn(SUMMARY_HEAD, "text-center")}>
								Completeness
							</TableHead>
							<TableHead className={SUMMARY_HEAD}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{LTSS_SUBMISSIONS.map((row) => (
							<TableRow key={row.vendor}>
								<TableCell className={cn(LTSS_TABLE_CELL, "font-medium")}>
									{row.vendor}
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>{row.period}</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.expected}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.received}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{formatCount(row.records)}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{formatCount(row.accepted)}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{formatCount(row.rejected)}
								</TableCell>
								<TableCell className={cn(LTSS_TABLE_CELL, "tabular-nums")}>
									{row.completenessPct.toFixed(1)}%
								</TableCell>
								<TableCell className={LTSS_TABLE_CELL}>
									<StatusPill status={row.status} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</PanelCard>
	);
}
