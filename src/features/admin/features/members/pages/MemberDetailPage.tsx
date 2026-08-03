"use client";

import { useParams } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";

import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	Download,
	Info,
	Mail,
	MapPin,
	Phone,
	Printer,
	UserRound,
} from "lucide-react";
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
import {
	type ClaimStatus,
	type EligibilityStatus,
	type ExceptionStatus,
	type MemberStatus,
	displayName,
	formatCurrency,
	formatDate,
	getMember,
	maskSsn,
} from "@/features/admin/features/members/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS = [
	"Overview",
	"Demographics",
	"Eligibility",
	"Coverage & Plan History",
	"Family / Dependents",
	"Claims & Encounters",
	"Accumulators",
	"Vendor / Source History",
	"Eligibility Exceptions",
] as const;

type Tab = (typeof TABS)[number];

function MemberStatusPill({ status }: { status: MemberStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "active" && "bg-emerald-100 text-emerald-800",
				status === "pending" && "bg-amber-100 text-amber-900",
				status === "inactive" && "bg-slate-100 text-slate-700",
				status === "termed" && "bg-red-100 text-red-800"
			)}
		>
			{status}
		</span>
	);
}

function EligPill({ status }: { status: EligibilityStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "eligible" && "bg-emerald-100 text-emerald-800",
				status === "termed" && "bg-red-100 text-red-800",
				status === "pending" && "bg-amber-100 text-amber-900",
				status === "ineligible" && "bg-slate-100 text-slate-700"
			)}
		>
			{status === "eligible" ? "Eligible" : status}
		</span>
	);
}

function ClaimPill({ status }: { status: ClaimStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "paid" && "bg-emerald-100 text-emerald-800",
				status === "denied" && "bg-red-100 text-red-800",
				status === "pending" && "bg-amber-100 text-amber-900",
				status === "partial" && "bg-sky-100 text-sky-900"
			)}
		>
			{status}
		</span>
	);
}

function ExceptionPill({ status }: { status: ExceptionStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "open" && "bg-red-100 text-red-800",
				status === "in_progress" && "bg-amber-100 text-amber-900",
				status === "resolved" && "bg-emerald-100 text-emerald-800"
			)}
		>
			{status.replace("_", " ")}
		</span>
	);
}

function Panel({
	title,
	action,
	children,
	className,
}: {
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card",
				className
			)}
		>
			<div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
				<h3 className="text-sm font-medium">{title}</h3>
				{action}
			</div>
			<div className="min-h-0 flex-1 p-3">{children}</div>
		</section>
	);
}

function ViewAllLink({
	onClick,
	label = "View all",
}: {
	onClick?: () => void;
	label?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="mt-2 text-xs font-medium text-primary hover:underline"
		>
			{label} →
		</button>
	);
}

