"use client";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import type { TpaTpvRow } from "../work-queue-types";
import {
	analystAvatarTone,
	analystInitials,
	type AnalystProgressRow,
	type EscalationStatus,
	type EscalationSummary,
	ESCALATION_STATUS_LABEL,
	listEscalationItems,
	summarizeAnalystProgress,
	summarizeEscalations,
} from "../work-queue-analyst-escalation";

const PANEL =
	"overflow-hidden rounded-sm border border-border/60 bg-card shadow-[0_1px_3px_rgba(15,23,42,0.07),0_4px_12px_rgba(15,23,42,0.04)]";

function AnalystAvatar({ name }: { name: string }) {
	const initials = analystInitials(name);
	return (
		<span
			className={cn(
				"inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1",
				analystAvatarTone(name)
			)}
		>
			{initials}
		</span>
	);
}

function pctCell(
	value: number,
	pct: number,
	tone: "green" | "orange" | "red" | "muted"
) {
	const pctTone = {
		green: "text-emerald-600 dark:text-emerald-400",
		orange: "text-orange-600 dark:text-orange-400",
		red: "text-red-600 dark:text-red-400",
		muted: "text-muted-foreground",
	}[tone];

	return (
		<span className="tabular-nums">
			{value}{" "}
			<span className={cn("font-semibold", pctTone)}>({pct}%)</span>
		</span>
	);
}

