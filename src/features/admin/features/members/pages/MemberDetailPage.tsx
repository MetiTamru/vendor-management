"use client";

import { useParams } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";

import {
	BadgeCheck,
	Building2,
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	Download,
	Eye,
	EyeOff,
	History,
	Languages,
	Mail,
	MapPin,
	Phone,
	Printer,
	ShieldAlert,
	ShieldCheck,
	UserRound,
	Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import { VendorCoreLoadingRow } from "@/components/vendor-core/VendorCoreLiveChrome";
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
	memberAge,
} from "@/features/admin/features/members/feature/api/membersApi";
import { useMemberDetailQuery } from "@/features/admin/features/members/feature/queries/useMembersQuery";
import {
	MemberAccumulatorRowActions,
	MemberChangeEventsPanel,
	MemberClaimRowActions,
	MemberCreateAccumulatorButton,
	MemberCreateClaimButton,
	MemberCreateExceptionButton,
	MemberExceptionRowActions,
	MemberProfileActions,
	MemberSourceRecordViewer,
	useMemberTabData,
} from "@/features/admin/features/members/pages/member-detail-actions";
import {
	downloadMemberDetailCsv,
	downloadMemberDetailPdf,
	openMemberDocumentPdf,
	printMemberProfile,
} from "@/features/admin/features/members/pages/member-detail-export-actions";
import { MemberFamilyEditor } from "@/features/admin/features/members/pages/member-family-editor";
import { MemberEditPanel } from "@/features/admin/features/members/pages/member-write-form";
import { Link } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
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
	"Change Events",
] as const;

type Tab = "Edit" | (typeof TABS)[number];

function statusPillClass(positive: boolean, negative: boolean) {
	if (positive) return "border-chart-2/20 bg-chart-2/10 text-chart-2";
	if (negative)
		return "border-destructive/20 bg-destructive/10 text-destructive";
	return "border-border/60 bg-muted text-muted-foreground";
}

function MemberStatusPill({ status }: { status: MemberStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				statusPillClass(status === "active", status === "termed")
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
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				statusPillClass(
					status === "eligible",
					status === "termed" || status === "ineligible"
				)
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
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				statusPillClass(status === "paid", status === "denied")
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
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				statusPillClass(status === "resolved", status === "open")
			)}
		>
			{status.replace("_", " ")}
		</span>
	);
}

/** Sharp, elegant member profile UI system */
const MEMBER_UI = {
	radius: "rounded-md",
	radiusSm: "rounded-sm",
	surface:
		"overflow-hidden border border-border/70 bg-card shadow-[0_1px_0_0_rgba(15,23,42,0.05)]",
	label:
		"text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
	labelAccent:
		"text-[9px] font-semibold uppercase tracking-[0.12em] text-primary/85",
	title: "text-[13px] font-semibold tracking-tight text-foreground",
} as const;

function SurfaceTopAccent() {
	return (
		<div
			className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/35 to-transparent"
			aria-hidden
		/>
	);
}

