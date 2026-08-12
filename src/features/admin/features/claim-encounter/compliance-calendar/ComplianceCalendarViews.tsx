"use client";

import { Button } from "@/components/ui/button";
import {
	CMS_EDGE_STATUS_PILL_CLASS,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	COMPLIANCE_PROGRAM_COLORS,
	COMPLIANCE_PROGRAM_LABELS,
	type CalendarScheduleItem,
	complianceProgramPillClass,
	complianceStatusPillClass,
	getScheduleForWeek,
	getScheduleListGroups,
} from "@/features/admin/features/claim-encounter/compliance-calendar/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function ScheduleChip({ item }: { item: CalendarScheduleItem }) {
	const href = item.obligationId
		? `/admin/claim-encounter/regulatory/compliance-calendar/${item.obligationId}`
		: undefined;
	const color = COMPLIANCE_PROGRAM_COLORS[item.program];

	const content = (
		<div
			className="rounded-md border border-border/50 bg-card px-2 py-1.5 shadow-sm"
			style={{ borderLeftWidth: 3, borderLeftColor: color }}
		>
			<p className="line-clamp-2 text-[10px] font-semibold leading-snug text-foreground">
				{item.title}
			</p>
			<p className="mt-0.5 text-[9px] text-muted-foreground">
				{item.obligationType}
			</p>
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="block transition-opacity hover:opacity-80">
				{content}
			</Link>
		);
	}

	return content;
}

export function ComplianceCalendarWeekView() {
	const weekDays = getScheduleForWeek();

	return (
		<div>
			<div className="grid grid-cols-7 border-b border-border/40 bg-muted/20">
				{weekDays.map((day) => (
					<div
						key={day.dateKey}
						className="border-r border-border/40 px-2 py-2 text-center last:border-r-0"
					>
						<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
							{day.weekday}
						</p>
						<p
							className={cn(
								"mx-auto mt-0.5 inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
								day.isToday && "bg-primary text-primary-foreground",
								!day.isToday && day.inCurrentMonth && "text-foreground",
								!day.inCurrentMonth && "text-muted-foreground/60"
							)}
						>
							{day.day}
						</p>
					</div>
				))}
			</div>
			<div className="grid min-h-[520px] grid-cols-7">
				{weekDays.map((day) => (
					<div
						key={day.dateKey}
						className={cn(
							"flex min-h-[520px] flex-col gap-1.5 border-r border-border/40 p-2 last:border-r-0",
							day.isToday && "bg-primary/5",
							!day.inCurrentMonth && "bg-muted/15"
						)}
					>
						{day.items.length === 0 ? (
							<div className="flex flex-1 items-center justify-center">
								<span className="text-[10px] text-muted-foreground/50">—</span>
							</div>
						) : (
							day.items.map((item) => (
								<ScheduleChip key={item.id} item={item} />
							))
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function ListRow({ item }: { item: CalendarScheduleItem }) {
	const href = item.obligationId
		? `/admin/claim-encounter/regulatory/compliance-calendar/${item.obligationId}`
		: undefined;

	return (
		<div className="flex flex-wrap items-center gap-2 border-b border-border/40 px-4 py-2.5 last:border-b-0 sm:gap-3">
			<span
				className="size-2 shrink-0 rounded-full"
				style={{ backgroundColor: COMPLIANCE_PROGRAM_COLORS[item.program] }}
			/>
			<div className="min-w-0 flex-1">
				{href ? (
					<Link
						href={href}
						className="text-xs font-semibold text-primary hover:underline"
					>
						{item.title}
					</Link>
				) : (
					<p className="text-xs font-semibold text-foreground">{item.title}</p>
				)}
				<p className="text-[10px] text-muted-foreground">
					{COMPLIANCE_PROGRAM_LABELS[item.program]} • {item.obligationType} •{" "}
					{item.owner}
				</p>
			</div>
			<span
				className={cn(
					CMS_EDGE_STATUS_PILL_CLASS,
					complianceProgramPillClass(item.program),
					"shrink-0 text-[10px]"
				)}
			>
				{COMPLIANCE_PROGRAM_LABELS[item.program]}
			</span>
			<span
				className={cn(
					CMS_EDGE_STATUS_PILL_CLASS,
					complianceStatusPillClass(item.status),
					"shrink-0 text-[10px]"
				)}
			>
				{item.status}
			</span>
			<span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
				{item.dueDate}
			</span>
			{href ? (
				<Button
					variant="link"
					size="sm"
					className="h-auto shrink-0 px-0 text-[11px]"
					asChild
				>
					<Link href={href}>View</Link>
				</Button>
			) : null}
		</div>
	);
}

export function ComplianceCalendarListView() {
	const groups = getScheduleListGroups();

	return (
		<CmsEdgeTableScroll className="max-h-[480px]">
			<div className="divide-y divide-border/40">
				{groups.map((group) => (
					<section key={group.key}>
						<div className="sticky top-0 z-10 border-b border-border/40 bg-muted/40 px-4 py-2">
							<p className="text-xs font-semibold text-foreground">
								{group.label}
							</p>
							<p className="text-[10px] text-muted-foreground">
								{group.items.length} obligation
								{group.items.length === 1 ? "" : "s"}
							</p>
						</div>
						{group.items.map((item) => (
							<ListRow key={item.id} item={item} />
						))}
					</section>
				))}
			</div>
		</CmsEdgeTableScroll>
	);
}