export function EdiAnalystProgressSection({
	rows,
	activeAnalyst,
	statusEstimated = false,
	onAnalystSelect,
}: {
	rows: TpaTpvRow[];
	activeAnalyst: string;
	statusEstimated?: boolean;
	onAnalystSelect: (analyst: string) => void;
}) {
	const analysts: AnalystProgressRow[] = summarizeAnalystProgress(rows);

	return (
		<section className={PANEL}>
			<div className="border-b border-border/50 bg-muted/20 px-4 py-3">
				<h2 className="text-sm font-semibold text-foreground">
					EDI Analyst Progress
				</h2>
				<p className="mt-0.5 text-xs text-muted-foreground">
					Assigned workload and completion by analyst.
					{statusEstimated ? (
						<span className="mt-1 block text-[11px] italic">
							SFTP/EDI completion estimated from migration status until
							progress tracking is live.
						</span>
					) : null}
				</p>
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/30 hover:bg-muted/30">
							<TableHead className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
								Analyst
							</TableHead>
							<TableHead className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
								Assigned
							</TableHead>
							<TableHead className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
								SFTP Complete
							</TableHead>
							<TableHead className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
								EDI Complete
							</TableHead>
							<TableHead className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
								In Progress
							</TableHead>
							<TableHead className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
								Blocked / Escalated
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{analysts.map((row) => {
							const isUnassigned = row.analyst === "Unassigned";
							const selected = activeAnalyst === row.analyst;
							return (
								<TableRow
									key={row.analyst}
									className={cn(
										"transition-colors",
										!isUnassigned && "cursor-pointer hover:bg-primary/5",
										selected && "bg-primary/8"
									)}
									onClick={() => {
										if (isUnassigned) return;
										onAnalystSelect(
											selected ? "all" : row.analyst
										);
									}}
								>
									<TableCell className="text-sm font-medium">
										<span className="flex items-center gap-2">
											<AnalystAvatar name={row.analyst} />
											{row.analyst}
										</span>
									</TableCell>
									<TableCell className="text-sm font-semibold tabular-nums">
										{isUnassigned ? "—" : row.assigned}
									</TableCell>
									<TableCell className="text-sm">
										{isUnassigned
											? "—"
											: pctCell(row.sftpComplete, row.sftpPct, "green")}
									</TableCell>
									<TableCell className="text-sm">
										{isUnassigned
											? "—"
											: pctCell(row.ediComplete, row.ediPct, "green")}
									</TableCell>
									<TableCell className="text-sm">
										{isUnassigned
											? "—"
											: pctCell(row.inProgress, row.inProgressPct, "orange")}
									</TableCell>
									<TableCell className="text-sm">
										{isUnassigned
											? "—"
											: pctCell(
													row.blockedEscalated,
													row.blockedPct,
													row.blockedEscalated > 0 ? "red" : "muted"
												)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
			<div className="border-t border-border/50 px-4 py-2.5">
				<button
					type="button"
					className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
					onClick={() => onAnalystSelect("all")}
				>
					View all analysts
					<ChevronRight className="size-3.5" />
				</button>
			</div>
		</section>
	);
}

const ESCALATION_CARDS: {
	key: keyof EscalationSummary;
	title: string;
	note: string;
	border: string;
	bg: string;
	count: string;
}[] = [
	{
		key: "escalation_required",
		title: "Escalation Required",
		note: "No response after second contact.",
		border: "border-l-red-500",
		bg: "bg-red-50/80 dark:bg-red-950/20",
		count: "text-red-700 dark:text-red-300",
	},
	{
		key: "attention",
		title: "Attention",
		note: "At risk of escalation (approaching threshold).",
		border: "border-l-orange-500",
		bg: "bg-orange-50/80 dark:bg-orange-950/20",
		count: "text-orange-700 dark:text-orange-300",
	},
	{
		key: "escalated",
		title: "Escalated",
		note: "Escalated to senior team / management.",
		border: "border-l-sky-500",
		bg: "bg-sky-50/80 dark:bg-sky-950/20",
		count: "text-sky-700 dark:text-sky-300",
	},
	{
		key: "resolved",
		title: "Resolved",
		note: "Resolved (blocker cleared).",
		border: "border-l-emerald-500",
		bg: "bg-emerald-50/80 dark:bg-emerald-950/20",
		count: "text-emerald-700 dark:text-emerald-300",
	},
];

function EscalationManagementList({
	rows,
	filter,
}: {
	rows: TpaTpvRow[];
	filter: EscalationStatus;
}) {
	const items = listEscalationItems(rows, filter);
	if (!items.length) {
		return (
			<p className="px-4 py-3 text-xs text-muted-foreground">
				No {ESCALATION_STATUS_LABEL[filter].toLowerCase()} items.
			</p>
		);
	}

	return (
		<div className="overflow-x-auto border-t border-border/50">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/20 hover:bg-muted/20">
						<TableHead className="text-[10px] font-bold uppercase">
							TPA/TPV
						</TableHead>
						<TableHead className="text-[10px] font-bold uppercase">
							Analyst
						</TableHead>
						<TableHead className="text-[10px] font-bold uppercase">
							Reason
						</TableHead>
						<TableHead className="text-[10px] font-bold uppercase">
							Status
						</TableHead>
						<TableHead className="text-[10px] font-bold uppercase">
							Last update
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TableRow key={item.id}>
							<TableCell className="text-xs">
								<Link
									href={`/admin/my-work-queue/${item.id}`}
									className="font-medium text-primary hover:underline"
								>
									{item.name}
								</Link>
								<p className="text-[10px] text-muted-foreground">
									{item.code}
								</p>
							</TableCell>
							<TableCell className="text-xs">{item.assignedAnalyst}</TableCell>
							<TableCell
								className="max-w-[180px] truncate text-xs text-muted-foreground"
								title={item.reason}
							>
								{item.reason}
							</TableCell>
							<TableCell>
								<EscalationStatusPill status={item.status} />
							</TableCell>
							<TableCell className="whitespace-nowrap text-xs text-muted-foreground">
								{item.lastUpdated}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export function EscalationSummarySection({
	rows,
	activeFilter,
	onFilterChange,
}: {
	rows: TpaTpvRow[];
	activeFilter: EscalationStatus | "all";
	onFilterChange: (status: EscalationStatus | "all") => void;
}) {
	const summary = summarizeEscalations(rows);

	return (
		<section className={PANEL}>
			<div className="border-b border-border/50 bg-muted/20 px-4 py-3">
				<h2 className="text-sm font-semibold text-foreground">
					Escalation Summary
				</h2>
			</div>
			<div className="grid gap-3 p-4 sm:grid-cols-2">
				{ESCALATION_CARDS.map((card) => {
					const active = activeFilter === card.key;
					return (
						<div
							key={card.key}
							className={cn(
								"rounded-md border border-border/60 border-l-4 p-3 shadow-sm",
								card.border,
								card.bg,
								active && "ring-2 ring-primary/30"
							)}
						>
							<p className="text-[11px] font-bold uppercase tracking-wide text-foreground/80">
								{card.title}
							</p>
							<p
								className={cn(
									"mt-1.5 text-3xl font-bold tabular-nums",
									card.count
								)}
							>
								{summary[card.key]}
							</p>
							<p className="mt-1 text-[11px] leading-snug text-muted-foreground">
								{card.note}
							</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-3 h-7 border-border/80 bg-background/90 text-xs shadow-none"
								onClick={() =>
									onFilterChange(active ? "all" : card.key)
								}
							>
								View list
							</Button>
						</div>
					);
				})}
			</div>
			{activeFilter !== "all" ? (
				<EscalationManagementList rows={rows} filter={activeFilter} />
			) : null}
		</section>
	);
}

export function EscalationStatusPill({
	status,
}: {
	status: EscalationStatus;
}) {
	if (status === "none") {
		return <span className="text-muted-foreground">—</span>;
	}

	const styles: Record<Exclude<EscalationStatus, "none">, string> = {
		escalation_required:
			"bg-red-500/15 text-red-800 ring-1 ring-red-500/20 dark:text-red-300",
		attention:
			"bg-orange-500/15 text-orange-900 ring-1 ring-orange-500/20 dark:text-orange-200",
		escalated:
			"bg-sky-500/15 text-sky-900 ring-1 ring-sky-500/20 dark:text-sky-300",
		resolved:
			"bg-emerald-500/15 text-emerald-900 ring-1 ring-emerald-500/20 dark:text-emerald-300",
	};

	return (
		<span
			className={cn(
				"inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-semibold",
				styles[status]
			)}
			title={ESCALATION_STATUS_LABEL[status]}
		>
			{ESCALATION_STATUS_LABEL[status]}
		</span>
	);
}