function OverviewCard({
	title,
	icon: Icon,
	iconTone = "primary",
	action,
	children,
	className,
}: {
	title: string;
	icon: typeof ShieldCheck;
	iconTone?: "primary" | "chart-2" | "chart-3" | "chart-5";
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	const iconClass = {
		primary: "bg-primary/10 text-primary border-primary/15",
		"chart-2": "bg-chart-2/10 text-chart-2 border-chart-2/15",
		"chart-3": "bg-chart-3/10 text-chart-3 border-chart-3/15",
		"chart-5": "bg-chart-5/10 text-chart-5 border-chart-5/15",
	}[iconTone];

	return (
		<section
			className={cn(
				"relative flex flex-col",
				MEMBER_UI.surface,
				MEMBER_UI.radius,
				className
			)}
		>
			<SurfaceTopAccent />
			<div className="flex items-center gap-2 border-b border-border/35 bg-muted/[0.12] px-3.5 py-2.5">
				<span
					className={cn(
						"flex size-7 shrink-0 items-center justify-center border",
						MEMBER_UI.radiusSm,
						iconClass
					)}
				>
					<Icon className="size-3.5" strokeWidth={2.25} />
				</span>
				<h3 className={cn("min-w-0 flex-1", MEMBER_UI.title)}>{title}</h3>
				{action}
			</div>
			<div className="min-h-0 flex-1 px-3.5 py-1">{children}</div>
		</section>
	);
}

function Panel({
	title,
	icon: Icon,
	action,
	children,
	className,
	dense,
}: {
	title: string;
	icon?: typeof ShieldCheck;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	dense?: boolean;
}) {
	return (
		<section
			className={cn(
				"relative flex flex-col",
				MEMBER_UI.surface,
				MEMBER_UI.radius,
				className
			)}
		>
			<SurfaceTopAccent />
			<div
				className={cn(
					"flex items-center gap-2 border-b border-border/35 bg-muted/[0.12]",
					dense ? "px-3.5 py-2" : "px-4 py-2.5"
				)}
			>
				{Icon ? (
					<span
						className={cn(
							"flex size-7 shrink-0 items-center justify-center border border-primary/15 bg-primary/10 text-primary",
							MEMBER_UI.radiusSm
						)}
					>
						<Icon className="size-3.5" strokeWidth={2.25} />
					</span>
				) : null}
				<h3 className={cn("min-w-0 flex-1", MEMBER_UI.title)}>{title}</h3>
				{action}
			</div>
			<div className={cn("min-h-0 flex-1", dense ? "p-3.5" : "p-4")}>
				{children}
			</div>
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
			className="mt-3 text-sm font-medium text-primary hover:underline"
		>
			{label} →
		</button>
	);
}

function MetaField({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="min-w-0 space-y-1">
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			<div className="text-sm font-medium text-foreground break-words">
				{value ?? "—"}
			</div>
		</div>
	);
}

function OverviewRow({
	label,
	value,
	valueClassName,
}: {
	label: string;
	value: ReactNode;
	valueClassName?: string;
}) {
	return (
		<div className="group flex items-center justify-between gap-3 border-b border-border/25 py-2 transition-colors last:border-b-0 hover:bg-muted/[0.08]">
			<span className="shrink-0 pl-0.5 text-[11px] leading-tight text-muted-foreground transition-colors group-hover:text-foreground/70">
				{label}
			</span>
			<span
				className={cn(
					"min-w-0 pr-0.5 text-right text-xs leading-tight font-semibold text-foreground",
					valueClassName
				)}
			>
				{value ?? "—"}
			</span>
		</div>
	);
}

function ActiveBadge({ label = "Active" }: { label?: string }) {
	return (
		<span className="inline-flex rounded-sm border border-chart-2/20 bg-chart-2/10 px-1.5 py-px text-[9px] font-bold tracking-wide text-chart-2 uppercase">
			{label}
		</span>
	);
}

function ProfileStatusBadge({ status }: { status: MemberStatus }) {
	const label =
		status === "active"
			? "Active"
			: status === "pending"
				? "Pending"
				: status === "inactive"
					? "Inactive"
					: "Termed";

	return (
		<span
			className={cn(
				"inline-flex rounded-sm border px-1.5 py-px text-[9px] font-bold tracking-wide uppercase",
				status === "active" && "border-chart-2/20 bg-chart-2/10 text-chart-2",
				status === "pending" && "border-chart-3/20 bg-chart-3/10 text-chart-3",
				status === "inactive" &&
					"border-border/60 bg-muted text-muted-foreground",
				status === "termed" &&
					"border-destructive/20 bg-destructive/10 text-destructive"
			)}
		>
			{label}
		</span>
	);
}

function TruncateCell({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const text = typeof children === "string" ? children : undefined;
	return (
		<TableCell
			className={cn("max-w-0 overflow-hidden text-sm", className)}
			title={text}
		>
			<span className="block truncate">{children}</span>
		</TableCell>
	);
}

function HeaderField({
	label,
	value,
	accent,
	mono,
}: {
	label: string;
	value: ReactNode;
	accent?: boolean;
	mono?: boolean;
}) {
	return (
		<div className="min-w-0 space-y-1">
			<p className={accent ? MEMBER_UI.labelAccent : MEMBER_UI.label}>
				{label}
			</p>
			<div
				className={cn(
					"text-[13px] font-semibold leading-tight",
					accent ? "text-primary" : "text-foreground",
					mono && "font-mono text-xs tabular-nums tracking-tight"
				)}
			>
				{value ?? "—"}
			</div>
		</div>
	);
}

const METRIC_DOT_TONES = [
	"bg-chart-3",
	"bg-primary",
	"bg-chart-5",
	"bg-chart-4",
	"bg-chart-2",
	"bg-primary/70",
	"bg-chart-5/80",
] as const;

function MetricStrip({
	title,
	items,
	compact,
	embedded,
	className,
}: {
	title?: string;
	items: Array<{
		label: string;
		value: ReactNode;
		accent?: boolean;
		mono?: boolean;
		sub?: ReactNode;
	}>;
	compact?: boolean;
	embedded?: boolean;
	className?: string;
}) {
	return (
		<section
			className={cn(
				!embedded && cn("relative", MEMBER_UI.surface, MEMBER_UI.radius),
				className
			)}
		>
			{!embedded ? <SurfaceTopAccent /> : null}
			{title ? (
				<div className="border-b border-border/35 px-4 py-2 sm:px-5">
					<p className={MEMBER_UI.label}>{title}</p>
				</div>
			) : null}
			<div className="flex w-full overflow-x-auto lg:overflow-visible">
				<div className="flex min-w-max flex-1 lg:min-w-0">
					{items.map((item, index) => (
						<div
							key={item.label}
							className={cn(
								"min-w-0 flex-1 transition-colors hover:bg-muted/[0.14]",
								compact
									? "min-w-[6.75rem] px-3 py-2.5 sm:min-w-[7.5rem] sm:px-4"
									: "min-w-[7.5rem] px-4 py-3 sm:px-5",
								index > 0 && "border-l border-border/30"
							)}
						>
							<div className="flex items-center gap-1">
								<span
									className={cn(
										"size-1 shrink-0 rounded-full",
										METRIC_DOT_TONES[index % METRIC_DOT_TONES.length]
									)}
								/>
								<p className={MEMBER_UI.label}>{item.label}</p>
							</div>
							<div
								className={cn(
									"mt-1 truncate text-xs font-semibold",
									item.mono &&
										"font-mono text-[11px] tabular-nums tracking-tight",
									item.accent ? "text-primary" : "text-foreground"
								)}
							>
								{item.value ?? "—"}
							</div>
							{item.sub ? (
								<p className="mt-0.5 truncate text-[10px] leading-tight text-muted-foreground">
									{item.sub}
								</p>
							) : null}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function TableScroll({
	children,
	minWidthClassName = "min-w-[52rem]",
}: {
	children: ReactNode;
	minWidthClassName?: string;
}) {
	return (
		<ScrollArea className="w-full">
			<div className={minWidthClassName}>{children}</div>
		</ScrollArea>
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
	const useApi = !isMockEnabled();
	const detailQuery = useMemberDetailQuery(memberId, useApi);
	const mockMember = useMemo(
		() => (!useApi && memberId ? getMember(memberId) : undefined),
		[useApi, memberId]
	);
	const member = useApi ? detailQuery.data : mockMember;
	const [tab, setTab] = useState<Tab>("Overview");
	const [claimsPane, setClaimsPane] = useState<"claims" | "encounters">(
		"claims"
	);
	const [showSsn, setShowSsn] = useState(false);

	const body = (() => {
		if (useApi && detailQuery.isLoading && !detailQuery.data) {
			return <VendorCoreLoadingRow label="Loading member…" />;
		}
		if (useApi && detailQuery.error) {
			return (
				<div className="space-y-4">
					<p className="text-sm text-destructive">
						{detailQuery.error.message}
					</p>
					<Button asChild variant="outline" size="sm">
						<Link href="/admin/members">Back to members</Link>
					</Button>
				</div>
			);
		}
		if (!member) {
			return (
				<div className="space-y-4">
					<p className="text-sm text-destructive">Member not found.</p>
					<Button asChild variant="outline" size="sm">
						<Link href="/admin/members">Back to members</Link>
					</Button>
				</div>
			);
		}
		return (
			<MemberDetailBody
				memberId={memberId}
				member={member}
				tab={tab}
				setTab={setTab}
				claimsPane={claimsPane}
				setClaimsPane={setClaimsPane}
				showSsn={showSsn}
				setShowSsn={setShowSsn}
			/>
		);
	})();

	if (useApi) {
		return <VendorCoreGate title="Member">{body}</VendorCoreGate>;
	}
	return body;
}

function MemberDetailBody({
	memberId,
	member: baseMember,
	tab,
	setTab,
	claimsPane,
	setClaimsPane,
	showSsn,
	setShowSsn,
}: {
	memberId: string;
	member: NonNullable<ReturnType<typeof getMember>>;
	tab: Tab;
	setTab: (t: Tab) => void;
	claimsPane: "claims" | "encounters";
	setClaimsPane: (p: "claims" | "encounters") => void;
	showSsn: boolean;
	setShowSsn: (v: boolean | ((b: boolean) => boolean)) => void;
}) {
	const member =
		useMemberTabData(memberId, baseMember, tab, claimsPane) ?? baseMember;
	const [editMode, setEditMode] = useState(false);
	const [sourceRecordId, setSourceRecordId] = useState<string | null>(null);
	const [exportBusy, setExportBusy] = useState(false);
	const apiMemberId = baseMember.id;
	const name = displayName(member);
	const visibleTabs: Tab[] = editMode ? ["Edit", ...TABS] : [...TABS];

	function selectTab(next: Tab) {
		if (next !== "Edit") setEditMode(false);
		setTab(next);
	}

	function enterEditMode() {
		setEditMode(true);
		setTab("Edit");
	}

	function exitEditMode() {
		setEditMode(false);
		setTab("Overview");
	}

	async function runExport(task: () => Promise<void>) {
		if (exportBusy) return;
		setExportBusy(true);
		try {
			await task();
		} finally {
			setExportBusy(false);
		}
	}
	const claimRows = claimsPane === "claims" ? member.claims : member.encounters;

	return (
		<div className="space-y-3">
			{/* Page actions */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-xs text-muted-foreground">
					<span>Members</span>
					<span className="mx-1.5 text-border/80">/</span>
					<span className="font-semibold text-foreground">Member Profile</span>
				</p>
				<div className="flex flex-wrap items-center gap-1.5">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-8 rounded-md border-border/70 bg-card px-3 text-xs shadow-none"
							>
								Member Summary
								<ChevronDown className="ml-1 size-3 opacity-60" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								disabled={exportBusy}
								onClick={() =>
									void runExport(() =>
										openMemberDocumentPdf(apiMemberId, "summary")
									)
								}
							>
								One-page summary
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={exportBusy}
								onClick={() =>
									void runExport(() =>
										openMemberDocumentPdf(apiMemberId, "eligibility-letter")
									)
								}
							>
								Eligibility letter
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={exportBusy}
								onClick={() =>
									void runExport(() =>
										openMemberDocumentPdf(apiMemberId, "coverage-card")
									)
								}
							>
								Coverage card
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="outline"
						size="sm"
						className="h-8 rounded-md border-border/70 bg-card px-3 text-xs shadow-none"
						disabled={exportBusy}
						onClick={() =>
							void runExport(() => printMemberProfile(apiMemberId))
						}
					>
						<Printer className="mr-1 size-3" />
						Print
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="sm"
								className="h-8 rounded-md px-3 text-xs shadow-none"
								disabled={exportBusy}
							>
								<Download className="mr-1 size-3" />
								Export
								<ChevronDown className="ml-1 size-3 opacity-80" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								disabled={exportBusy}
								onClick={() =>
									void runExport(() => downloadMemberDetailCsv(apiMemberId))
								}
							>
								Export CSV
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={exportBusy}
								onClick={() =>
									void runExport(() => downloadMemberDetailPdf(apiMemberId))
								}
							>
								Export PDF
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<MemberProfileActions member={member} onEdit={enterEditMode} />
				</div>
			</div>

			{/* Identity header */}
			<section className={cn("relative", MEMBER_UI.surface, MEMBER_UI.radius)}>
				<SurfaceTopAccent />
				<div
					className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-primary/[0.035] blur-2xl"
					aria-hidden
				/>
				<div
					className="pointer-events-none absolute -bottom-8 left-1/4 size-28 rounded-full bg-chart-5/[0.04] blur-2xl"
					aria-hidden
				/>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-chart-5/[0.015]" />

				<div className="relative border-b border-border/30 px-4 py-3 sm:px-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5 xl:gap-7">
						<div className="flex min-w-0 items-center gap-3 lg:max-w-[19rem] lg:shrink-0">
							<div className="relative shrink-0">
								<div className="flex size-11 items-center justify-center rounded-full border-2 border-primary/15 bg-primary text-primary-foreground">
									<UserRound className="size-5" strokeWidth={1.75} />
								</div>
								{member.status === "active" ? (
									<span className="absolute right-0 bottom-0 size-2 rounded-full border border-card bg-chart-2" />
								) : null}
							</div>
							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<h1 className="text-base font-bold tracking-tight text-primary">
										{name}
									</h1>
									<ProfileStatusBadge status={member.status} />
									<MemberProfileActions
										member={member}
										onEdit={enterEditMode}
									/>
								</div>
								<p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
									{member.memberType ?? "Subscriber"}
									<span className="mx-1.5 text-border/80">·</span>
									Person Code {member.personCode ?? "01"}
									<span className="mx-1.5 text-border/80">·</span>
									Relationship Code {member.relationshipCode ?? "18"}
								</p>
							</div>
						</div>

						<div className="hidden h-9 w-px shrink-0 bg-border/50 lg:block" />

						<div className="grid min-w-0 flex-1 grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4 sm:gap-x-6">
							<HeaderField
								label="Cardholder ID"
								value={member.memberId}
								accent
								mono
							/>
							<HeaderField
								label="External ID"
								value={member.externalId ?? "—"}
								accent
								mono
							/>
							<HeaderField
								label="Alternate ID"
								value={member.alternateId ?? "—"}
								accent
								mono
							/>
							<div className="min-w-0 space-y-1">
								<p className={MEMBER_UI.labelAccent}>SSN</p>
								<div className="flex items-center gap-1">
									<span className="font-mono text-[13px] font-semibold tabular-nums text-foreground">
										{showSsn
											? `123-45-${member.ssnLast4}`
											: maskSsn(member.ssnLast4)}
									</span>
									<button
										type="button"
										aria-label={showSsn ? "Hide SSN" : "Show SSN"}
										onClick={() => setShowSsn((v) => !v)}
										className={cn(
											"p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
											MEMBER_UI.radiusSm
										)}
									>
										{showSsn ? (
											<EyeOff className="size-3" />
										) : (
											<Eye className="size-3" />
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<MetricStrip
					embedded
					compact
					className="relative bg-muted/[0.14]"
					items={[
						{
							label: "Date of Birth",
							value: formatDate(member.dob),
							sub:
								memberAge(member.dob) != null
									? `Age ${memberAge(member.dob)} · ${member.gender ?? "—"}`
									: (member.gender ?? undefined),
						},
						{
							label: "Account / Group",
							value: member.groupId ?? "—",
							sub: member.groupName ?? member.accountGroup ?? undefined,
							accent: Boolean(member.groupId),
						},
						{
							label: "Current Plan",
							value: member.planName ?? "—",
							sub: member.coverageLevel ?? undefined,
						},
						{
							label: "Employee Type",
							value: member.employeeType ?? member.accountStatus ?? "—",
						},
						{
							label: "Eligibility Status",
							value:
								member.eligibilityStatus === "eligible"
									? "Eligible"
									: member.eligibilityStatus === "termed"
										? "Termed"
										: member.eligibilityStatus === "pending"
											? "Pending"
											: "Ineligible",
							accent: member.eligibilityStatus === "eligible",
						},
						{
							label: "Source",
							value: member.sourceSystem ?? member.vendorSource ?? "—",
						},
						{
							label: "Gender",
							value: member.gender ?? "—",
						},
					]}
				/>
			</section>

			{/* Tabs */}
			<nav
				className={cn(
					"relative overflow-hidden border border-border/50 bg-muted/25 p-1",
					MEMBER_UI.radius
				)}
			>
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
				<div className="flex min-w-max gap-0.5 overflow-x-auto pr-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{visibleTabs.map((item) => (
						<button
							key={item}
							type="button"
							onClick={() => selectTab(item)}
							className={cn(
								"px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
								MEMBER_UI.radiusSm,
								tab === item
									? "bg-primary text-primary-foreground shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]"
									: "text-muted-foreground hover:bg-background/80 hover:text-foreground"
							)}
						>
							{item}
						</button>
					))}
				</div>
				<div className="pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-end bg-gradient-to-l from-muted/25 to-transparent pr-1.5">
					<ChevronDown className="size-3 rotate-[-90deg] text-muted-foreground/50" />
				</div>
			</nav>

			{tab === "Edit" ? (
				<MemberEditPanel member={member} onCancel={exitEditMode} />
			) : tab === "Overview" ? (
				<div className="space-y-3">
					{/* Top row — 4 info cards */}
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						<OverviewCard icon={ShieldCheck} title="Current Eligibility">
							<div>
								<OverviewRow
									label="Eligibility Status"
									value={
										member.eligibilityStatus === "eligible" ? (
											<ActiveBadge label="Active" />
										) : (
											<EligPill status={member.eligibilityStatus} />
										)
									}
								/>
								<OverviewRow
									label="Status Effective Date"
									value={formatDate(
										member.statusEffectiveDate ?? member.coverageStart
									)}
								/>
								<OverviewRow
									label="Status Term Date"
									value={
										member.statusTermDate
											? formatDate(member.statusTermDate)
											: "—"
									}
								/>
								<OverviewRow
									label="Enrollment Date"
									value={formatDate(
										member.enrollmentDate ?? member.coverageStart
									)}
								/>
								<OverviewRow
									label="Disenrollment Date"
									value={
										member.disenrollmentDate
											? formatDate(member.disenrollmentDate)
											: "—"
									}
								/>
								<OverviewRow
									label="Last Eligibility Update"
									value={member.lastEligibilityUpdate ?? member.dataAsOf}
								/>
								<OverviewRow
									label="Secondary Coverage"
									value={member.secondaryCoverage ?? "No"}
								/>
							</div>
						</OverviewCard>

						<OverviewCard
							icon={Wallet}
							iconTone="chart-2"
							title="Current Coverage / Plan"
						>
							<div>
								<OverviewRow label="Plan Name" value={member.planName} />
								<OverviewRow
									label="Plan Code"
									value={member.planCode ?? member.planId}
								/>
								<OverviewRow
									label="Benefit Package"
									value={member.benefitPackage ?? "—"}
								/>
								<OverviewRow
									label="Coverage Level Code"
									value={member.coverageLevelCode ?? "—"}
								/>
								<OverviewRow
									label="Coverage Level"
									value={member.coverageLevel ?? "—"}
								/>
								<OverviewRow
									label="Coverage Effective Date"
									value={formatDate(
										member.coverageEffectiveDate ?? member.coverageStart
									)}
								/>
								<OverviewRow
									label="Coverage Term Date"
									value={
										member.coverageEnd ? formatDate(member.coverageEnd) : "—"
									}
								/>
							</div>
						</OverviewCard>

						<OverviewCard
							icon={CalendarDays}
							iconTone="chart-3"
							title="Key Dates"
						>
							<div>
								<OverviewRow
									label="Date of Birth"
									value={formatDate(member.dob)}
								/>
								<OverviewRow
									label="Eligibility Effective Date"
									value={formatDate(member.coverageStart)}
								/>
								<OverviewRow
									label="Eligibility Term Date"
									value={
										member.coverageEnd ? formatDate(member.coverageEnd) : "—"
									}
								/>
								<OverviewRow
									label="Plan Effective Date"
									value={formatDate(
										member.coverageEffectiveDate ?? member.coverageStart
									)}
								/>
								<OverviewRow
									label="Plan Term Date"
									value={
										member.coverageEnd ? formatDate(member.coverageEnd) : "—"
									}
								/>
								<OverviewRow
									label="Last Updated"
									value={member.lastEligibilityUpdate ?? member.dataAsOf}
								/>
							</div>
						</OverviewCard>

						<OverviewCard
							icon={Building2}
							iconTone="chart-5"
							title="Account / Group"
						>
							<div>
								<OverviewRow
									label="Group ID"
									value={member.groupId ?? "—"}
									valueClassName="font-mono text-chart-5"
								/>
								<OverviewRow
									label="Group Name"
									value={member.groupName ?? member.accountGroup ?? "—"}
								/>
								<OverviewRow label="Client ID" value={member.clientId ?? "—"} />
								<OverviewRow
									label="Account Type"
									value={member.accountType ?? "—"}
								/>
								<OverviewRow
									label="Account Status"
									value={
										member.accountStatus === "Active" ? (
											<ActiveBadge />
										) : (
											(member.accountStatus ?? "—")
										)
									}
								/>
								<OverviewRow
									label="Member Type"
									value={member.memberType ?? "—"}
								/>
							</div>
						</OverviewCard>
					</div>

					{/* Middle row — Accumulators / Claims / Source */}
					<div className="grid gap-3 lg:grid-cols-3">
						<Panel
							dense
							title={`Recent Accumulators (as of ${member.dataAsOf.split(" ")[0]})`}
						>
							<div className="overflow-hidden">
								<Table className="w-full table-fixed">
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 bg-muted/40 text-[10px] font-semibold uppercase">
												Type
											</TableHead>
											<TableHead className="h-8 bg-muted/40 text-[10px] font-semibold uppercase">
												Individual
											</TableHead>
											<TableHead className="h-8 bg-muted/40 text-[10px] font-semibold uppercase">
												Family
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.accumulators.slice(0, 4).map((row) => (
											<TableRow key={row.id}>
												<TableCell className="py-2 text-xs font-medium">
													{row.label}
												</TableCell>
												<TableCell className="py-2 text-xs tabular-nums">
													{formatCurrency(row.individual)}
												</TableCell>
												<TableCell className="py-2 text-xs tabular-nums">
													{formatCurrency(row.family)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<div className="mt-3 text-center">
								<button
									type="button"
									className="text-xs font-medium text-primary hover:underline"
									onClick={() => selectTab("Accumulators")}
								>
									View All Accumulators
								</button>
							</div>
						</Panel>

						<Panel
							dense
							title="Recent Claims"
							action={
								<button
									type="button"
									className="text-xs font-medium text-primary hover:underline"
									onClick={() => selectTab("Claims & Encounters")}
								>
									View All Claims
								</button>
							}
						>
							<div className="overflow-hidden">
								<Table className="w-full table-fixed">
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 bg-muted/40 text-[10px] font-semibold uppercase">
												Service Date
											</TableHead>
											<TableHead className="h-8 bg-muted/40 text-[10px] font-semibold uppercase">
												Type
											</TableHead>
											<TableHead className="h-8 bg-muted/40 text-[10px] font-semibold uppercase">
												Status
											</TableHead>
											<TableHead className="h-8 bg-muted/40 text-right text-[10px] font-semibold uppercase">
												Billed Amount
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.claims.slice(0, 4).map((claim) => (
											<TableRow key={claim.id}>
												<TableCell className="py-2 text-xs tabular-nums">
													{formatDate(claim.dos)}
												</TableCell>
												<TableCell className="py-2 text-xs">
													{claim.type}
												</TableCell>
												<TableCell className="py-2">
													<ClaimPill status={claim.status} />
												</TableCell>
												<TableCell className="py-2 text-right text-xs tabular-nums">
													{formatCurrency(claim.billed)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Panel>

						<Panel dense title="Source Information (Latest)">
							<div>
								<OverviewRow
									label="Source System"
									value={member.sourceSystem ?? member.vendorSource}
								/>
								<OverviewRow
									label="File Name"
									value={
										<span
											className="block max-w-[180px] truncate"
											title={member.sourceFileName}
										>
											{member.sourceFileName ?? "—"}
										</span>
									}
								/>
								<OverviewRow
									label="File Received"
									value={member.sourceFileReceived ?? "—"}
								/>
								<OverviewRow
									label="Record Status"
									value={
										member.recordStatus === "Processed" ? (
											<ActiveBadge label="Processed" />
										) : (
											(member.recordStatus ?? "—")
										)
									}
								/>
								<OverviewRow
									label="Record Effective Date"
									value={formatDate(member.coverageStart)}
								/>
								<OverviewRow
									label="Change Detected"
									value={member.changeDetected ?? "—"}
								/>
							</div>
						</Panel>
					</div>

					{/* Bottom row — Family / Other Status */}
					<div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
						<Panel dense title="Family Members">
							<div className="overflow-hidden">
								<Table className="w-full table-fixed">
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 w-[14%] bg-muted/40 text-[10px] font-semibold uppercase">
												Member ID
											</TableHead>
											<TableHead className="h-8 w-[22%] bg-muted/40 text-[10px] font-semibold uppercase">
												Member Name
											</TableHead>
											<TableHead className="h-8 w-[12%] bg-muted/40 text-[10px] font-semibold uppercase">
												Relationship
											</TableHead>
											<TableHead className="h-8 w-[12%] bg-muted/40 text-[10px] font-semibold uppercase">
												Date of Birth
											</TableHead>
											<TableHead className="h-8 w-[8%] bg-muted/40 text-[10px] font-semibold uppercase">
												Gender
											</TableHead>
											<TableHead className="h-8 w-[14%] bg-muted/40 text-[10px] font-semibold uppercase">
												Eligibility Status
											</TableHead>
											<TableHead className="h-8 w-[18%] bg-muted/40 text-[10px] font-semibold uppercase">
												Current Plan
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.dependents.map((dep) => (
											<TableRow key={dep.id}>
												<TableCell className="py-2 text-xs font-medium text-primary">
													{dep.memberId ?? "—"}
												</TableCell>
												<TruncateCell className="py-2 text-xs font-medium">
													{dep.name}
												</TruncateCell>
												<TableCell className="py-2 text-xs">
													{dep.relationship}
												</TableCell>
												<TableCell className="py-2 text-xs tabular-nums">
													{formatDate(dep.dob)}
												</TableCell>
												<TableCell className="py-2 text-xs">
													{dep.gender}
												</TableCell>
												<TableCell className="py-2">
													{dep.coverageStatus === "active" ? (
														<ActiveBadge />
													) : (
														<MemberStatusPill status={dep.coverageStatus} />
													)}
												</TableCell>
												<TruncateCell className="py-2 text-xs">
													{dep.planName ?? member.planName}
												</TruncateCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<div className="mt-3 text-center">
								<button
									type="button"
									className="text-xs font-medium text-primary hover:underline"
									onClick={() => selectTab("Family / Dependents")}
								>
									View All Family Members
								</button>
							</div>
						</Panel>

						<Panel
							dense
							title={`Other Status (as of ${member.dataAsOf.split(" ")[0]})`}
						>
							<div className="overflow-hidden">
								<Table className="w-full table-fixed">
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 w-[16%] bg-muted/40 text-[10px] font-semibold uppercase">
												Status Slot
											</TableHead>
											<TableHead className="h-8 w-[18%] bg-muted/40 text-[10px] font-semibold uppercase">
												Status
											</TableHead>
											<TableHead className="h-8 w-[30%] bg-muted/40 text-[10px] font-semibold uppercase">
												Status Detail
											</TableHead>
											<TableHead className="h-8 w-[18%] bg-muted/40 text-[10px] font-semibold uppercase">
												Effective Start
											</TableHead>
											<TableHead className="h-8 w-[18%] bg-muted/40 text-[10px] font-semibold uppercase">
												Effective End
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{member.otherStatuses.map((row) => (
											<TableRow key={row.id}>
												<TableCell className="py-2 text-xs">
													{row.slot}
												</TableCell>
												<TruncateCell className="py-2 text-xs font-medium">
													{row.status}
												</TruncateCell>
												<TruncateCell className="py-2 text-xs text-muted-foreground">
													{row.detail}
												</TruncateCell>
												<TableCell className="py-2 text-xs tabular-nums">
													{formatDate(row.effectiveStart)}
												</TableCell>
												<TableCell className="py-2 text-xs tabular-nums">
													{formatDate(row.effectiveEnd)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<div className="mt-3 text-center">
								<button
									type="button"
									className="text-xs font-medium text-primary hover:underline"
									onClick={() => selectTab("Demographics")}
								>
									View All Other Status
								</button>
							</div>
						</Panel>
					</div>
				</div>
			) : (
				<TabBody
					tab={tab}
					member={member}
					memberId={memberId}
					onOpenSourceRecord={setSourceRecordId}
				/>
			)}
			<MemberSourceRecordViewer
				memberId={memberId}
				recordId={sourceRecordId ?? ""}
				open={Boolean(sourceRecordId)}
				onOpenChange={(open) => {
					if (!open) setSourceRecordId(null);
				}}
			/>
		</div>
	);
}

function FeedStatusPill({
	status,
}: {
	status: "success" | "warning" | "failed";
}) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
				status === "success" &&
					"bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
				status === "warning" &&
					"bg-amber-500/15 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
				status === "failed" &&
					"bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-300"
			)}
		>
			{status}
		</span>
	);
}

function MemberClaimsEncountersTab({
	member,
	memberId,
}: {
	member: NonNullable<ReturnType<typeof getMember>>;
	memberId: string;
}) {
	const [pane, setPane] = useState<"claims" | "encounters">("claims");
	const rows = pane === "claims" ? member.claims : member.encounters;
	const billedTotal = member.claims.reduce((s, c) => s + c.billed, 0);
	const paidTotal = member.claims.reduce((s, c) => s + c.paid, 0);
	const denied = member.claims.filter((c) => c.status === "denied").length;
	const pending = [...member.claims, ...member.encounters].filter(
		(c) => c.status === "pending"
	).length;

	return (
		<div className="space-y-4">
			<MetricStrip
				title="Claims & encounters snapshot"
				items={[
					{ label: "Claims YTD", value: `${member.claimsYtd}` },
					{
						label: "Paid YTD",
						value: formatCurrency(member.paidYtd),
					},
					{
						label: "Billed (listed)",
						value: formatCurrency(billedTotal),
					},
					{
						label: "Paid (listed)",
						value: formatCurrency(paidTotal),
					},
					{ label: "Denied", value: `${denied}` },
					{
						label: "Pending",
						value: `${pending}`,
						accent: pending === 0,
					},
				]}
			/>

			<div className="grid gap-3 lg:grid-cols-4">
				{(
					[
						{
							label: "Medical claims",
							value: member.claims.filter((c) => c.type === "Medical").length,
						},
						{
							label: "Pharmacy claims",
							value: member.claims.filter((c) => c.type === "Pharmacy").length,
						},
						{
							label: "Encounters",
							value: member.encounters.length,
						},
						{
							label: "Last claim",
							value: formatDate(member.lastClaimDate),
						},
					] as const
				).map((card) => (
					<div
						key={card.label}
						className="rounded-xl border border-border/40 bg-card px-4 py-3 shadow-sm"
					>
						<p className="text-[11px] font-medium text-muted-foreground uppercase">
							{card.label}
						</p>
						<p className="mt-1 text-sm font-semibold tabular-nums">
							{card.value}
						</p>
					</div>
				))}
			</div>

			<Panel
				dense
				title="Recent activity"
				action={
					<div className="flex items-center gap-1 rounded-lg bg-muted/40 p-0.5">
						{(
							[
								{
									id: "claims" as const,
									label: `Claims (${member.claims.length})`,
								},
								{
									id: "encounters" as const,
									label: `Encounters (${member.encounters.length})`,
								},
							] as const
						).map((p) => (
							<button
								key={p.id}
								type="button"
								onClick={() => setPane(p.id)}
								className={cn(
									"rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
									pane === p.id
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
								)}
							>
								{p.label}
							</button>
						))}
					</div>
				}
			>
				<TableScroll>
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="h-9 text-xs">DOS</TableHead>
								<TableHead className="h-9 text-xs">Claim #</TableHead>
								<TableHead className="h-9 text-xs">Type</TableHead>
								<TableHead className="h-9 text-xs">Provider</TableHead>
								<TableHead className="h-9 text-right text-xs">Billed</TableHead>
								<TableHead className="h-9 text-right text-xs">Paid</TableHead>
								<TableHead className="h-9 text-xs">Status</TableHead>
								<TableHead className="h-9 text-xs">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((c) => (
								<TableRow key={c.id}>
									<TableCell className="py-2.5 text-sm tabular-nums">
										{formatDate(c.dos)}
									</TableCell>
									<TableCell className="py-2.5 font-mono text-xs">
										{c.claimNumber}
									</TableCell>
									<TableCell className="py-2.5 text-sm">{c.type}</TableCell>
									<TableCell className="py-2.5 text-sm">{c.provider}</TableCell>
									<TableCell className="py-2.5 text-right text-sm tabular-nums">
										{formatCurrency(c.billed)}
									</TableCell>
									<TableCell className="py-2.5 text-right text-sm tabular-nums">
										{formatCurrency(c.paid)}
									</TableCell>
									<TableCell className="py-2.5">
										<ClaimPill status={c.status} />
									</TableCell>
									<TableCell className="py-2.5">
										<MemberClaimRowActions
											memberId={memberId}
											claimId={c.id}
											status={c.status}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableScroll>
				<p className="mt-3 text-[11px] text-muted-foreground">
					Showing recent {pane} for this member · Data as of {member.dataAsOf}
				</p>
			</Panel>
		</div>
	);
}

function TabBody({
	tab,
	member,
	memberId,
	onOpenSourceRecord,
}: {
	tab: Tab;
	member: NonNullable<ReturnType<typeof getMember>>;
	memberId: string;
	onOpenSourceRecord: (id: string) => void;
}) {
	if (tab === "Demographics") {
		const age = memberAge(member.dob);
		const legalName = displayName(member);
		const residential = [
			member.addressLine1,
			member.addressLine2,
			`${member.city}, ${member.state} ${member.zip}`,
		]
			.filter(Boolean)
			.join(", ");
		const mailing = [
			member.mailingAddressLine1,
			member.mailingAddressLine2,
			`${member.mailingCity}, ${member.mailingState} ${member.mailingZip}`,
		]
			.filter(Boolean)
			.join(", ");

		return (
			<div className="space-y-4">
				<div className="grid gap-3 xl:grid-cols-2">
					<MetricStrip
						compact
						title="Snapshot"
						items={[
							{
								label: "Status",
								value: <MemberStatusPill status={member.status} />,
							},
							{ label: "Gender", value: member.gender },
							{
								label: "Age",
								value: age != null ? `${age} yrs` : "—",
							},
							{ label: "Program", value: member.program },
							{ label: "Plan type", value: member.planType },
							{
								label: "Eligibility",
								value:
									member.eligibilityStatus === "eligible"
										? "Eligible"
										: member.eligibilityStatus,
								accent: member.eligibilityStatus === "eligible",
							},
						]}
					/>

					<MetricStrip
						compact
						title="Identifiers"
						items={[
							{
								label: "Member ID",
								value: member.memberId,
								mono: true,
							},
							{
								label: "SSN",
								value: maskSsn(member.ssnLast4),
								mono: true,
							},
							{
								label: "Plan ID",
								value: member.planId,
								mono: true,
							},
							{
								label: "PCP NPI",
								value: member.pcpNpi,
								mono: true,
							},
							{
								label: "Case / group",
								value: member.eligibilityHistory[0]?.groupCaseId ?? "—",
								mono: true,
							},
							{
								label: "Source",
								value: member.vendorSource,
							},
						]}
					/>
				</div>

				<div className="grid gap-3 lg:grid-cols-3">
					<Panel
						dense
						title="Personal identity"
						action={<UserRound className="size-3.5 text-muted-foreground" />}
					>
						<div className="grid grid-cols-2 gap-x-4 gap-y-3">
							<MetaField label="Legal name" value={legalName} />
							<MetaField
								label="Preferred name"
								value={member.preferredName ?? "—"}
							/>
							<MetaField
								label="Date of birth"
								value={
									<span className="tabular-nums">
										{formatDate(member.dob)}
										{age != null ? (
											<span className="ml-1.5 font-normal text-muted-foreground">
												({age})
											</span>
										) : null}
									</span>
								}
							/>
							<MetaField label="Gender" value={member.gender} />
							<MetaField label="Race" value={member.race} />
							<MetaField label="Ethnicity" value={member.ethnicity} />
							<div className="col-span-2">
								<MetaField
									label="Preferred language"
									value={
										<span className="inline-flex items-center gap-1.5">
											<Languages className="size-3.5 text-muted-foreground" />
											{member.preferredLanguage}
										</span>
									}
								/>
							</div>
							<MetaField
								label="SSN"
								value={
									<span className="font-mono tabular-nums">
										{maskSsn(member.ssnLast4)}
									</span>
								}
							/>
							<MetaField
								label="Communication"
								value={member.communicationPreference}
							/>
						</div>
					</Panel>

					<Panel
						dense
						title="Coverage profile"
						action={<BadgeCheck className="size-3.5 text-muted-foreground" />}
					>
						<div className="grid grid-cols-2 gap-x-4 gap-y-3">
							<MetaField label="Program" value={member.program} />
							<MetaField
								label="Member status"
								value={<MemberStatusPill status={member.status} />}
							/>
							<MetaField
								label="Eligibility"
								value={<EligPill status={member.eligibilityStatus} />}
							/>
							<MetaField label="LOB" value={member.lob} />
							<div className="col-span-2">
								<MetaField label="Plan" value={member.planName} />
							</div>
							<MetaField label="Plan type" value={member.planType} />
							<MetaField
								label="Plan ID"
								value={
									<span className="font-mono text-sm">{member.planId}</span>
								}
							/>
							<MetaField
								label="Coverage start"
								value={
									<span className="tabular-nums">
										{formatDate(member.coverageStart)}
									</span>
								}
							/>
							<MetaField
								label="Coverage end"
								value={
									<span className="tabular-nums">
										{formatDate(member.coverageEnd)}
									</span>
								}
							/>
							<div className="col-span-2">
								<MetaField
									label="PCP"
									value={
										<span>
											{member.pcpName}
											<span className="mt-0.5 block font-mono text-xs font-normal text-muted-foreground">
												NPI {member.pcpNpi}
											</span>
										</span>
									}
								/>
							</div>
						</div>
					</Panel>

					<Panel
						dense
						title="Emergency contact"
						action={<Phone className="size-3.5 text-muted-foreground" />}
					>
						<div className="grid grid-cols-1 gap-y-3">
							<MetaField
								label="Contact name"
								value={member.emergencyContactName}
							/>
							<MetaField
								label="Relationship"
								value={member.emergencyContactRelation}
							/>
							<MetaField
								label="Phone"
								value={
									<span className="tabular-nums">
										{member.emergencyContactPhone}
									</span>
								}
							/>
							<div className="border-t border-border/30 pt-3">
								<p className="text-[11px] leading-relaxed text-muted-foreground">
									Eligibility history and plan changes are maintained on their
									dedicated tabs.
									<span className="mt-1 block">
										Data as of {member.dataAsOf}
									</span>
								</p>
							</div>
						</div>
					</Panel>
				</div>

				<Panel
					dense
					title="Address & contact"
					action={<Building2 className="size-3.5 text-muted-foreground" />}
				>
					<div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
						<MetaField
							label="Residential address"
							value={
								<span className="inline-flex items-start gap-1.5">
									<MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
									<span>{residential}</span>
								</span>
							}
						/>
						<MetaField label="Mailing address" value={mailing} />
						<div className="grid grid-cols-1 gap-y-3 sm:col-span-2 xl:col-span-2 xl:grid-cols-2">
							<MetaField
								label="Phone"
								value={
									<span className="inline-flex items-center gap-1.5 tabular-nums">
										<Phone className="size-3.5 text-muted-foreground" />
										{member.phone}
									</span>
								}
							/>
							<MetaField
								label="Email"
								value={
									<span className="inline-flex items-center gap-1.5 truncate">
										<Mail className="size-3.5 shrink-0 text-muted-foreground" />
										<span className="truncate">{member.email}</span>
									</span>
								}
							/>
							<MetaField
								label="Member since"
								value={
									<span className="tabular-nums">
										{formatDate(member.memberSince)}
									</span>
								}
							/>
							<MetaField
								label="Last claim"
								value={
									<span className="tabular-nums">
										{formatDate(member.lastClaimDate)}
									</span>
								}
							/>
						</div>
					</div>
				</Panel>
			</div>
		);
	}

	if (tab === "Eligibility") {
		const current =
			member.eligibilityHistory.find((r) => !r.endDate) ??
			member.eligibilityHistory[0];
		const openExceptions = member.exceptions.filter(
			(e) => e.status === "open" || e.status === "in_progress"
		);
		const termedSpans = member.eligibilityHistory.filter(
			(r) => r.status === "termed"
		).length;
		const pendingSpans = member.eligibilityHistory.filter(
			(r) => r.status === "pending"
		).length;

		return (
			<div className="space-y-4">
				<MetricStrip
					title="Eligibility snapshot"
					items={[
						{
							label: "Status",
							value: <EligPill status={member.eligibilityStatus} />,
						},
						{
							label: "Coverage start",
							value: formatDate(member.coverageStart),
						},
						{
							label: "Coverage end",
							value: member.coverageEnd
								? formatDate(member.coverageEnd)
								: "Present",
						},
						{
							label: "Active source",
							value: current?.source ?? "—",
						},
						{
							label: "Case / group",
							value: current?.groupCaseId ?? "—",
							mono: true,
						},
						{
							label: "Open exceptions",
							value: `${openExceptions.length}`,
							accent: openExceptions.length === 0,
						},
					]}
				/>

				<div className="grid gap-3 lg:grid-cols-5">
					<Panel
						dense
						title="Current eligibility"
						className="lg:col-span-2"
						action={<ShieldCheck className="size-3.5 text-muted-foreground" />}
					>
						<div className="space-y-4">
							<div className="flex items-start gap-3 rounded-lg border border-border/30 bg-muted/15 p-3.5">
								<span
									className={cn(
										"flex size-10 shrink-0 items-center justify-center rounded-full",
										member.eligibilityStatus === "eligible"
											? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
											: member.eligibilityStatus === "pending"
												? "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
												: "bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-300"
									)}
								>
									<CheckCircle2 className="size-5" />
								</span>
								<div className="min-w-0">
									<p className="text-xs font-medium text-muted-foreground">
										Determination
									</p>
									<p className="mt-0.5 text-base font-semibold capitalize">
										{member.eligibilityStatus === "eligible"
											? "Eligible for benefits"
											: member.eligibilityStatus}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{formatDate(member.coverageStart)} –{" "}
										{member.coverageEnd
											? formatDate(member.coverageEnd)
											: "Present"}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-x-4 gap-y-3">
								<MetaField label="Program" value={member.program} />
								<MetaField
									label="Member status"
									value={<MemberStatusPill status={member.status} />}
								/>
								<MetaField
									label="Verified by"
									value={current?.verifiedBy ?? "—"}
								/>
								<MetaField label="Source file" value={current?.source ?? "—"} />
								<div className="col-span-2">
									<MetaField label="Reason" value={current?.reason ?? "—"} />
								</div>
								<div className="col-span-2">
									<MetaField
										label="Group / case ID"
										value={
											<span className="font-mono text-sm">
												{current?.groupCaseId ?? "—"}
											</span>
										}
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3">
								<div className="rounded-lg bg-muted/20 px-2.5 py-2 text-center">
									<p className="text-[10px] font-medium text-muted-foreground uppercase">
										Spans
									</p>
									<p className="mt-0.5 text-sm font-semibold tabular-nums">
										{member.eligibilityHistory.length}
									</p>
								</div>
								<div className="rounded-lg bg-muted/20 px-2.5 py-2 text-center">
									<p className="text-[10px] font-medium text-muted-foreground uppercase">
										Termed
									</p>
									<p className="mt-0.5 text-sm font-semibold tabular-nums">
										{termedSpans}
									</p>
								</div>
								<div className="rounded-lg bg-muted/20 px-2.5 py-2 text-center">
									<p className="text-[10px] font-medium text-muted-foreground uppercase">
										Pending
									</p>
									<p className="mt-0.5 text-sm font-semibold tabular-nums">
										{pendingSpans}
									</p>
								</div>
							</div>
						</div>
					</Panel>

					<Panel
						dense
						title="Eligibility history"
						className="lg:col-span-3"
						action={
							<span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
								<History className="size-3.5" />
								{member.eligibilityHistory.length} spans
							</span>
						}
					>
						<TableScroll>
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-9 text-xs">Start</TableHead>
										<TableHead className="h-9 text-xs">End</TableHead>
										<TableHead className="h-9 text-xs">Status</TableHead>
										<TableHead className="h-9 text-xs">Source</TableHead>
										<TableHead className="h-9 text-xs">Case / group</TableHead>
										<TableHead className="h-9 text-xs">Reason</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{member.eligibilityHistory.map((r) => (
										<TableRow key={r.id}>
											<TableCell className="py-2.5 text-sm tabular-nums">
												{formatDate(r.startDate)}
											</TableCell>
											<TableCell className="py-2.5 text-sm tabular-nums">
												{r.endDate ? (
													formatDate(r.endDate)
												) : (
													<span className="font-medium text-emerald-700">
														Present
													</span>
												)}
											</TableCell>
											<TableCell className="py-2.5">
												<EligPill status={r.status} />
											</TableCell>
											<TableCell className="py-2.5 text-sm">
												{r.source}
											</TableCell>
											<TableCell className="py-2.5 font-mono text-xs">
												{r.groupCaseId}
											</TableCell>
											<TableCell className="max-w-[220px] py-2.5 text-sm text-muted-foreground">
												{r.reason}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableScroll>
						<p className="mt-3 text-[11px] text-muted-foreground">
							Eligibility spans are ordered newest first · Verified via{" "}
							{current?.verifiedBy ?? "system"} · Data as of {member.dataAsOf}
						</p>
					</Panel>
				</div>

				{openExceptions.length > 0 ? (
					<Panel
						dense
						title="Related eligibility exceptions"
						action={
							<span className="text-[11px] text-muted-foreground">
								{openExceptions.length} open / in progress
							</span>
						}
					>
						<TableScroll>
							<Table className="w-full table-fixed">
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-9 w-[18%] text-xs">Type</TableHead>
										<TableHead className="h-9 w-[36%] text-xs">
											Description
										</TableHead>
										<TableHead className="h-9 w-[16%] text-xs">
											Source
										</TableHead>
										<TableHead className="h-9 w-[14%] text-xs">
											Status
										</TableHead>
										<TableHead className="h-9 w-[16%] text-xs">
											Detected
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{openExceptions.map((ex) => (
										<TableRow key={ex.id}>
											<TruncateCell className="py-2.5 text-sm font-medium text-amber-800">
												{ex.exceptionType}
											</TruncateCell>
											<TruncateCell className="py-2.5 text-sm text-muted-foreground">
												{ex.description}
											</TruncateCell>
											<TruncateCell className="py-2.5 text-sm">
												{ex.source}
											</TruncateCell>
											<TableCell className="py-2.5">
												<ExceptionPill status={ex.status} />
											</TableCell>
											<TableCell className="py-2.5 text-sm tabular-nums">
												{formatDate(ex.startDetected)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableScroll>
					</Panel>
				) : null}
			</div>
		);
	}

	if (tab === "Coverage & Plan History") {
		const currentPlan =
			member.planHistory.find((p) => !p.endDate) ?? member.planHistory[0];
		const priorPlans = member.planHistory.filter((p) => p.endDate);

		return (
			<div className="space-y-4">
				<MetricStrip
					title="Coverage snapshot"
					items={[
						{ label: "Plan", value: member.planName },
						{ label: "Type", value: member.planType },
						{ label: "LOB", value: member.lob },
						{ label: "Program", value: member.program },
						{
							label: "Plan ID",
							value: member.planId,
							mono: true,
						},
						{
							label: "Effective",
							value: formatDate(member.coverageStart),
						},
					]}
				/>

				<div className="grid gap-3 lg:grid-cols-5">
					<Panel
						dense
						title="Active plan"
						className="lg:col-span-2"
						action={<BadgeCheck className="size-3.5 text-muted-foreground" />}
					>
						<div className="space-y-4">
							<div>
								<p className="text-xs font-medium text-muted-foreground">
									Product
								</p>
								<p className="mt-1 text-base font-semibold tracking-tight">
									{currentPlan?.planName ?? member.planName}
								</p>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{currentPlan?.carrier ?? "—"} ·{" "}
									{currentPlan?.planType ?? member.planType}
								</p>
							</div>
							<div className="grid grid-cols-2 gap-x-4 gap-y-3">
								<MetaField
									label="Plan ID"
									value={
										<span className="font-mono text-sm">
											{currentPlan?.planId ?? member.planId}
										</span>
									}
								/>
								<MetaField label="LOB" value={member.lob} />
								<MetaField
									label="Start"
									value={
										<span className="tabular-nums">
											{formatDate(
												currentPlan?.startDate ?? member.coverageStart
											)}
										</span>
									}
								/>
								<MetaField
									label="End"
									value={
										<span className="font-medium text-emerald-700">
											Present
										</span>
									}
								/>
								<div className="col-span-2">
									<MetaField
										label="Change reason"
										value={currentPlan?.changeReason ?? "Current active plan"}
									/>
								</div>
								<div className="col-span-2">
									<MetaField
										label="Assigned PCP"
										value={
											<span>
												{member.pcpName}
												<span className="mt-0.5 block font-mono text-xs font-normal text-muted-foreground">
													NPI {member.pcpNpi}
												</span>
											</span>
										}
									/>
								</div>
							</div>
							<div className="rounded-lg border border-dashed border-border/50 p-3">
								<p className="text-[11px] leading-relaxed text-muted-foreground">
									Prior products ({priorPlans.length}) are retained for audit.
									Eligibility status and exceptions remain on the Eligibility
									tab.
								</p>
							</div>
						</div>
					</Panel>

					<Panel
						dense
						title="Plan history"
						className="lg:col-span-3"
						action={
							<span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
								<CalendarDays className="size-3.5" />
								{member.planHistory.length} products
							</span>
						}
					>
						<TableScroll>
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-9 text-xs">Plan</TableHead>
										<TableHead className="h-9 text-xs">Carrier</TableHead>
										<TableHead className="h-9 text-xs">Type</TableHead>
										<TableHead className="h-9 text-xs">Plan ID</TableHead>
										<TableHead className="h-9 text-xs">Start</TableHead>
										<TableHead className="h-9 text-xs">End</TableHead>
										<TableHead className="h-9 text-xs">Reason</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{member.planHistory.map((r) => (
										<TableRow key={r.id}>
											<TableCell className="py-2.5">
												<p className="text-sm font-medium">{r.planName}</p>
												{!r.endDate ? (
													<span className="mt-0.5 inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
														Active
													</span>
												) : null}
											</TableCell>
											<TableCell className="py-2.5 text-sm">
												{r.carrier}
											</TableCell>
											<TableCell className="py-2.5 text-sm">
												{r.planType}
											</TableCell>
											<TableCell className="py-2.5 font-mono text-xs">
												{r.planId}
											</TableCell>
											<TableCell className="py-2.5 text-sm tabular-nums">
												{formatDate(r.startDate)}
											</TableCell>
											<TableCell className="py-2.5 text-sm tabular-nums">
												{r.endDate ? (
													formatDate(r.endDate)
												) : (
													<span className="font-medium text-emerald-700">
														Present
													</span>
												)}
											</TableCell>
											<TableCell className="max-w-[180px] py-2.5 text-sm text-muted-foreground">
												{r.changeReason}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableScroll>
						<p className="mt-3 text-[11px] text-muted-foreground">
							Data as of {member.dataAsOf}
						</p>
					</Panel>
				</div>
			</div>
		);
	}

	if (tab === "Family / Dependents") {
		return (
			<MemberFamilyEditor
				memberId={memberId}
				vendorId={member.vendorId}
				subscriberCardholderId={member.memberId}
				planName={member.planName}
				program={member.program}
			/>
		);
	}

	if (tab === "Claims & Encounters") {
		return (
			<div className="space-y-3">
				<div className="flex justify-end">
					<MemberCreateClaimButton memberId={memberId} />
				</div>
				<MemberClaimsEncountersTab member={member} memberId={memberId} />
			</div>
		);
	}

	if (tab === "Accumulators") {
		const oop = member.accumulators.find((a) =>
			a.label.toLowerCase().includes("out of pocket")
		);
		const deductible = member.accumulators.find(
			(a) => a.label === "Deductible"
		);
		const metCount = member.accumulators.filter((a) => a.remaining <= 0).length;

		return (
			<div className="space-y-4">
				<div className="flex justify-end">
					<MemberCreateAccumulatorButton memberId={memberId} />
				</div>
				<MetricStrip
					title="Accumulator snapshot"
					items={[
						{
							label: "Deductible used",
							value: deductible ? formatCurrency(deductible.individual) : "—",
						},
						{
							label: "Deductible remaining",
							value: deductible ? formatCurrency(deductible.remaining) : "—",
							accent: (deductible?.remaining ?? 1) === 0,
						},
						{
							label: "OOP used",
							value: oop ? formatCurrency(oop.individual) : "—",
						},
						{
							label: "OOP remaining",
							value: oop ? formatCurrency(oop.remaining) : "—",
						},
						{
							label: "Buckets met",
							value: `${metCount}/${member.accumulators.length}`,
						},
						{
							label: "Plan year paid",
							value: formatCurrency(member.paidYtd),
						},
					]}
				/>

				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{member.accumulators.map((a) => {
						const pct = a.limit
							? Math.min(100, Math.round((a.individual / a.limit) * 100))
							: 0;
						const familyPct = a.limit
							? Math.min(100, Math.round((a.family / a.limit) * 100))
							: 0;
						return (
							<section
								key={a.id}
								className="rounded-xl border border-border/40 bg-card p-4 shadow-sm"
							>
								<div className="flex items-start justify-between gap-2">
									<div>
										<p className="text-sm font-semibold">{a.label}</p>
										<p className="mt-0.5 text-[11px] text-muted-foreground">
											Limit {formatCurrency(a.limit)}
										</p>
									</div>
									<span
										className={cn(
											"rounded-full px-2 py-0.5 text-[10px] font-medium",
											a.remaining <= 0
												? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
												: "bg-muted text-muted-foreground"
										)}
									>
										{a.remaining <= 0 ? "Met" : "Open"}
									</span>
								</div>
								<div className="mt-2">
									<MemberAccumulatorRowActions
										memberId={memberId}
										accumulatorId={a.id}
										label={a.label}
										limit={a.limit}
										remaining={a.remaining}
									/>
								</div>

								<div className="mt-4 space-y-3">
									<div>
										<div className="mb-1 flex items-center justify-between text-xs">
											<span className="text-muted-foreground">Individual</span>
											<span className="font-medium tabular-nums">
												{formatCurrency(a.individual)} · {pct}%
											</span>
										</div>
										<div className="h-2 overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full bg-primary"
												style={{ width: `${pct}%` }}
											/>
										</div>
									</div>
									<div>
										<div className="mb-1 flex items-center justify-between text-xs">
											<span className="text-muted-foreground">Family</span>
											<span className="font-medium tabular-nums">
												{formatCurrency(a.family)} · {familyPct}%
											</span>
										</div>
										<div className="h-2 overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full bg-sky-600"
												style={{ width: `${familyPct}%` }}
											/>
										</div>
									</div>
									<div className="flex items-center justify-between border-t border-border/30 pt-2.5 text-xs">
										<span className="text-muted-foreground">Remaining</span>
										<span className="font-semibold tabular-nums">
											{formatCurrency(a.remaining)}
										</span>
									</div>
								</div>
							</section>
						);
					})}
				</div>

				<Panel
					dense
					title="Accumulator detail"
					action={<Wallet className="size-3.5 text-muted-foreground" />}
				>
					<TableScroll>
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="h-9 text-xs">Accumulator</TableHead>
									<TableHead className="h-9 text-right text-xs">
										Individual
									</TableHead>
									<TableHead className="h-9 text-right text-xs">
										Family
									</TableHead>
									<TableHead className="h-9 text-right text-xs">
										Limit
									</TableHead>
									<TableHead className="h-9 text-right text-xs">
										Remaining
									</TableHead>
									<TableHead className="h-9 text-xs">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{member.accumulators.map((a) => (
									<TableRow key={a.id}>
										<TableCell className="py-2.5 text-sm font-medium">
											{a.label}
										</TableCell>
										<TableCell className="py-2.5 text-right text-sm tabular-nums">
											{formatCurrency(a.individual)}
										</TableCell>
										<TableCell className="py-2.5 text-right text-sm tabular-nums">
											{formatCurrency(a.family)}
										</TableCell>
										<TableCell className="py-2.5 text-right text-sm tabular-nums">
											{formatCurrency(a.limit)}
										</TableCell>
										<TableCell className="py-2.5 text-right text-sm tabular-nums">
											{formatCurrency(a.remaining)}
										</TableCell>
										<TableCell className="py-2.5">
											<span
												className={cn(
													"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
													a.remaining <= 0
														? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
														: "bg-muted text-muted-foreground"
												)}
											>
												{a.remaining <= 0 ? "Met" : "Open"}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableScroll>
					<p className="mt-3 text-[11px] text-muted-foreground">
						Plan year accumulators for {member.planName} · Data as of{" "}
						{member.dataAsOf}
					</p>
				</Panel>
			</div>
		);
	}

	if (tab === "Vendor / Source History") {
		const success = member.vendorHistory.filter(
			(v) => v.status === "success"
		).length;
		const warning = member.vendorHistory.filter(
			(v) => v.status === "warning"
		).length;
		const failed = member.vendorHistory.filter(
			(v) => v.status === "failed"
		).length;
		const totalRecords = member.vendorHistory.reduce(
			(s, v) => s + v.recordsProcessed,
			0
		);
		const latest = member.vendorHistory[0];

		return (
			<div className="space-y-4">
				<MetricStrip
					title="Source health"
					items={[
						{
							label: "Feeds",
							value: `${member.vendorHistory.length}`,
						},
						{
							label: "Success",
							value: `${success}`,
							accent: true,
						},
						{ label: "Warning", value: `${warning}` },
						{ label: "Failed", value: `${failed}` },
						{
							label: "Records processed",
							value: totalRecords.toLocaleString("en-US"),
						},
						{
							label: "Primary source",
							value: member.vendorSource,
						},
					]}
				/>

				<div className="grid gap-3 lg:grid-cols-5">
					<Panel
						dense
						title="Latest intake"
						className="lg:col-span-2"
						action={<Building2 className="size-3.5 text-muted-foreground" />}
					>
						{latest ? (
							<div className="space-y-4">
								<div className="rounded-lg border border-border/30 bg-muted/15 p-3.5">
									<p className="text-xs font-medium text-muted-foreground">
										Most recent feed
									</p>
									<p className="mt-1 text-sm font-semibold">{latest.vendor}</p>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{latest.fileFeedType} · {latest.direction}
									</p>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<MetaField
										label="Last received"
										value={
											<span className="tabular-nums text-sm">
												{latest.lastReceived}
											</span>
										}
									/>
									<MetaField
										label="Status"
										value={<FeedStatusPill status={latest.status} />}
									/>
									<MetaField label="Frequency" value={latest.frequency} />
									<MetaField
										label="Records"
										value={latest.recordsProcessed.toLocaleString("en-US")}
									/>
								</div>
								<p className="text-[11px] leading-relaxed text-muted-foreground">
									Vendor feeds drive eligibility, claims, and encounter updates
									for this member. Failed or warning feeds may delay downstream
									adjudication.
								</p>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No vendor history.
							</p>
						)}
					</Panel>

					<Panel
						dense
						title="Feed history"
						className="lg:col-span-3"
						action={
							<span className="text-[11px] text-muted-foreground">
								{member.vendorHistory.length} sources
							</span>
						}
					>
						<TableScroll>
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-9 text-xs">
											Vendor / source
										</TableHead>
										<TableHead className="h-9 text-xs">Feed type</TableHead>
										<TableHead className="h-9 text-xs">Direction</TableHead>
										<TableHead className="h-9 text-xs">Frequency</TableHead>
										<TableHead className="h-9 text-right text-xs">
											Records
										</TableHead>
										<TableHead className="h-9 text-xs">Last received</TableHead>
										<TableHead className="h-9 text-xs">Status</TableHead>
										<TableHead className="h-9 text-right text-xs">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{member.vendorHistory.map((v) => (
										<TableRow key={v.id}>
											<TableCell className="py-2.5 text-sm font-medium">
												{v.vendor}
											</TableCell>
											<TableCell className="py-2.5 text-sm">
												{v.fileFeedType}
											</TableCell>
											<TableCell className="py-2.5 text-sm">
												{v.direction}
											</TableCell>
											<TableCell className="py-2.5 text-sm">
												{v.frequency}
											</TableCell>
											<TableCell className="py-2.5 text-right text-sm tabular-nums">
												{v.recordsProcessed.toLocaleString("en-US")}
											</TableCell>
											<TableCell className="py-2.5 text-sm tabular-nums">
												{v.lastReceived}
											</TableCell>
											<TableCell className="py-2.5">
												<FeedStatusPill status={v.status} />
											</TableCell>
											<TableCell className="py-2.5 text-right">
												<Button
													variant="outline"
													size="sm"
													className="h-7"
													onClick={() => onOpenSourceRecord(v.id)}
												>
													View source
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableScroll>
						<p className="mt-3 text-[11px] text-muted-foreground">
							Data as of {member.dataAsOf}
						</p>
					</Panel>
				</div>
			</div>
		);
	}

	if (tab === "Eligibility Exceptions") {
		const open = member.exceptions.filter((e) => e.status === "open");
		const inProgress = member.exceptions.filter(
			(e) => e.status === "in_progress"
		);
		const resolved = member.exceptions.filter((e) => e.status === "resolved");
		const actionNeeded = [...open, ...inProgress];

		return (
			<div className="space-y-4">
				<div className="flex justify-end">
					<MemberCreateExceptionButton memberId={memberId} />
				</div>
				<MetricStrip
					title="Exception health"
					items={[
						{
							label: "Total",
							value: `${member.exceptions.length}`,
						},
						{ label: "Open", value: `${open.length}` },
						{
							label: "In progress",
							value: `${inProgress.length}`,
						},
						{
							label: "Resolved",
							value: `${resolved.length}`,
							accent: true,
						},
						{
							label: "Action needed",
							value: `${actionNeeded.length}`,
						},
						{
							label: "Eligibility",
							value:
								member.eligibilityStatus === "eligible"
									? "Eligible"
									: member.eligibilityStatus,
							accent: member.eligibilityStatus === "eligible",
						},
					]}
				/>

				<div className="grid gap-3 lg:grid-cols-5">
					<Panel
						dense
						title="Needs attention"
						className="lg:col-span-2"
						action={<ShieldAlert className="size-3.5 text-muted-foreground" />}
					>
						{actionNeeded.length === 0 ? (
							<div className="flex flex-col items-center gap-2 py-6 text-center">
								<span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
									<CheckCircle2 className="size-5" />
								</span>
								<p className="text-sm font-medium">No open exceptions</p>
								<p className="text-xs text-muted-foreground">
									All eligibility exceptions are resolved.
								</p>
							</div>
						) : (
							<ul className="space-y-2.5">
								{actionNeeded.map((ex) => (
									<li
										key={ex.id}
										className="rounded-lg border border-border/30 bg-muted/15 px-3 py-2.5"
									>
										<div className="flex items-start justify-between gap-2">
											<p className="text-sm font-medium text-amber-900">
												{ex.exceptionType}
											</p>
											<ExceptionPill status={ex.status} />
										</div>
										<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
											{ex.description}
										</p>
										<p className="mt-1.5 text-[11px] text-muted-foreground">
											Detected {formatDate(ex.startDetected)} · {ex.source}
										</p>
									</li>
								))}
							</ul>
						)}
					</Panel>

					<Panel
						dense
						title="Exception register"
						className="lg:col-span-3"
						action={
							<span className="text-[11px] text-muted-foreground">
								{member.exceptions.length} records
							</span>
						}
					>
						<TableScroll>
							<Table className="w-full table-fixed">
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-9 w-[16%] text-xs">Type</TableHead>
										<TableHead className="h-9 w-[28%] text-xs">
											Description
										</TableHead>
										<TableHead className="h-9 w-[12%] text-xs">
											Detected
										</TableHead>
										<TableHead className="h-9 w-[12%] text-xs">
											Status
										</TableHead>
										<TableHead className="h-9 w-[14%] text-xs">
											Source
										</TableHead>
										<TableHead className="h-9 w-[14%] text-xs">
											Resolution
										</TableHead>
										<TableHead className="h-9 w-[12%] text-xs">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{member.exceptions.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={7}
												className="h-16 text-center text-sm text-muted-foreground"
											>
												No eligibility exceptions for this member.
											</TableCell>
										</TableRow>
									) : (
										member.exceptions.map((ex) => (
											<TableRow key={ex.id}>
												<TruncateCell className="py-2.5 text-sm font-medium text-amber-900">
													{ex.exceptionType}
												</TruncateCell>
												<TruncateCell className="py-2.5 text-sm text-muted-foreground">
													{ex.description}
												</TruncateCell>
												<TableCell className="py-2.5 text-sm tabular-nums">
													{formatDate(ex.startDetected)}
												</TableCell>
												<TableCell className="py-2.5">
													<ExceptionPill status={ex.status} />
												</TableCell>
												<TruncateCell className="py-2.5 text-sm">
													{ex.source}
												</TruncateCell>
												<TruncateCell className="py-2.5 text-sm text-muted-foreground">
													{ex.resolution}
												</TruncateCell>
												<TableCell className="py-2.5">
													<MemberExceptionRowActions
														memberId={memberId}
														exceptionId={ex.id}
														status={ex.status}
													/>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableScroll>
						<p className="mt-3 text-[11px] text-muted-foreground">
							Exceptions may block eligibility confirmation or claims
							adjudication · Data as of {member.dataAsOf}
						</p>
					</Panel>
				</div>
			</div>
		);
	}

	if (tab === "Change Events") {
		return <MemberChangeEventsPanel memberId={memberId} />;
	}

	return null;
}
