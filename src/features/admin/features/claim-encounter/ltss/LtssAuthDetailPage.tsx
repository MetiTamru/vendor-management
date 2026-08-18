"use client";

import {
	AlertTriangle,
	ArrowLeft,
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	FilePlus2,
	History,
	Pencil,
	UserRound,
	Users,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	LTSS_LIST_HREF,
	getLtssAuthDetail,
	type AuthDetail,
} from "./auth-detail-data";

const CELL = "px-3 py-2 text-xs";
const HEAD =
	"h-8 bg-muted/30 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";

function Card({
	title,
	action,
	children,
	className,
	bodyClassName,
}: {
	title?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	bodyClassName?: string;
}) {
	return (
		<section
			className={cn(
				"rounded-xl border border-border bg-card shadow-sm",
				className
			)}
		>
			{(title || action) && (
				<div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
					{title ? (
						<h3 className="text-sm font-semibold text-foreground">{title}</h3>
					) : (
						<span />
					)}
					{action}
				</div>
			)}
			<div className={cn("p-4", bodyClassName)}>{children}</div>
		</section>
	);
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="space-y-0.5">
			<p className="text-[11px] text-muted-foreground">{label}</p>
			<div className="text-sm text-foreground">{children}</div>
		</div>
	);
}

function StatusDotLabel({
	label,
	tone = "emerald",
}: {
	label: string;
	tone?: "emerald" | "amber" | "red";
}) {
	return (
		<span className="inline-flex items-center gap-1.5 text-xs">
			<span
				className={cn(
					"size-2 rounded-full",
					tone === "emerald" && "bg-emerald-500",
					tone === "amber" && "bg-amber-500",
					tone === "red" && "bg-red-500"
				)}
			/>
			{label}
		</span>
	);
}

