"use client";

import { useState } from "react";

import { Check, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	LTSS_DRILLDOWN_EXAMPLES,
	LTSS_KPI,
	LTSS_KPI_ICONS,
	LTSS_QUALITY_HREF,
	LTSS_TABS,
	type LtssTabId,
} from "./feature/queries/useLtssQuery";
import {
	LTSS_PAGE_STACK,
	LTSS_TAB_TRIGGER_CLASS,
	TrendHint,
	formatCount,
} from "./LtssShared";
import {
	AuthorizationsTab,
	ExceptionsTab,
	SubmissionsTab,
	UtilizationTab,
	VendorsTab,
} from "./LtssTabPanels";

function KpiRow() {
	const MembersIcon = LTSS_KPI_ICONS.members;
	const AuthIcon = LTSS_KPI_ICONS.activeAuthorizations;
	const ServicesIcon = LTSS_KPI_ICONS.servicesDelivered;
	const UnitsIcon = LTSS_KPI_ICONS.unitsAuthorized;
	const ExceptionsIcon = LTSS_KPI_ICONS.exceptions;
	const QualityIcon = LTSS_KPI_ICONS.quality;

	return (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Members
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
							{formatCount(LTSS_KPI.members.value)}
						</p>
						<p className="mt-1.5">
							<TrendHint pct={LTSS_KPI.members.trendPct} />
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-black/5">
						<MembersIcon className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Active Authorizations
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
							{formatCount(LTSS_KPI.activeAuthorizations.value)}
						</p>
						<p className="mt-1.5">
							<TrendHint pct={LTSS_KPI.activeAuthorizations.trendPct} />
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-black/5">
						<AuthIcon className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Services Delivered
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
							{formatCount(LTSS_KPI.servicesDelivered.value)}
						</p>
						<p className="mt-1.5">
							<TrendHint pct={LTSS_KPI.servicesDelivered.trendPct} />
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-black/5">
						<ServicesIcon className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Units Authorized
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
							{formatCount(LTSS_KPI.unitsAuthorized.value)}
						</p>
						<div className="mt-2 space-y-1">
							<div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
								<span>
									Units Used: {formatCount(LTSS_KPI.unitsAuthorized.used)}
								</span>
								<span className="font-medium text-foreground">
									{LTSS_KPI.unitsAuthorized.usedPct}%
								</span>
							</div>
							<Progress
								value={LTSS_KPI.unitsAuthorized.usedPct}
								className="h-1.5"
							/>
						</div>
					</div>
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-black/5">
						<UnitsIcon className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Exceptions
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
							{formatCount(LTSS_KPI.exceptions.value)}
						</p>
						<p className="mt-1.5">
							<TrendHint pct={LTSS_KPI.exceptions.trendPct} />
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10 text-red-700 ring-1 ring-inset ring-black/5">
						<ExceptionsIcon className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex h-full flex-col">
					<div className="flex items-start justify-between gap-2">
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							LTSS Quality Measures
						</p>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700 ring-1 ring-inset ring-black/5">
							<QualityIcon className="size-[18px]" aria-hidden />
						</div>
					</div>
					<p className="mt-2 flex-1 text-xs leading-snug text-muted-foreground">
						View performance on LTSS quality measures in Quality Performance.
					</p>
					<Button asChild size="sm" className="mt-3 h-8 w-full text-xs">
						<Link href={LTSS_QUALITY_HREF}>View LTSS Measures →</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

function ProgramMonitoringSidebar({
	active,
	onSelect,
}: {
	active: LtssTabId;
	onSelect: (id: LtssTabId) => void;
}) {
	return (
		<aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
			<div className="space-y-1 border-b border-border pb-3">
				<h2 className="text-sm font-semibold text-foreground">
					LTSS Program Monitoring
				</h2>
				<p className="text-xs leading-relaxed text-muted-foreground">
					Operational view of LTSS programs, services, vendors, and submissions.
				</p>
			</div>
			<nav className="mt-3 space-y-1">
				{LTSS_TABS.map((tab) => {
					const Icon = tab.icon;
					const selected = active === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onSelect(tab.id)}
							className={cn(
								"flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors",
								selected ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/60"
							)}
						>
							<span
								className={cn(
									"mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
									tab.tone
								)}
							>
								<Icon className="size-4" aria-hidden />
							</span>
							<span className="min-w-0">
								<span
									className={cn(
										"block text-sm font-semibold",
										selected ? "text-primary" : "text-foreground"
									)}
								>
									{tab.label}
								</span>
								<span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
									{tab.description}
								</span>
							</span>
						</button>
					);
				})}
			</nav>
			<div className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
				<Link2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
				<p className="text-[11px] leading-relaxed text-muted-foreground">
					Drill-down links connect operational data to quality measures in
					Quality Performance.
				</p>
			</div>
		</aside>
	);
}