export function MemberDetailPage({
	memberId: memberIdProp,
}: {
	memberId?: string;
}) {
	const params = useParams<{ memberId?: string | string[] }>();
	const raw = memberIdProp ?? params.memberId;
	const memberId = decodeURIComponent(
		Array.isArray(raw) ? (raw[0] ?? "") : String(raw ?? "")
	);
	const member = useMemo(
		() => (memberId ? getMember(memberId) : undefined),
		[memberId]
	);
	const [tab, setTab] = useState<Tab>("Overview");
	const [claimsPane, setClaimsPane] = useState<"claims" | "encounters">(
		"claims"
	);

	if (!member) {
		return (
			<div className="space-y-3">
				<p className="text-sm text-destructive">Member not found.</p>
				<Button asChild variant="outline" size="sm">
					<Link href="/admin/members">Back to members</Link>
				</Button>
			</div>
		);
	}

	const name = displayName(member);
	const claimRows = claimsPane === "claims" ? member.claims : member.encounters;

	return (
		<div className="space-y-3">
			{/* Page actions */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-xs text-muted-foreground">
					<span className="text-foreground/70">Members</span>
					<span className="mx-1.5">›</span>
					Member Profile
				</p>
				<div className="flex flex-wrap gap-1.5">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 text-xs">
								Member Summary
								<ChevronDown className="ml-1 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => toast.message("Opening member summary PDF…")}
							>
								One-page summary
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => toast.message("Opening eligibility letter…")}
							>
								Eligibility letter
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => toast.message("Opening coverage card…")}
							>
								Coverage card
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="outline"
						size="sm"
						className="h-8 text-xs"
						onClick={() => toast.success("Print dialog opened")}
					>
						<Printer className="mr-1.5 size-3.5" />
						Print
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" className="h-8 text-xs">
								<Download className="mr-1.5 size-3.5" />
								Export
								<ChevronDown className="ml-1 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => toast.success("Exported CSV")}>
								Export CSV
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => toast.success("Exported PDF")}>
								Export PDF
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Identity header */}
			<section className="rounded-lg border border-border/50 bg-card p-4">
				<div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
					<div className="flex gap-3">
						<div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							<UserRound className="size-7" />
						</div>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2">
								<h1 className="text-xl font-semibold tracking-tight">{name}</h1>
								<MemberStatusPill status={member.status} />
							</div>
							<div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
								<span>
									Member ID:{" "}
									<span className="font-mono text-foreground">
										{member.memberId}
									</span>
								</span>
								<span>
									DOB:{" "}
									<span className="tabular-nums text-foreground">
										{formatDate(member.dob)}
									</span>
								</span>
								<span>
									Gender:{" "}
									<span className="text-foreground">{member.gender}</span>
								</span>
								<span>
									SSN:{" "}
									<span className="font-mono text-foreground">
										{maskSsn(member.ssnLast4)}
									</span>
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-1.5 text-xs">
						<p className="flex items-start gap-2">
							<Phone className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
							<span>{member.phone}</span>
						</p>
						<p className="flex items-start gap-2">
							<Mail className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
							<span className="break-all">{member.email}</span>
						</p>
						<p className="flex items-start gap-2">
							<MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
							<span>
								{member.addressLine1}
								{member.addressLine2 ? `, ${member.addressLine2}` : ""}
								<br />
								{member.city}, {member.state} {member.zip}
							</span>
						</p>
					</div>

					<div className="space-y-2 text-xs">
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
								Current plan
							</p>
							<p className="font-medium text-foreground">{member.planName}</p>
							<p className="text-muted-foreground">
								{member.planType} · {member.program}
							</p>
						</div>
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
								PCP
							</p>
							<p className="font-medium text-foreground">{member.pcpName}</p>
							<p className="font-mono text-muted-foreground">
								NPI {member.pcpNpi}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Tabs */}
			<nav className="overflow-x-auto border-b border-border/50">
				<div className="flex min-w-max gap-0">
					{TABS.map((item) => (
						<button
							key={item}
							type="button"
							onClick={() => setTab(item)}
							className={cn(
								"border-b-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
								tab === item
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							)}
						>
							{item}
						</button>
					))}
				</div>
			</nav>

			{tab === "Overview" ? (
				<div className="space-y-3">
					{/* Top row */}
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						<Panel title="Member Snapshot">
							<dl className="grid grid-cols-2 gap-3 text-xs">
								<div>
									<dt className="text-muted-foreground">Member since</dt>
									<dd className="mt-0.5 font-medium tabular-nums">
										{formatDate(member.memberSince)}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Last claim</dt>
									<dd className="mt-0.5 font-medium tabular-nums">
										{formatDate(member.lastClaimDate)}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Total claims (YTD)</dt>
									<dd className="mt-0.5 text-base font-semibold tabular-nums">
										{member.claimsYtd}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Total paid (YTD)</dt>
									<dd className="mt-0.5 text-base font-semibold tabular-nums">
										{formatCurrency(member.paidYtd)}
									</dd>
								</div>
							</dl>
						</Panel>

						<Panel title="Eligibility Status">
							<div className="flex flex-col items-center justify-center gap-2 py-2 text-center">
								<span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
									<CheckCircle2 className="size-7" />
								</span>
								<p className="text-sm font-semibold capitalize text-emerald-800">
									{member.eligibilityStatus === "eligible"
										? "Eligible"
										: member.eligibilityStatus}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatDate(member.coverageStart)}
									{" – "}
									{member.coverageEnd
										? formatDate(member.coverageEnd)
										: "Present"}
								</p>
							</div>
						</Panel>

						<Panel title="Plan Information">
							<dl className="space-y-2 text-xs">
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Plan ID</dt>
									<dd className="font-mono font-medium">{member.planId}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Type</dt>
									<dd className="font-medium">{member.planType}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">LOB</dt>
									<dd className="font-medium">{member.lob}</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Program</dt>
									<dd className="font-medium">{member.program}</dd>
								</div>
							</dl>
						</Panel>

						<Panel title="Important Alerts">
							{member.alerts.length === 0 ? (
								<p className="text-xs text-muted-foreground">No open alerts.</p>
							) : (
								<ul className="space-y-2">
									{member.alerts.map((a) => (
										<li
											key={a.id}
											className="flex items-start gap-2 rounded-md border border-border/40 bg-background/50 px-2 py-1.5"
										>
											{a.severity === "info" ? (
												<Info className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
											) : (
												<AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
											)}
											<div className="min-w-0 flex-1">
												<p className="text-xs font-medium">{a.title}</p>
												<button
													type="button"
													className="text-[11px] text-primary hover:underline"
													onClick={() => {
														if (a.title.includes("Exception"))
															setTab("Eligibility Exceptions");
														else if (a.title.includes("Claim"))
															setTab("Claims & Encounters");
														else setTab("Eligibility");
													}}
												>
													{a.hrefLabel}
												</button>
											</div>
										</li>
									))}
								</ul>
							)}
						</Panel>
					</div>

					{/* Middle row */}
					<div className="grid gap-3 lg:grid-cols-3">
						<Panel
							title="Eligibility History"
							action={
								<button
									type="button"
									className="text-[11px] text-primary hover:underline"
									onClick={() => setTab("Eligibility")}
								>
									View all
								</button>
							}
						>
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Start</TableHead>
											<TableHead className="h-8 text-[10px]">End</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
											<TableHead className="h-8 text-[10px]">Source</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.eligibilityHistory.slice(0, 4).map((r) => (
											<TableRow key={r.id}>
												<TableCell className="py-1.5 text-[11px] tabular-nums">
													{formatDate(r.startDate)}
												</TableCell>
												<TableCell className="py-1.5 text-[11px] tabular-nums">
													{formatDate(r.endDate)}
												</TableCell>
												<TableCell className="py-1.5">
													<EligPill status={r.status} />
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{r.source}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>

						<Panel
							title="Coverage / Plan History"
							action={
								<button
									type="button"
									className="text-[11px] text-primary hover:underline"
									onClick={() => setTab("Coverage & Plan History")}
								>
									View all
								</button>
							}
						>
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Plan</TableHead>
											<TableHead className="h-8 text-[10px]">Type</TableHead>
											<TableHead className="h-8 text-[10px]">Dates</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.planHistory.map((r) => (
											<TableRow key={r.id}>
												<TableCell className="max-w-[120px] truncate py-1.5 text-[11px] font-medium">
													{r.planName}
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{r.planType}
												</TableCell>
												<TableCell className="py-1.5 text-[11px] tabular-nums">
													{formatDate(r.startDate)} – {formatDate(r.endDate)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>

						<Panel
							title="Family / Dependents"
							action={
								<button
									type="button"
									className="text-[11px] text-primary hover:underline"
									onClick={() => setTab("Family / Dependents")}
								>
									View all
								</button>
							}
						>
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Name</TableHead>
											<TableHead className="h-8 text-[10px]">Rel.</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.dependents.map((d) => (
											<TableRow key={d.id}>
												<TableCell className="py-1.5 text-[11px] font-medium">
													{d.name}
													<p className="text-[10px] font-normal text-muted-foreground">
														{formatDate(d.dob)} · {d.gender}
													</p>
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{d.relationship}
												</TableCell>
												<TableCell className="py-1.5">
													<MemberStatusPill status={d.coverageStatus} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>
					</div>

					{/* Bottom row */}
					<div className="grid gap-3 lg:grid-cols-3">
						<Panel
							title="Recent Claims & Encounters"
							action={
								<button
									type="button"
									className="text-[11px] text-primary hover:underline"
									onClick={() => setTab("Claims & Encounters")}
								>
									View all
								</button>
							}
						>
							<div className="mb-2 flex gap-1">
								{(
									[
										{ id: "claims", label: `Claims (${member.claims.length})` },
										{
											id: "encounters",
											label: `Encounters (${member.encounters.length})`,
										},
									] as const
								).map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() => setClaimsPane(p.id)}
										className={cn(
											"rounded-md px-2 py-1 text-[11px] font-medium",
											claimsPane === p.id
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-muted/50"
										)}
									>
										{p.label}
									</button>
								))}
							</div>
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">DOS</TableHead>
											<TableHead className="h-8 text-[10px]">Claim #</TableHead>
											<TableHead className="h-8 text-[10px]">Type</TableHead>
											<TableHead className="h-8 text-right text-[10px]">
												Paid
											</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{claimRows.slice(0, 5).map((c) => (
											<TableRow key={c.id}>
												<TableCell className="py-1.5 text-[11px] tabular-nums">
													{formatDate(c.dos)}
												</TableCell>
												<TableCell className="py-1.5 font-mono text-[10px]">
													{c.claimNumber}
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{c.type}
												</TableCell>
												<TableCell className="py-1.5 text-right text-[11px] tabular-nums">
													{formatCurrency(c.paid)}
												</TableCell>
												<TableCell className="py-1.5">
													<ClaimPill status={c.status} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>

						<Panel
							title="Accumulators"
							action={
								<button
									type="button"
									className="text-[11px] text-primary hover:underline"
									onClick={() => setTab("Accumulators")}
								>
									View all
								</button>
							}
						>
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Type</TableHead>
											<TableHead className="h-8 text-right text-[10px]">
												Indiv.
											</TableHead>
											<TableHead className="h-8 text-right text-[10px]">
												Family
											</TableHead>
											<TableHead className="h-8 text-right text-[10px]">
												Remain.
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.accumulators.map((a) => (
											<TableRow key={a.id}>
												<TableCell className="py-1.5 text-[11px] font-medium">
													{a.label}
												</TableCell>
												<TableCell className="py-1.5 text-right text-[11px] tabular-nums">
													{formatCurrency(a.individual)}
												</TableCell>
												<TableCell className="py-1.5 text-right text-[11px] tabular-nums">
													{formatCurrency(a.family)}
												</TableCell>
												<TableCell className="py-1.5 text-right text-[11px] tabular-nums">
													{formatCurrency(a.remaining)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>

						<Panel
							title="Vendor / Source History"
							action={
								<button
									type="button"
									className="text-[11px] text-primary hover:underline"
									onClick={() => setTab("Vendor / Source History")}
								>
									View all
								</button>
							}
						>
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Source</TableHead>
											<TableHead className="h-8 text-[10px]">Feed</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.vendorHistory.map((v) => (
											<TableRow key={v.id}>
												<TableCell className="py-1.5 text-[11px] font-medium">
													{v.vendor}
													<p className="text-[10px] font-normal text-muted-foreground">
														{v.lastReceived}
													</p>
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{v.fileFeedType}
												</TableCell>
												<TableCell className="py-1.5">
													<span
														className={cn(
															"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
															v.status === "success" &&
																"bg-emerald-100 text-emerald-800",
															v.status === "warning" &&
																"bg-amber-100 text-amber-900",
															v.status === "failed" && "bg-red-100 text-red-800"
														)}
													>
														{v.status}
													</span>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>
					</div>

					{/* Full-width exceptions */}
					<Panel title="Eligibility Exceptions">
						<div className="-mx-1 overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead>Exception type</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Detected</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Source</TableHead>
										<TableHead>Resolution</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{member.exceptions.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-16 text-center text-muted-foreground"
											>
												No eligibility exceptions for this member.
											</TableCell>
										</TableRow>
									) : (
										member.exceptions.map((ex) => (
											<TableRow key={ex.id}>
												<TableCell className="text-xs font-semibold text-red-700">
													{ex.exceptionType}
												</TableCell>
												<TableCell className="max-w-[220px] text-xs">
													{ex.description}
												</TableCell>
												<TableCell className="text-xs tabular-nums">
													{formatDate(ex.startDetected)}
												</TableCell>
												<TableCell>
													<ExceptionPill status={ex.status} />
												</TableCell>
												<TableCell className="text-xs">{ex.source}</TableCell>
												<TableCell className="max-w-[240px] text-xs text-muted-foreground">
													{ex.resolution}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
						<ViewAllLink onClick={() => setTab("Eligibility Exceptions")} />
					</Panel>
				</div>
			) : (
				<TabBody tab={tab} member={member} />
			)}
		</div>
	);
}

function TabBody({
	tab,
	member,
}: {
	tab: Tab;
	member: NonNullable<ReturnType<typeof getMember>>;
}) {
	if (tab === "Demographics") {
		return (
			<Panel title="Demographics">
				<dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
					{[
						["Full name", displayName(member)],
						["Member ID", member.memberId],
						["Date of birth", formatDate(member.dob)],
						["Gender", member.gender],
						["SSN", maskSsn(member.ssnLast4)],
						["Phone", member.phone],
						["Email", member.email],
						[
							"Address",
							`${member.addressLine1}${member.addressLine2 ? `, ${member.addressLine2}` : ""}, ${member.city}, ${member.state} ${member.zip}`,
						],
						["Program", member.program],
						["Status", member.status],
					].map(([k, v]) => (
						<div
							key={k}
							className="rounded-md border border-border/40 px-3 py-2"
						>
							<dt className="text-[10px] uppercase text-muted-foreground">
								{k}
							</dt>
							<dd className="mt-0.5 text-sm font-medium">{v}</dd>
						</div>
					))}
				</dl>
			</Panel>
		);
	}

	if (tab === "Eligibility") {
		return (
			<Panel title="Eligibility History">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Start</TableHead>
								<TableHead>End</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Source</TableHead>
								<TableHead>Group / Case ID</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{member.eligibilityHistory.map((r) => (
								<TableRow key={r.id}>
									<TableCell className="tabular-nums text-sm">
										{formatDate(r.startDate)}
									</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(r.endDate)}
									</TableCell>
									<TableCell>
										<EligPill status={r.status} />
									</TableCell>
									<TableCell className="text-sm">{r.source}</TableCell>
									<TableCell className="font-mono text-xs">
										{r.groupCaseId}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Coverage & Plan History") {
		return (
			<Panel title="Coverage / Plan History">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Plan name</TableHead>
								<TableHead>Plan type</TableHead>
								<TableHead>Start</TableHead>
								<TableHead>End</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{member.planHistory.map((r) => (
								<TableRow key={r.id}>
									<TableCell className="text-sm font-medium">
										{r.planName}
									</TableCell>
									<TableCell className="text-sm">{r.planType}</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(r.startDate)}
									</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(r.endDate)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Family / Dependents") {
		return (
			<Panel title="Family / Dependents">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Relationship</TableHead>
								<TableHead>DOB</TableHead>
								<TableHead>Gender</TableHead>
								<TableHead>Member ID</TableHead>
								<TableHead>Coverage</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{member.dependents.map((d) => (
								<TableRow key={d.id}>
									<TableCell className="text-sm font-medium">
										{d.name}
									</TableCell>
									<TableCell className="text-sm">{d.relationship}</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(d.dob)}
									</TableCell>
									<TableCell className="text-sm">{d.gender}</TableCell>
									<TableCell className="font-mono text-xs">
										{d.memberId ?? "—"}
									</TableCell>
									<TableCell>
										<MemberStatusPill status={d.coverageStatus} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Claims & Encounters") {
		const all = [...member.claims, ...member.encounters];
		return (
			<Panel title="Claims & Encounters">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>DOS</TableHead>
								<TableHead>Claim #</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Provider</TableHead>
								<TableHead className="text-right">Billed</TableHead>
								<TableHead className="text-right">Paid</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{all.map((c) => (
								<TableRow key={c.id}>
									<TableCell className="tabular-nums text-sm">
										{formatDate(c.dos)}
									</TableCell>
									<TableCell className="font-mono text-xs">
										{c.claimNumber}
									</TableCell>
									<TableCell className="text-sm">{c.type}</TableCell>
									<TableCell className="text-sm">{c.provider}</TableCell>
									<TableCell className="text-right tabular-nums text-sm">
										{formatCurrency(c.billed)}
									</TableCell>
									<TableCell className="text-right tabular-nums text-sm">
										{formatCurrency(c.paid)}
									</TableCell>
									<TableCell>
										<ClaimPill status={c.status} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Accumulators") {
		return (
			<Panel title="Accumulators">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Accumulator</TableHead>
								<TableHead className="text-right">Individual</TableHead>
								<TableHead className="text-right">Family</TableHead>
								<TableHead className="text-right">Limit</TableHead>
								<TableHead className="text-right">Remaining</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{member.accumulators.map((a) => (
								<TableRow key={a.id}>
									<TableCell className="text-sm font-medium">
										{a.label}
									</TableCell>
									<TableCell className="text-right tabular-nums text-sm">
										{formatCurrency(a.individual)}
									</TableCell>
									<TableCell className="text-right tabular-nums text-sm">
										{formatCurrency(a.family)}
									</TableCell>
									<TableCell className="text-right tabular-nums text-sm">
										{formatCurrency(a.limit)}
									</TableCell>
									<TableCell className="text-right tabular-nums text-sm">
										{formatCurrency(a.remaining)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Vendor / Source History") {
		return (
			<Panel title="Vendor / Source History">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Source / Vendor</TableHead>
								<TableHead>File / Feed type</TableHead>
								<TableHead>Last received</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{member.vendorHistory.map((v) => (
								<TableRow key={v.id}>
									<TableCell className="text-sm font-medium">
										{v.vendor}
									</TableCell>
									<TableCell className="text-sm">{v.fileFeedType}</TableCell>
									<TableCell className="tabular-nums text-sm">
										{v.lastReceived}
									</TableCell>
									<TableCell>
										<span
											className={cn(
												"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
												v.status === "success" &&
													"bg-emerald-100 text-emerald-800",
												v.status === "warning" && "bg-amber-100 text-amber-900",
												v.status === "failed" && "bg-red-100 text-red-800"
											)}
										>
											{v.status}
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	return (
		<Panel title="Eligibility Exceptions">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Exception type</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Detected</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Source</TableHead>
							<TableHead>Resolution</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{member.exceptions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-16 text-center text-muted-foreground"
								>
									No eligibility exceptions for this member.
								</TableCell>
							</TableRow>
						) : (
							member.exceptions.map((ex) => (
								<TableRow key={ex.id}>
									<TableCell className="text-sm font-semibold text-red-700">
										{ex.exceptionType}
									</TableCell>
									<TableCell className="text-sm">{ex.description}</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(ex.startDetected)}
									</TableCell>
									<TableCell>
										<ExceptionPill status={ex.status} />
									</TableCell>
									<TableCell className="text-sm">{ex.source}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{ex.resolution}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</Panel>
	);
}