function SummaryStrip({ detail }: { detail: AuthDetail }) {
	const chartData = [
		{ name: "used", value: detail.utilization.utilizationPct, color: "#3b82f6" },
		{
			name: "remaining",
			value: 100 - detail.utilization.utilizationPct,
			color: "#e2e8f0",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
			<Card bodyClassName="p-0">
				<div className="flex items-start gap-3 p-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-700">
						<UserRound className="size-5" aria-hidden />
					</div>
					<div className="min-w-0 space-y-1">
						<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
							Member
						</p>
						<p className="text-base font-semibold">{detail.member.name}</p>
						<p className="text-xs text-muted-foreground">
							Member ID: {detail.member.memberId}
						</p>
						<p className="text-xs text-muted-foreground">
							Plan: {detail.member.plan}
						</p>
						<span className="inline-flex rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
							Eligibility: {detail.member.eligibility}
						</span>
					</div>
				</div>
			</Card>

			<Card bodyClassName="p-0">
				<div className="space-y-2 p-4">
					<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
						Authorization
					</p>
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-base font-semibold text-primary">
							{detail.authNumber}
						</p>
						<span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
							{detail.authorization.status}
						</span>
					</div>
					<p className="text-xs text-muted-foreground">
						Auth Type: {detail.authorization.type}
					</p>
					<p className="text-xs text-muted-foreground">
						Period: {detail.authorization.period}
					</p>
					<p className="text-xs text-muted-foreground">
						Approved On: {detail.authorization.approvedOn}
					</p>
					<p className="text-xs text-muted-foreground">
						Last Updated: {detail.authorization.lastUpdated}
					</p>
				</div>
			</Card>

			<Card bodyClassName="p-0">
				<div className="space-y-2 p-4">
					<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
						Service
					</p>
					<p className="text-base font-semibold text-primary">
						{detail.service.name}
					</p>
					<p className="text-xs text-muted-foreground">
						Service Code: {detail.service.code}
					</p>
					<p className="text-xs text-muted-foreground">
						Modifiers: {detail.service.modifiers}
					</p>
					<p className="text-xs text-muted-foreground">
						Frequency: {detail.service.frequency}
					</p>
					<p className="text-xs text-muted-foreground">
						Place of Service: {detail.service.placeOfService}
					</p>
				</div>
			</Card>

			<Card bodyClassName="p-0">
				<div className="flex items-center gap-3 p-4">
					<div className="min-w-0 flex-1 space-y-1.5">
						<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
							Utilization Summary
						</p>
						<p className="text-xs">
							Authorized Units:{" "}
							<span className="font-semibold tabular-nums">
								{detail.utilization.authorizedUnits}
							</span>
						</p>
						<p className="text-xs">
							Used Units:{" "}
							<span className="font-semibold tabular-nums">
								{detail.utilization.usedUnits}
							</span>
						</p>
						<p className="text-xs">
							Remaining Units:{" "}
							<span className="font-semibold tabular-nums">
								{detail.utilization.remainingUnits}
							</span>
						</p>
					</div>
					<div className="relative h-24 w-24 shrink-0">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={chartData}
									dataKey="value"
									innerRadius={28}
									outerRadius={40}
									startAngle={90}
									endAngle={-270}
									strokeWidth={0}
								>
									{chartData.map((entry) => (
										<Cell key={entry.name} fill={entry.color} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
							<p className="text-sm font-semibold tabular-nums leading-none">
								{detail.utilization.utilizationPct}%
							</p>
							<p className="text-[9px] text-muted-foreground">Utilization</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

export function LtssAuthDetailPage({ authId }: { authId: string }) {
	const detail = getLtssAuthDetail(authId);

	if (!detail) {
		return (
			<div className="space-y-4">
				<ClaimPageHeader
					title="Authorization not found"
					description="The requested authorization could not be located."
					actions={
						<Button variant="outline" size="sm" asChild>
							<Link href={LTSS_LIST_HREF}>
								<ArrowLeft className="mr-1.5 size-3.5" />
								Back to Authorization & Services
							</Link>
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Authorization & Service Detail"
				description="View authorization, service utilization, encounters, and submission history."
				actions={
					<>
						<Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
							<Link href={LTSS_LIST_HREF}>
								<ArrowLeft className="size-3.5" />
								Back to Authorization & Services
							</Link>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="sm" className="h-9 gap-1.5 text-xs">
									Actions
									<ChevronDown className="size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => toast.message("Edit authorization")}>
									Edit authorization
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => toast.message("Export detail")}>
									Export detail
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => toast.message("Add note")}>
									Add note
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				}
			/>

			<SummaryStrip detail={detail} />

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
				<div className="space-y-4">
					<Card
						title="Service Activity / Encounters"
						action={
							<Button
								variant="link"
								className="h-auto p-0 text-xs text-primary"
								onClick={() => toast.message("All encounters")}
							>
								View all encounters ({detail.encounterTotal}) →
							</Button>
						}
					>
						<div className="-mx-4 -mb-4 overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className={HEAD}>Service Date</TableHead>
										<TableHead className={HEAD}>Units</TableHead>
										<TableHead className={HEAD}>Provider</TableHead>
										<TableHead className={HEAD}>Encounter / Claim #</TableHead>
										<TableHead className={HEAD}>Source</TableHead>
										<TableHead className={HEAD}>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{detail.encounters.map((row) => (
										<TableRow key={row.id}>
											<TableCell className={CELL}>{row.serviceDate}</TableCell>
											<TableCell className={cn(CELL, "tabular-nums")}>
												{row.units}
											</TableCell>
											<TableCell className={CELL}>{row.provider}</TableCell>
											<TableCell className={CELL}>{row.claimNumber}</TableCell>
											<TableCell className={CELL}>{row.source}</TableCell>
											<TableCell className={CELL}>
												<StatusDotLabel label={row.status} />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</Card>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Card
							title="Authorization Details"
							action={
								<Button
									variant="outline"
									size="sm"
									className="h-7 gap-1.5 text-xs"
									onClick={() => toast.message("Edit details")}
								>
									<Pencil className="size-3" />
									Edit
								</Button>
							}
						>
							<div className="space-y-3">
								<Meta label="Auth ID">{detail.authNumber}</Meta>
								<Meta label="Type">{detail.authorization.type}</Meta>
								<Meta label="Status">
									<span className="inline-flex rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
										Active
									</span>
								</Meta>
								<Meta label="Effective / End Dates">
									{detail.authorization.period}
								</Meta>
								<Meta label="Authorized By">
									{detail.authorization.authorizedBy}
								</Meta>
								<Meta label="Notes">{detail.authorization.notes}</Meta>
							</div>
						</Card>

						<Card title="Units & Limits">
							<div className="space-y-2.5 text-sm">
								{[
									["Authorized Units", detail.utilization.authorizedUnits],
									["Used Units", detail.utilization.usedUnits],
									["Remaining Units", detail.utilization.remainingUnits],
									["Utilization %", `${detail.utilization.utilizationPct}%`],
									["Unit Type", detail.utilization.unitType],
									["Unit Limit / Day", detail.utilization.unitLimitPerDay],
									["Over Limit Units", detail.utilization.overLimitUnits],
								].map(([label, value]) => (
									<div
										key={String(label)}
										className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0"
									>
										<span className="text-xs text-muted-foreground">{label}</span>
										<span className="font-semibold tabular-nums">{value}</span>
									</div>
								))}
							</div>
						</Card>
					</div>
				</div>

				<div className="space-y-4">
					<Card title="Provider / Vendor Information">
						<div className="space-y-4">
							<div className="space-y-1">
								<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
									Servicing Provider
								</p>
								<p className="text-sm font-semibold">{detail.provider.name}</p>
								<p className="text-xs text-muted-foreground">
									NPI: {detail.provider.npi}
								</p>
								<p className="text-xs text-muted-foreground">
									TIN: {detail.provider.tin}
								</p>
							</div>
							<div className="space-y-1 border-t border-border pt-3">
								<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
									Vendor / Trading Partner
								</p>
								<p className="text-sm font-semibold">{detail.vendor.name}</p>
								<p className="text-xs text-muted-foreground">
									Vendor ID: {detail.vendor.vendorId}
								</p>
								<p className="text-xs text-muted-foreground">
									Submission Method: {detail.vendor.submissionMethod}
								</p>
							</div>
							<Button
								variant="outline"
								className="h-9 w-full gap-1.5 text-xs"
								onClick={() => toast.message("Open provider profile")}
							>
								<Users className="size-3.5" />
								View Provider / Vendor Profile
							</Button>
						</div>
					</Card>

					<Card
						title="Exceptions"
						action={
							<span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
								<AlertTriangle className="size-3" />
								{detail.warningCount} Warning
							</span>
						}
					>
						<ul className="space-y-2.5">
							{detail.exceptions.map((item) => (
								<li
									key={item.label}
									className="flex items-start gap-2 text-xs text-foreground"
								>
									{item.ok ? (
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
									) : (
										<AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-500" />
									)}
									{item.label}
								</li>
							))}
						</ul>
						<Button
							variant="link"
							className="mt-3 h-auto p-0 text-xs text-primary"
							onClick={() => toast.message("All exceptions")}
						>
							View all exceptions →
						</Button>
					</Card>

					<Card
						title="Submission History"
						action={
							<Button
								variant="link"
								className="h-auto p-0 text-xs text-primary"
								onClick={() => toast.message("All submissions")}
							>
								View all submissions →
							</Button>
						}
					>
						<div className="-mx-4 -mb-4 overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className={HEAD}>Submission Date</TableHead>
										<TableHead className={HEAD}>Period</TableHead>
										<TableHead className={HEAD}>File Name</TableHead>
										<TableHead className={HEAD}>Records</TableHead>
										<TableHead className={HEAD}>Status</TableHead>
										<TableHead className={HEAD}>Completeness</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{detail.submissions.map((row) => (
										<TableRow key={row.fileName}>
											<TableCell className={CELL}>{row.date}</TableCell>
											<TableCell className={CELL}>{row.period}</TableCell>
											<TableCell className={CELL}>{row.fileName}</TableCell>
											<TableCell className={cn(CELL, "tabular-nums")}>
												{row.records}
											</TableCell>
											<TableCell className={CELL}>
												<StatusDotLabel label={row.status} />
											</TableCell>
											<TableCell className={cn(CELL, "tabular-nums")}>
												{row.completeness.toFixed(1)}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</Card>

					<Card
						title="Audit / Notes"
						action={
							<Button
								variant="link"
								className="h-auto p-0 text-xs text-primary"
								onClick={() => toast.message("All notes")}
							>
								View all notes
							</Button>
						}
					>
						<div className="-mx-4 -mb-4 overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className={HEAD}>Date / Time</TableHead>
										<TableHead className={HEAD}>User</TableHead>
										<TableHead className={HEAD}>Action / Note</TableHead>
										<TableHead className={HEAD}>Source</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{detail.auditNotes.map((row) => (
										<TableRow key={`${row.at}-${row.action}`}>
											<TableCell className={cn(CELL, "whitespace-nowrap")}>
												{row.at}
											</TableCell>
											<TableCell className={CELL}>{row.user}</TableCell>
											<TableCell className={CELL}>{row.action}</TableCell>
											<TableCell className={CELL}>{row.source}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</Card>
				</div>
			</div>

			<section className="space-y-3">
				<h3 className="text-sm font-semibold">Related Information</h3>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{[
						{
							icon: UserRound,
							title: "View Member",
							subtitle: "Go to member profile",
						},
						{
							icon: CalendarDays,
							title: "View Related Encounters",
							subtitle: `View all encounters (${detail.encounterTotal})`,
						},
						{
							icon: History,
							title: "Authorization History",
							subtitle: "View changes over time",
						},
						{
							icon: FilePlus2,
							title: "Add Note",
							subtitle: "Add internal note",
						},
					].map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.title}
								type="button"
								className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/40"
								onClick={() => toast.message(item.title)}
							>
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700">
									<Icon className="size-4" aria-hidden />
								</span>
								<span>
									<span className="block text-sm font-semibold">{item.title}</span>
									<span className="mt-0.5 block text-xs text-muted-foreground">
										{item.subtitle}
									</span>
								</span>
							</button>
						);
					})}
				</div>
			</section>
		</div>
	);
}