function DrillDownSection() {
	return (
		<section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr_1.1fr] lg:items-center">
				<div className="rounded-lg border border-border bg-muted/20 p-4">
					<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Program Monitoring
					</p>
					<p className="mt-1 text-sm font-semibold text-foreground">
						Operations
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Day-to-day authorizations, utilization, vendors, exceptions, and
						submissions.
					</p>
				</div>

				<div className="flex flex-col items-center justify-center gap-1 px-2 text-center">
					<div className="flex size-14 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 text-primary">
						<Link2 className="size-6" aria-hidden />
					</div>
					<p className="text-[10px] font-bold uppercase tracking-wider text-primary">
						Drill-down Link
					</p>
					<p className="max-w-[11rem] text-[11px] leading-snug text-muted-foreground">
						Click &ldquo;View LTSS Measures&rdquo; to open Quality Performance
						filtered to LTSS measures.
					</p>
				</div>

				<div className="rounded-lg border border-border bg-muted/20 p-4">
					<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Quality Performance
					</p>
					<p className="mt-1 text-sm font-semibold text-foreground">Measures</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Population rates, performance gaps, and measure-level drill-down.
					</p>
				</div>

				<div className="rounded-lg border border-border bg-muted/10 p-4">
					<p className="text-xs font-semibold text-foreground">
						Example Drill-down
					</p>
					<ul className="mt-2 space-y-1.5">
						{LTSS_DRILLDOWN_EXAMPLES.map((item) => (
							<li
								key={item}
								className="flex items-start gap-2 text-xs text-muted-foreground"
							>
								<Check
									className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
									aria-hidden
								/>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}

export function LtssOverviewPage() {
	const [tab, setTab] = useState<LtssTabId>("authorizations");

	return (
		<div className={LTSS_PAGE_STACK}>
			<ClaimPageHeader
				title="LTSS Overview"
				description="Track long-term services and supports operations and performance."
			/>

			<KpiRow />

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_17.5rem]">
				<Tabs
					value={tab}
					onValueChange={(value) => setTab(value as LtssTabId)}
					className="min-w-0 space-y-3"
				>
					<TabsList className="h-auto w-full flex-wrap justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
						{LTSS_TABS.map((item) => {
							const Icon = item.icon;
							return (
								<TabsTrigger
									key={item.id}
									value={item.id}
									className={LTSS_TAB_TRIGGER_CLASS}
								>
									<Icon className="size-3.5" aria-hidden />
									{item.label}
								</TabsTrigger>
							);
						})}
					</TabsList>

					<TabsContent value="authorizations" className="mt-0 outline-none">
						<AuthorizationsTab />
					</TabsContent>
					<TabsContent value="utilization" className="mt-0 outline-none">
						<UtilizationTab />
					</TabsContent>
					<TabsContent value="vendors" className="mt-0 outline-none">
						<VendorsTab />
					</TabsContent>
					<TabsContent value="exceptions" className="mt-0 outline-none">
						<ExceptionsTab />
					</TabsContent>
					<TabsContent value="submissions" className="mt-0 outline-none">
						<SubmissionsTab />
					</TabsContent>
				</Tabs>

				<ProgramMonitoringSidebar active={tab} onSelect={setTab} />
			</div>

			<DrillDownSection />
		</div>
	);
}
