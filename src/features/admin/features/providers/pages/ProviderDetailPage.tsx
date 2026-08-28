"use client";

import { useParams } from "next/navigation";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import {
	ArrowDownRight,
	ArrowUpRight,
	BadgeCheck,
	Building2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	Download,
	Globe,
	GraduationCap,
	Languages,
	Mail,
	MapPin,
	Network,
	PencilLine,
	Phone,
	Stethoscope,
	UserRound,
} from "lucide-react";
import {
	Area,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ComposedChart,
	Legend,
	Line,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";

import { useConfirm } from "@/components/confirm-dialog";
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
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import { VendorCoreLoadingRow } from "@/components/vendor-core/VendorCoreLiveChrome";
import {
	type ClaimActivityStatus,
	type CredentialStatus,
	type ExceptionStatus,
	type FeedStatus,
	type NetworkStatus,
	type ProviderStatus,
	type ProviderSummary,
	displayProviderName,
	formatCompact,
	formatCurrency,
	formatDate,
	getProvider,
	initials,
	providerAge,
} from "@/features/admin/features/providers/feature/api/providersApi";
import {
	useDeleteProviderMutation,
	useProviderDetailQuery,
	useSetProviderStatusMutation,
} from "@/features/admin/features/providers/feature/queries/useProvidersQuery";
import { Link } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
import { cn } from "@/lib/utils";
import { useAdminModuleStore } from "@/stores/admin-module-store";

const TABS = [
	"Overview",
	"Demographics",
	"Identifiers",
	"Enrollment",
	"Network Participation",
	"Locations",
	"Claims & Encounters",
	"Rejection Trends",
	"Vendors / Sources",
	"Credentialing & Exceptions",
] as const;

type TabId = (typeof TABS)[number];

function statusPillClass(positive: boolean, negative: boolean) {
	if (positive) return "border-chart-2/20 bg-chart-2/10 text-chart-2";
	if (negative)
		return "border-destructive/20 bg-destructive/10 text-destructive";
	return "border-border/60 bg-muted text-muted-foreground";
}

function StatusPill({ status }: { status: ProviderStatus }) {
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

function NetworkPill({ status }: { status: NetworkStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold",
				statusPillClass(status === "in_network", status === "out_of_network")
			)}
		>
			{status === "in_network"
				? "In-Network"
				: status === "out_of_network"
					? "Out-of-Network"
					: "Pending"}
		</span>
	);
}

function FeedPill({ status }: { status: FeedStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				statusPillClass(status === "active", status === "inactive")
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

function ClaimStatusPill({ status }: { status: ClaimActivityStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				statusPillClass(
					status === "paid" || status === "accepted",
					status === "denied" || status === "rejected"
				)
			)}
		>
			{status}
		</span>
	);
}

const PROVIDER_UI = {
	radius: "rounded-xl",
	radiusSm: "rounded-md",
	surface: "overflow-hidden border border-border/50 bg-card",
	label:
		"text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground",
	labelAccent:
		"text-[10px] font-medium uppercase tracking-[0.08em] text-primary/80",
	title: "text-sm font-semibold tracking-tight text-foreground",
} as const;

function SurfaceTopAccent() {
	return (
		<div
			className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/35 to-transparent"
			aria-hidden
		/>
	);
}

function Sheet({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"overflow-hidden rounded-xl border border-border/40 bg-card",
				className
			)}
		>
			{children}
		</section>
	);
}

/** Vertical separator: solid in the middle, fades at top and bottom. */
function FadeVLine({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-y-5 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent",
				className
			)}
		/>
	);
}

const FADE_SPLIT_LG =
	"lg:[&>*+*]:relative lg:[&>*+*]:before:pointer-events-none lg:[&>*+*]:before:absolute lg:[&>*+*]:before:inset-y-5 lg:[&>*+*]:before:left-0 lg:[&>*+*]:before:w-px lg:[&>*+*]:before:bg-gradient-to-b lg:[&>*+*]:before:from-transparent lg:[&>*+*]:before:via-border lg:[&>*+*]:before:to-transparent lg:[&>*+*]:before:content-['']";

const FADE_SPLIT_XL =
	"xl:[&>*+*]:relative xl:[&>*+*]:before:pointer-events-none xl:[&>*+*]:before:absolute xl:[&>*+*]:before:inset-y-5 xl:[&>*+*]:before:left-0 xl:[&>*+*]:before:w-px xl:[&>*+*]:before:bg-gradient-to-b xl:[&>*+*]:before:from-transparent xl:[&>*+*]:before:via-border xl:[&>*+*]:before:to-transparent xl:[&>*+*]:before:content-['']";

function SectionTitle({
	title,
	icon: Icon,
	action,
	className,
}: {
	title: string;
	icon?: typeof BadgeCheck;
	action?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			{Icon ? (
				<Icon className="size-4 text-primary/75" strokeWidth={2} />
			) : null}
			<h3 className={cn("min-w-0 flex-1", PROVIDER_UI.title)}>{title}</h3>
			{action}
		</div>
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
	icon?: typeof BadgeCheck;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	dense?: boolean;
}) {
	return (
		<section className={cn("flex min-w-0 flex-col", className)}>
			<SectionTitle
				title={title}
				icon={Icon}
				action={action}
				className={dense ? "px-5 pt-5 pb-3" : "px-6 pt-5 pb-3"}
			/>
			<div className={cn("min-h-0 flex-1", dense ? "px-5 pb-5" : "px-6 pb-6")}>
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
			className="mt-4 text-sm font-medium text-primary hover:underline"
		>
			{label} →
		</button>
	);
}

function MetaField({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="min-w-0 space-y-1.5">
			<p className="text-[11px] font-normal text-muted-foreground">{label}</p>
			<div className="text-sm font-medium leading-snug text-foreground break-words">
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
		<div className="group flex items-center justify-between gap-4 border-b border-border/20 py-2.5 transition-colors last:border-b-0 hover:bg-muted/[0.08]">
			<span className="shrink-0 text-[13px] leading-snug text-muted-foreground transition-colors group-hover:text-foreground/70">
				{label}
			</span>
			<span
				className={cn(
					"min-w-0 text-right text-sm leading-snug font-medium text-foreground",
					valueClassName
				)}
			>
				{value ?? "—"}
			</span>
		</div>
	);
}

function ProfileStatusBadge({ status }: { status: ProviderStatus }) {
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
				"inline-flex rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
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
		<div className="min-w-0 space-y-1.5">
			<p className={accent ? PROVIDER_UI.labelAccent : PROVIDER_UI.label}>
				{label}
			</p>
			<div
				className={cn(
					"text-sm font-medium leading-snug",
					accent ? "text-primary" : "text-foreground",
					mono && "font-mono text-[13px] tabular-nums tracking-tight"
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
		<section className={cn(!embedded && "overflow-hidden", className)}>
			{title ? (
				<div className="px-5 pt-4 pb-1 sm:px-6">
					<p className={PROVIDER_UI.label}>{title}</p>
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
									? "min-w-[7.5rem] px-4 py-4 sm:min-w-[8.5rem] sm:px-5"
									: "min-w-[8.5rem] px-5 py-4 sm:px-6",
								index > 0 && "border-l border-border/25"
							)}
						>
							<div className="flex items-center gap-1.5">
								<span
									className={cn(
										"size-1.5 shrink-0 rounded-full",
										METRIC_DOT_TONES[index % METRIC_DOT_TONES.length]
									)}
								/>
								<p className={PROVIDER_UI.label}>{item.label}</p>
							</div>
							<div
								className={cn(
									"mt-1.5 truncate text-sm font-medium",
									item.mono &&
										"font-mono text-[13px] tabular-nums tracking-tight",
									item.accent ? "text-primary" : "text-foreground"
								)}
							>
								{item.value ?? "—"}
							</div>
							{item.sub ? (
								<p className="mt-1 truncate text-[11px] leading-snug text-muted-foreground">
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

function Trend({ value }: { value: number }) {
	const up = value >= 0;
	const Icon = up ? ArrowUpRight : ArrowDownRight;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 text-[10px] font-medium tabular-nums",
				up ? "text-chart-2" : "text-destructive"
			)}
		>
			<Icon className="size-3" />
			{up ? "+" : ""}
			{value}%
		</span>
	);
}

function ProviderTabsNav({
	tab,
	onTabChange,
}: {
	tab: TabId;
	onTabChange: (next: TabId) => void;
}) {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(false);

	const updateOverflow = useCallback(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const max = el.scrollWidth - el.clientWidth;
		setCanLeft(el.scrollLeft > 2);
		setCanRight(max - el.scrollLeft > 2);
	}, []);

	useEffect(() => {
		const el = scrollerRef.current;
		if (!el) return;
		updateOverflow();
		el.addEventListener("scroll", updateOverflow, { passive: true });
		const ro = new ResizeObserver(updateOverflow);
		ro.observe(el);
		return () => {
			el.removeEventListener("scroll", updateOverflow);
			ro.disconnect();
		};
	}, [updateOverflow]);

	useEffect(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const active = el.querySelector<HTMLElement>('[data-active-tab="true"]');
		active?.scrollIntoView({
			behavior: "smooth",
			inline: "nearest",
			block: "nearest",
		});
		requestAnimationFrame(updateOverflow);
	}, [tab, updateOverflow]);

	function scrollByDir(dir: -1 | 1) {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollBy({
			left: dir * Math.max(160, el.clientWidth * 0.55),
			behavior: "smooth",
		});
	}

	return (
		<nav
			className={cn(
				"relative flex items-center gap-0.5 overflow-hidden border border-border/50 bg-card p-1",
				PROVIDER_UI.radius
			)}
		>
			<button
				type="button"
				aria-label="Scroll tabs left"
				disabled={!canLeft}
				onClick={() => scrollByDir(-1)}
				className={cn(
					"flex size-7 shrink-0 items-center justify-center rounded-md transition-opacity",
					canLeft
						? "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
						: "pointer-events-none opacity-0"
				)}
			>
				<ChevronLeft className="size-3.5" />
			</button>
			<div
				ref={scrollerRef}
				className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{TABS.map((item) => (
					<button
						key={item}
						type="button"
						data-active-tab={tab === item ? "true" : undefined}
						onClick={() => onTabChange(item)}
						className={cn(
							"shrink-0 px-3 py-2 text-[11px] font-bold tracking-wide whitespace-nowrap transition-all",
							PROVIDER_UI.radiusSm,
							tab === item
								? "bg-foreground text-background"
								: "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
						)}
					>
						{item}
					</button>
				))}
			</div>
			<button
				type="button"
				aria-label="Scroll tabs right"
				disabled={!canRight}
				onClick={() => scrollByDir(1)}
				className={cn(
					"flex size-7 shrink-0 items-center justify-center rounded-md transition-opacity",
					canRight
						? "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
						: "pointer-events-none opacity-0"
				)}
			>
				<ChevronRight className="size-3.5" />
			</button>
		</nav>
	);
}

export function ProviderDetailPage({
	providerId: providerIdProp,
}: {
	providerId?: string;
}) {
	const params = useParams<{ providerId?: string | string[] }>();
	const raw = providerIdProp ?? params.providerId;
	const providerId = decodeURIComponent(
		Array.isArray(raw) ? (raw[0] ?? "") : String(raw ?? "")
	);
	const useApi = !isMockEnabled();
	const programFilter = useAdminModuleStore(
		(s) => s.fileType
	) as ProviderSummary["program"];
	const detailQuery = useProviderDetailQuery(providerId, useApi, programFilter);
	const mockProvider = useMemo(
		() => (!useApi && providerId ? getProvider(providerId) : undefined),
		[useApi, providerId]
	);
	const provider = useApi ? detailQuery.data : mockProvider;
	const [tab, setTab] = useState<TabId>("Overview");
	const setStatusMutation = useSetProviderStatusMutation();
	const deleteProviderMutation = useDeleteProviderMutation();
	const [lifecycleBusy, setLifecycleBusy] = useState(false);
	const confirm = useConfirm();

	async function handleSetStatus(status: ProviderStatus): Promise<void> {
		if (!providerId) return;
		if (!useApi) {
			toast.info("Live-only action. Enable vendor-core mode.");
			return;
		}
		setLifecycleBusy(true);
		try {
			await setStatusMutation.mutateAsync({ id: providerId, body: { status } });
			toast.success(`Provider status updated to ${status}.`);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update status.";
			toast.error(message);
		} finally {
			setLifecycleBusy(false);
		}
	}

	async function handleArchiveProvider(): Promise<void> {
		if (!providerId) return;
		if (!useApi) {
			toast.info("Live-only action. Enable vendor-core mode.");
			return;
		}
		const ok = await confirm({
			title: "Archive this provider?",
			description:
				"It will be removed from the default directory. You can restore it later from archived providers.",
			confirmLabel: "Archive provider",
			cancelLabel: "Keep provider",
			variant: "destructive",
			icon: "archive",
		});
		if (!ok) return;
		setLifecycleBusy(true);
		try {
			await deleteProviderMutation.mutateAsync({ id: providerId });
			toast.success("Provider archived.");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to archive provider.";
			toast.error(message);
		} finally {
			setLifecycleBusy(false);
		}
	}

	const body = (() => {
		if (
			useApi &&
			!detailQuery.data &&
			(detailQuery.isPending || detailQuery.isFetching || detailQuery.isLoading)
		) {
			return <VendorCoreLoadingRow label="Loading provider…" />;
		}

		if (useApi && detailQuery.error) {
			return (
				<div className="space-y-3">
					<p className="text-sm text-destructive">
						{detailQuery.error.message}
					</p>
					<Button asChild variant="outline" size="sm">
						<Link href="/admin/providers">Back to providers</Link>
					</Button>
				</div>
			);
		}

		if (!provider) {
			return (
				<div className="space-y-3">
					<p className="text-sm text-destructive">Provider not found.</p>
					<Button asChild variant="outline" size="sm">
						<Link href="/admin/providers">Back to providers</Link>
					</Button>
				</div>
			);
		}

		const credCounts: Record<CredentialStatus, number> = {
			complete: 0,
			expiring: 0,
			expired: 0,
			pending: 0,
		};
		for (const c of provider.credentialing) credCounts[c.status] += 1;

		const name = displayProviderName(provider);

		const credTotal =
			credCounts.complete +
			credCounts.expiring +
			credCounts.expired +
			credCounts.pending;
		const credPct = credTotal
			? Math.round((credCounts.complete / credTotal) * 100)
			: 0;

		const donutData = [
			{ name: "Complete", value: credCounts.complete, fill: "#059669" },
			{ name: "Expiring", value: credCounts.expiring, fill: "#f59e0b" },
			{ name: "Expired", value: credCounts.expired, fill: "#ef4444" },
			{ name: "Pending", value: credCounts.pending, fill: "#94a3b8" },
		].filter((d) => d.value > 0);

		const primaryNetwork = provider.networks[0];
		const age = providerAge(provider.dob);

		return (
			<div className="space-y-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground">
						<span>Providers</span>
						<span className="mx-1.5 text-border/80">/</span>
						<span className="font-semibold text-foreground">
							Provider Profile
						</span>
					</p>
					<div className="flex flex-wrap items-center gap-1.5">
						<Button
							asChild
							variant="outline"
							size="sm"
							className="h-9 rounded-md border-border/70 bg-card px-3.5 text-xs shadow-none"
						>
							<Link href={`/admin/providers/${providerId}/edit`}>
								<PencilLine className="mr-1 size-3" />
								Edit
							</Link>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-9 rounded-md border-border/70 bg-card px-3.5 text-xs shadow-none"
								>
									Provider Summary
									<ChevronDown className="ml-1 size-3 opacity-60" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => toast.message("Opening provider summary…")}
								>
									One-page summary
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => toast.message("Opening enrollment packet…")}
								>
									Enrollment packet
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="sm"
									className="h-9 rounded-md px-3.5 text-xs shadow-none"
								>
									<Download className="mr-1 size-3" />
									Export
									<ChevronDown className="ml-1 size-3 opacity-80" />
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-9 rounded-md border-border/70 bg-card px-3.5 text-xs shadow-none"
									disabled={
										lifecycleBusy ||
										setStatusMutation.isPending ||
										deleteProviderMutation.isPending
									}
								>
									Lifecycle
									<ChevronDown className="ml-1 size-3 opacity-60" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => void handleSetStatus("active")}
								>
									Set status: Active
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => void handleSetStatus("pending")}
								>
									Set status: Pending
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => void handleSetStatus("inactive")}
								>
									Set status: Inactive
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => void handleSetStatus("termed")}
								>
									Set status: Termed
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={() => void handleArchiveProvider()}
								>
									Archive provider
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Identity header */}
				<section
					className={cn("relative", PROVIDER_UI.surface, PROVIDER_UI.radius)}
				>
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

					<div className="relative border-b border-border/30 px-5 py-5 sm:px-6">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6 xl:gap-8">
							<div className="flex min-w-0 items-center gap-4 lg:max-w-[24rem] lg:shrink-0">
								<div className="relative shrink-0">
									<div className="flex size-12 items-center justify-center rounded-full border-2 border-primary/15 bg-primary text-xs font-semibold text-primary-foreground">
										{initials(provider.name)}
									</div>
									{provider.status === "active" ? (
										<span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-chart-2" />
									) : null}
								</div>
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2.5">
										<h1 className="text-lg font-semibold tracking-tight text-primary">
											{name}
										</h1>
										<ProfileStatusBadge status={provider.status} />
									</div>
									<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
										{provider.specialty}
										<span className="mx-1.5 text-border/80">·</span>
										{provider.subspecialty}
										<span className="mx-1.5 text-border/80">·</span>
										{provider.providerType}
									</p>
								</div>
							</div>

							<div
								className="relative hidden w-px shrink-0 self-stretch lg:block"
								aria-hidden
							>
								<span className="absolute inset-y-1 left-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
							</div>

							<div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-x-8">
								<HeaderField label="NPI" value={provider.npi} accent mono />
								<HeaderField
									label="Tax ID"
									value={provider.taxId}
									accent
									mono
								/>
								<HeaderField label="UPIN" value={provider.upin} accent mono />
								<HeaderField
									label="Medicaid ID"
									value={provider.medicaidId}
									accent
									mono
								/>
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
								value: formatDate(provider.dob),
								sub:
									age != null
										? `Age ${age} · ${provider.gender}`
										: provider.gender,
							},
							{
								label: "Practice",
								value: provider.practiceName,
								sub: provider.practiceCity
									? `${provider.practiceCity}, ${provider.practiceState}`
									: undefined,
								accent: true,
							},
							{
								label: "Years in Practice",
								value: `${provider.yearsInPractice} yrs`,
							},
							{
								label: "Enrollment",
								value:
									provider.enrollmentStatus === "enrolled"
										? "Enrolled"
										: provider.enrollmentStatus,
								sub: `Eff. ${formatDate(provider.enrollmentEffective)}`,
								accent: provider.enrollmentStatus === "enrolled",
							},
							{
								label: "Program",
								value: provider.program,
							},
							{
								label: "Patients",
								value: provider.acceptingNewPatients ? "Accepting" : "Closed",
								accent: provider.acceptingNewPatients,
							},
							{
								label: "Source",
								value: provider.vendors[0]?.vendor ?? "—",
							},
						]}
					/>
				</section>

				<ProviderTabsNav tab={tab} onTabChange={setTab} />

				{tab === "Overview" ? (
					<div className="space-y-5">
						<Sheet>
							<div className="grid sm:grid-cols-2 xl:grid-cols-4">
								<div className="relative px-5 py-5">
									<FadeVLine className="hidden sm:block" />
									<SectionTitle
										title="Enrollment"
										icon={BadgeCheck}
										className="mb-3"
									/>
									<OverviewRow
										label="Status"
										value={
											provider.enrollmentStatus === "enrolled" ? (
												<span className="text-chart-2">Enrolled</span>
											) : (
												<span className="capitalize">
													{provider.enrollmentStatus}
												</span>
											)
										}
									/>
									<OverviewRow
										label="Effective"
										value={formatDate(provider.enrollmentEffective)}
									/>
									<OverviewRow label="Program" value={provider.program} />
									<OverviewRow
										label="Provider status"
										value={<ProfileStatusBadge status={provider.status} />}
									/>
								</div>
								<div className="relative border-t border-border/30 px-5 py-5 sm:border-t-0">
									<FadeVLine className="hidden xl:block" />
									<SectionTitle
										title="Practice"
										icon={Building2}
										className="mb-3"
									/>
									<OverviewRow
										label="Organization"
										value={provider.practiceName}
									/>
									<OverviewRow
										label="Address"
										value={`${provider.practiceCity}, ${provider.practiceState}`}
									/>
									<OverviewRow label="Phone" value={provider.practicePhone} />
									<OverviewRow
										label="Email"
										value={
											<span
												className="block max-w-[160px] truncate"
												title={provider.email}
											>
												{provider.email}
											</span>
										}
									/>
								</div>
								<div className="relative border-t border-border/30 px-5 py-5 xl:border-t-0">
									<FadeVLine className="hidden sm:block" />
									<SectionTitle
										title="Network"
										icon={Network}
										className="mb-3"
									/>
									<OverviewRow
										label="Plans"
										value={String(provider.networks.length)}
									/>
									<OverviewRow
										label="Primary"
										value={primaryNetwork?.networkPlan ?? "—"}
									/>
									<OverviewRow
										label="Status"
										value={
											primaryNetwork ? (
												<NetworkPill status={primaryNetwork.status} />
											) : (
												"—"
											)
										}
									/>
									<OverviewRow
										label="Locations"
										value={String(provider.locations.length)}
									/>
								</div>
								<div className="border-t border-border/30 px-5 py-5 xl:border-t-0">
									<SectionTitle
										title="Credentialing"
										icon={ClipboardList}
										className="mb-3"
									/>
									<OverviewRow label="Complete" value={`${credPct}%`} />
									<OverviewRow
										label="Complete / total"
										value={`${credCounts.complete} / ${credTotal}`}
									/>
									<OverviewRow
										label="Expiring"
										value={String(credCounts.expiring)}
									/>
									<OverviewRow
										label="Open exceptions"
										value={String(provider.exceptions.length)}
									/>
								</div>
							</div>
							<div className="border-t border-border/30 bg-muted/10">
								<MetricStrip
									embedded
									compact
									title="12-month performance"
									items={[
										{
											label: "Claims",
											value: formatCompact(provider.claims12m),
											sub: <Trend value={provider.claimsTrendPct} />,
										},
										{
											label: "Encounters",
											value: formatCompact(provider.encounters12m),
											sub: <Trend value={provider.encountersTrendPct} />,
										},
										{
											label: "Total billed",
											value: formatCurrency(provider.billed12m),
											sub: <Trend value={provider.billedTrendPct} />,
										},
										{
											label: "Total paid",
											value: formatCurrency(provider.paid12m),
											sub: <Trend value={provider.paidTrendPct} />,
										},
										{
											label: "Rejection rate",
											value: `${provider.rejectionRate}%`,
											sub: <Trend value={provider.rejectionTrendPct} />,
											accent: provider.rejectionRate < 7,
										},
										{
											label: "Net payment",
											value: formatCurrency(provider.netPayment12m),
											sub: <Trend value={provider.netPaymentTrendPct} />,
										},
									]}
								/>
							</div>
						</Sheet>

						<Sheet>
							<div className={cn("grid lg:grid-cols-2", FADE_SPLIT_LG)}>
								<Panel dense icon={MapPin} title="Locations">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="hover:bg-transparent">
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Location
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Status
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Primary
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{provider.locations.map((loc) => (
													<TableRow key={loc.id}>
														<TableCell className="py-3">
															<p className="text-sm font-medium">{loc.name}</p>
															<p className="text-xs leading-relaxed text-muted-foreground">
																{loc.address}
															</p>
														</TableCell>
														<TableCell className="py-3">
															<StatusPill status={loc.status} />
														</TableCell>
														<TableCell className="py-3 text-xs">
															{loc.isPrimary ? "Yes" : "No"}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
									<ViewAllLink
										label={`View all (${provider.locations.length})`}
										onClick={() => setTab("Locations")}
									/>
								</Panel>
								<Panel dense icon={Network} title="Network participation">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="hover:bg-transparent">
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Network
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Status
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Effective
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{provider.networks.slice(0, 5).map((n) => (
													<TableRow key={n.id}>
														<TableCell className="py-3">
															<p className="text-sm font-medium">
																{n.networkPlan}
															</p>
															<p className="text-xs text-muted-foreground">
																{n.payer}
															</p>
														</TableCell>
														<TableCell className="py-3">
															<NetworkPill status={n.status} />
														</TableCell>
														<TableCell className="py-3 text-xs tabular-nums">
															{formatDate(n.effectiveDate)}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
									<ViewAllLink
										label={`View all (${provider.networks.length})`}
										onClick={() => setTab("Network Participation")}
									/>
								</Panel>
							</div>
							<div className="border-t border-border/30 px-5 py-5">
								<SectionTitle
									title="Identifiers"
									icon={BadgeCheck}
									action={
										<button
											type="button"
											className="text-sm font-medium text-primary hover:underline"
											onClick={() => setTab("Identifiers")}
										>
											View all →
										</button>
									}
									className="mb-4"
								/>
								<div className="flex flex-wrap gap-2.5">
									{provider.identifiers.map((id) => (
										<div
											key={id.id}
											className="min-w-0 rounded-lg bg-muted/35 px-3.5 py-2.5"
										>
											<p className={PROVIDER_UI.label}>{id.label}</p>
											<p className="mt-1 font-mono text-sm font-medium tabular-nums">
												{id.value}
											</p>
										</div>
									))}
								</div>
							</div>
						</Sheet>

						<Sheet>
							<div className={cn("grid lg:grid-cols-2", FADE_SPLIT_LG)}>
								<Panel dense icon={Stethoscope} title="Claims & encounters">
									<div className="h-[260px]">
										<ResponsiveContainer width="100%" height="100%">
											<ComposedChart data={provider.monthlyVolume}>
												<CartesianGrid strokeDasharray="3 3" vertical={false} />
												<XAxis dataKey="month" tick={{ fontSize: 10 }} />
												<YAxis tick={{ fontSize: 10 }} width={36} />
												<Tooltip />
												<Legend wrapperStyle={{ fontSize: 11 }} />
												<Bar
													dataKey="claims"
													name="Claims"
													fill="#13446c"
													radius={[3, 3, 0, 0]}
												/>
												<Line
													type="monotone"
													dataKey="encounters"
													name="Encounters"
													stroke="#059669"
													strokeWidth={2}
													dot={{ r: 3 }}
												/>
											</ComposedChart>
										</ResponsiveContainer>
									</div>
									<ViewAllLink
										label="View claims & encounters"
										onClick={() => setTab("Claims & Encounters")}
									/>
								</Panel>
								<Panel dense icon={ArrowDownRight} title="Rejection trends">
									<div className="h-[260px]">
										<ResponsiveContainer width="100%" height="100%">
											<ComposedChart data={provider.monthlyVolume}>
												<CartesianGrid strokeDasharray="3 3" vertical={false} />
												<XAxis dataKey="month" tick={{ fontSize: 10 }} />
												<YAxis
													yAxisId="left"
													tick={{ fontSize: 10 }}
													width={28}
												/>
												<YAxis
													yAxisId="right"
													orientation="right"
													tick={{ fontSize: 10 }}
													width={32}
													unit="%"
												/>
												<Tooltip />
												<Legend wrapperStyle={{ fontSize: 11 }} />
												<Bar
													yAxisId="left"
													dataKey="rejectionCount"
													name="Rejection Count"
													fill="#fecaca"
													radius={[3, 3, 0, 0]}
												/>
												<Area
													yAxisId="right"
													type="monotone"
													dataKey="rejectionRate"
													name="Rejection Rate (%)"
													stroke="#ef4444"
													fill="#ef444422"
													strokeWidth={2}
												/>
											</ComposedChart>
										</ResponsiveContainer>
									</div>
									<ViewAllLink
										label="View rejection details"
										onClick={() => setTab("Rejection Trends")}
									/>
								</Panel>
							</div>
							<div className="border-t border-border/30">
								<Panel dense icon={ClipboardList} title="Top rejection reasons">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="hover:bg-transparent">
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Reason
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-right text-[11px] font-medium uppercase tracking-wide">
														Count
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-right text-[11px] font-medium uppercase tracking-wide">
														%
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{provider.rejectionReasons.map((r) => (
													<TableRow key={r.id}>
														<TableCell className="py-3 text-xs">
															{r.reason}
														</TableCell>
														<TableCell className="py-3 text-right text-xs tabular-nums">
															{r.count}
														</TableCell>
														<TableCell className="py-3 text-right text-xs tabular-nums">
															{r.pct}%
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</Panel>
							</div>
						</Sheet>

						<Sheet>
							<div className={cn("grid lg:grid-cols-2", FADE_SPLIT_LG)}>
								<Panel dense icon={Building2} title="Vendors / sources">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="hover:bg-transparent">
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Vendor
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Feed
													</TableHead>
													<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
														Status
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{provider.vendors.map((v) => (
													<TableRow key={v.id}>
														<TableCell className="py-3">
															<p className="text-sm font-medium">{v.vendor}</p>
															<p className="text-xs text-muted-foreground">
																{v.frequency} · {v.lastReceived}
															</p>
														</TableCell>
														<TableCell className="py-3 text-xs">
															{v.fileType}
														</TableCell>
														<TableCell className="py-3">
															<FeedPill status={v.status} />
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
									<ViewAllLink
										label="View all vendors / sources"
										onClick={() => setTab("Vendors / Sources")}
									/>
								</Panel>
								<Panel dense icon={BadgeCheck} title="Credentialing">
									<div className="flex flex-col items-center gap-3 sm:flex-row">
										<div className="relative h-[160px] w-[160px] shrink-0">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie
														data={donutData}
														dataKey="value"
														nameKey="name"
														innerRadius={48}
														outerRadius={68}
														paddingAngle={2}
													>
														{donutData.map((d) => (
															<Cell key={d.name} fill={d.fill} />
														))}
													</Pie>
												</PieChart>
											</ResponsiveContainer>
											<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
												<p className="text-lg font-semibold tabular-nums">
													{credPct}%
												</p>
												<p className="text-xs text-muted-foreground">
													Complete
												</p>
											</div>
										</div>
										<ul className="w-full space-y-2 text-sm">
											{[
												{
													label: "Complete",
													value: credCounts.complete,
													color: "bg-chart-2",
												},
												{
													label: "Expiring",
													value: credCounts.expiring,
													color: "bg-chart-3",
												},
												{
													label: "Expired",
													value: credCounts.expired,
													color: "bg-destructive",
												},
												{
													label: "Pending",
													value: credCounts.pending,
													color: "bg-muted-foreground/50",
												},
											].map((row) => (
												<li
													key={row.label}
													className="flex items-center justify-between gap-2"
												>
													<span className="flex items-center gap-2">
														<span
															className={cn("size-2.5 rounded-full", row.color)}
														/>
														{row.label}
													</span>
													<span className="font-medium tabular-nums">
														{row.value}
													</span>
												</li>
											))}
										</ul>
									</div>
									<ViewAllLink
										label="View credentialing details"
										onClick={() => setTab("Credentialing & Exceptions")}
									/>
								</Panel>
							</div>
							<div className="border-t border-border/30">
								<Panel
									dense
									icon={ClipboardList}
									title="Credentialing & enrollment exceptions"
								>
									{provider.exceptions.length === 0 ? (
										<p className="text-sm text-muted-foreground">
											No open exceptions.
										</p>
									) : (
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow className="hover:bg-transparent">
														<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
															Type
														</TableHead>
														<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
															Status
														</TableHead>
														<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
															Date
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{provider.exceptions.map((ex) => (
														<TableRow key={ex.id}>
															<TableCell className="py-3">
																<p className="text-sm font-medium text-chart-3">
																	{ex.exceptionType}
																</p>
																<p className="text-xs text-muted-foreground">
																	{ex.description}
																</p>
															</TableCell>
															<TableCell className="py-3">
																<ExceptionPill status={ex.status} />
															</TableCell>
															<TableCell className="py-3 text-xs tabular-nums">
																{formatDate(ex.dateIdentified)}
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									)}
									<ViewAllLink
										label="View all exceptions"
										onClick={() => setTab("Credentialing & Exceptions")}
									/>
								</Panel>
							</div>
						</Sheet>

						<footer className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
							<p>All dates and times are displayed in Eastern Time (ET).</p>
							<p>Data as of {provider.dataAsOf}</p>
						</footer>
					</div>
				) : (
					<TabBody tab={tab} provider={provider} />
				)}
			</div>
		);
	})();

	if (useApi) {
		return <VendorCoreGate title="Provider">{body}</VendorCoreGate>;
	}
	return body;
}

function ClaimsEncountersTab({
	provider,
}: {
	provider: NonNullable<ReturnType<typeof getProvider>>;
}) {
	const [pane, setPane] = useState<"claims" | "encounters">("claims");
	const rows =
		pane === "claims" ? provider.recentClaims : provider.recentEncounters;

	const totals = provider.monthlyVolume.reduce(
		(acc, m) => {
			acc.claims += m.claims;
			acc.encounters += m.encounters;
			acc.rejections += m.rejectionCount;
			return acc;
		},
		{ claims: 0, encounters: 0, rejections: 0 }
	);
	const avgRejection =
		Math.round(
			(provider.monthlyVolume.reduce((s, m) => s + m.rejectionRate, 0) /
				provider.monthlyVolume.length) *
				100
		) / 100;

	return (
		<Sheet>
			<div className="bg-muted/10">
				<MetricStrip
					title="12-month performance"
					items={[
						{
							label: "Claims",
							value: formatCompact(provider.claims12m),
						},
						{
							label: "Encounters",
							value: formatCompact(provider.encounters12m),
						},
						{
							label: "Billed",
							value: formatCurrency(provider.billed12m),
						},
						{
							label: "Paid",
							value: formatCurrency(provider.paid12m),
						},
						{
							label: "Net payment",
							value: formatCurrency(provider.netPayment12m),
						},
						{
							label: "Rejection rate",
							value: `${provider.rejectionRate}%`,
							accent: provider.rejectionRate < 7,
						},
					]}
				/>
			</div>

			<div
				className={cn(
					"grid border-t border-border/30 lg:grid-cols-5",
					FADE_SPLIT_LG
				)}
			>
				<Panel
					dense
					icon={Stethoscope}
					title="Volume trend"
					className="lg:col-span-3"
					action={
						<span className="text-[11px] text-muted-foreground">
							Claims vs encounters
						</span>
					}
				>
					<div className="h-[260px]">
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={provider.monthlyVolume}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="month" tick={{ fontSize: 10 }} />
								<YAxis tick={{ fontSize: 10 }} width={40} />
								<Tooltip />
								<Legend wrapperStyle={{ fontSize: 11 }} />
								<Bar
									dataKey="claims"
									name="Claims"
									fill="#13446c"
									radius={[3, 3, 0, 0]}
								/>
								<Line
									type="monotone"
									dataKey="encounters"
									name="Encounters"
									stroke="#059669"
									strokeWidth={2}
									dot={{ r: 2.5 }}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</div>
				</Panel>

				<Panel
					dense
					icon={ClipboardList}
					title="Period summary"
					className="lg:col-span-2"
					action={
						<span className="text-[11px] text-muted-foreground">
							Trailing 12 months
						</span>
					}
				>
					<div className="space-y-3">
						<div className="grid grid-cols-2 gap-2.5">
							{[
								{
									label: "Total claims",
									value: formatCompact(totals.claims),
									trend: provider.claimsTrendPct,
								},
								{
									label: "Total encounters",
									value: formatCompact(totals.encounters),
									trend: provider.encountersTrendPct,
								},
								{
									label: "Rejections",
									value: formatCompact(totals.rejections),
									trend: provider.rejectionTrendPct,
								},
								{
									label: "Avg rejection",
									value: `${avgRejection}%`,
									trend: provider.rejectionTrendPct,
								},
							].map((item) => (
								<div
									key={item.label}
									className="rounded-lg border border-border/30 bg-muted/15 px-3 py-2.5"
								>
									<p className="text-[11px] text-muted-foreground">
										{item.label}
									</p>
									<p className="mt-1 text-sm font-semibold tabular-nums">
										{item.value}
									</p>
									<div className="mt-1">
										<Trend value={item.trend} />
									</div>
								</div>
							))}
						</div>
						<div className="overflow-x-auto rounded-lg border border-border/30">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-8 text-[11px]">Month</TableHead>
										<TableHead className="h-8 text-right text-[11px]">
											Claims
										</TableHead>
										<TableHead className="h-8 text-right text-[11px]">
											Enc.
										</TableHead>
										<TableHead className="h-8 text-right text-[11px]">
											Rej %
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{provider.monthlyVolume.slice(-4).map((m) => (
										<TableRow key={m.month}>
											<TableCell className="py-2.5 text-xs font-medium">
												{m.month}
											</TableCell>
											<TableCell className="py-2.5 text-right text-xs tabular-nums">
												{m.claims}
											</TableCell>
											<TableCell className="py-2.5 text-right text-xs tabular-nums">
												{m.encounters}
											</TableCell>
											<TableCell className="py-2.5 text-right text-xs tabular-nums">
												{m.rejectionRate}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</Panel>
			</div>

			<div className="border-t border-border/30">
				<Panel
					dense
					icon={Stethoscope}
					title="Recent activity"
					action={
						<div className="flex items-center gap-0.5 rounded-sm bg-muted/40 p-0.5">
							{(
								[
									{
										id: "claims" as const,
										label: `Claims (${provider.recentClaims.length})`,
									},
									{
										id: "encounters" as const,
										label: `Encounters (${provider.recentEncounters.length})`,
									},
								] as const
							).map((p) => (
								<button
									key={p.id}
									type="button"
									onClick={() => setPane(p.id)}
									className={cn(
										"rounded-sm px-2.5 py-1 text-xs font-medium transition-all",
										pane === p.id
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-background/80 hover:text-foreground"
									)}
								>
									{p.label}
								</button>
							))}
						</div>
					}
				>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										DOS
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Claim #
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Member
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Type
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Code
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Vendor
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-right text-[11px] font-medium uppercase tracking-wide">
										Billed
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-right text-[11px] font-medium uppercase tracking-wide">
										Paid
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Status
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((r) => (
									<TableRow key={r.id}>
										<TableCell className="py-3.5 text-sm tabular-nums">
											{formatDate(r.dos)}
										</TableCell>
										<TableCell className="py-3.5 font-mono text-xs">
											{r.claimNumber}
										</TableCell>
										<TableCell className="py-3">
											<p className="text-sm font-medium">{r.memberName}</p>
											<p className="font-mono text-[11px] text-muted-foreground">
												{r.memberId}
											</p>
										</TableCell>
										<TableCell className="py-3.5 text-sm">{r.type}</TableCell>
										<TableCell className="py-3.5 font-mono text-xs">
											{r.procedureCode}
										</TableCell>
										<TableCell className="py-3.5 text-sm">{r.vendor}</TableCell>
										<TableCell className="py-3.5 text-right text-sm tabular-nums">
											{formatCurrency(r.billed)}
										</TableCell>
										<TableCell className="py-3.5 text-right text-sm tabular-nums">
											{formatCurrency(r.paid)}
										</TableCell>
										<TableCell className="py-3">
											<ClaimStatusPill status={r.status} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<p className="mt-3 text-[11px] text-muted-foreground">
						Showing recent {pane} for this provider · Data as of{" "}
						{provider.dataAsOf}
					</p>
				</Panel>
			</div>
		</Sheet>
	);
}

function CredStatusPill({ status }: { status: CredentialStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
				status === "complete" && "border-chart-2/20 bg-chart-2/10 text-chart-2",
				status === "expiring" && "border-chart-3/20 bg-chart-3/10 text-chart-3",
				status === "expired" &&
					"border-destructive/20 bg-destructive/10 text-destructive",
				status === "pending" &&
					"border-border/60 bg-muted text-muted-foreground"
			)}
		>
			{status}
		</span>
	);
}

function CredentialingTab({
	provider,
}: {
	provider: NonNullable<ReturnType<typeof getProvider>>;
}) {
	const counts = {
		complete: 0,
		expiring: 0,
		expired: 0,
		pending: 0,
	} as Record<CredentialStatus, number>;
	for (const c of provider.credentialing) counts[c.status] += 1;
	const total =
		counts.complete + counts.expiring + counts.expired + counts.pending;
	const completePct = total ? Math.round((counts.complete / total) * 100) : 0;
	const openExceptions = provider.exceptions.filter(
		(e) => e.status === "open" || e.status === "in_progress"
	).length;
	const actionNeeded = provider.credentialing.filter(
		(c) =>
			c.status === "expiring" ||
			c.status === "expired" ||
			c.status === "pending"
	);

	return (
		<Sheet>
			<div className="bg-muted/10">
				<MetricStrip
					title="Credentialing health"
					items={[
						{
							label: "Complete",
							value: `${counts.complete}`,
							accent: true,
						},
						{ label: "Expiring", value: `${counts.expiring}` },
						{ label: "Expired", value: `${counts.expired}` },
						{ label: "Pending", value: `${counts.pending}` },
						{
							label: "Completion",
							value: `${completePct}%`,
							accent: completePct >= 85,
						},
						{
							label: "Open exceptions",
							value: `${openExceptions}`,
						},
					]}
				/>
			</div>

			<div
				className={cn(
					"grid border-t border-border/30 lg:grid-cols-5",
					FADE_SPLIT_LG
				)}
			>
				<Panel
					dense
					icon={ClipboardList}
					title="Credentialing checklist"
					className="lg:col-span-3"
					action={
						<span className="text-[11px] text-muted-foreground">
							{total} items tracked
						</span>
					}
				>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Requirement
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Issuer
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Verified
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Expires
									</TableHead>
									<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
										Status
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{provider.credentialing.map((c) => (
									<TableRow key={c.id}>
										<TableCell className="py-3.5 text-sm font-medium">
											{c.label}
										</TableCell>
										<TableCell className="py-3.5 text-sm text-muted-foreground">
											{c.issuer}
										</TableCell>
										<TableCell className="py-3.5 text-sm tabular-nums">
											{formatDate(c.verifiedDate)}
										</TableCell>
										<TableCell className="py-3.5 text-sm tabular-nums">
											{formatDate(c.expirationDate)}
										</TableCell>
										<TableCell className="py-3">
											<CredStatusPill status={c.status} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Panel>

				<div className="space-y-3 lg:col-span-2">
					<Panel dense icon={ArrowDownRight} title="Action required">
						{actionNeeded.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No expiring, expired, or pending credentials.
							</p>
						) : (
							<ul className="space-y-2.5">
								{actionNeeded.map((c) => (
									<li
										key={c.id}
										className="flex items-start justify-between gap-3 rounded-lg border border-border/30 bg-muted/15 px-3 py-2.5"
									>
										<div className="min-w-0">
											<p className="text-sm font-medium">{c.label}</p>
											<p className="text-sm leading-relaxed text-muted-foreground">
												{c.issuer}
												{c.expirationDate
													? ` · Exp ${formatDate(c.expirationDate)}`
													: ""}
											</p>
										</div>
										<CredStatusPill status={c.status} />
									</li>
								))}
							</ul>
						)}
					</Panel>

					<Panel dense icon={BadgeCheck} title="Status mix">
						<ul className="space-y-2.5 text-sm">
							{(
								[
									{
										label: "Complete",
										value: counts.complete,
										color: "bg-chart-2",
									},
									{
										label: "Expiring",
										value: counts.expiring,
										color: "bg-chart-3",
									},
									{
										label: "Expired",
										value: counts.expired,
										color: "bg-destructive",
									},
									{
										label: "Pending",
										value: counts.pending,
										color: "bg-muted-foreground/50",
									},
								] as const
							).map((row) => (
								<li
									key={row.label}
									className="flex items-center justify-between gap-2"
								>
									<span className="flex items-center gap-2">
										<span className={cn("size-2.5 rounded-full", row.color)} />
										{row.label}
									</span>
									<span className="font-medium tabular-nums">{row.value}</span>
								</li>
							))}
						</ul>
						<div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-chart-2"
								style={{ width: `${completePct}%` }}
							/>
						</div>
						<p className="mt-1.5 text-[11px] text-muted-foreground">
							{completePct}% of requirements complete
						</p>
					</Panel>
				</div>
			</div>

			<div className="border-t border-border/30">
				<Panel
					dense
					icon={ClipboardList}
					title="Credentialing & enrollment exceptions"
					action={
						<span className="text-[11px] text-muted-foreground">
							{provider.exceptions.length} total
						</span>
					}
				>
					{provider.exceptions.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No exceptions on file.
						</p>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
											Type
										</TableHead>
										<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
											Description
										</TableHead>
										<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
											Status
										</TableHead>
										<TableHead className="h-9 bg-muted/20 text-[11px] font-medium uppercase tracking-wide">
											Identified
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{provider.exceptions.map((ex) => (
										<TableRow key={ex.id}>
											<TableCell className="py-3.5 text-sm font-medium text-chart-3">
												{ex.exceptionType}
											</TableCell>
											<TableCell className="py-3.5 text-sm leading-relaxed">
												{ex.description}
											</TableCell>
											<TableCell className="py-3">
												<ExceptionPill status={ex.status} />
											</TableCell>
											<TableCell className="py-3.5 text-sm tabular-nums">
												{formatDate(ex.dateIdentified)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
					<p className="mt-3 text-[11px] text-muted-foreground">
						Data as of {provider.dataAsOf}
					</p>
				</Panel>
			</div>
		</Sheet>
	);
}

function TabBody({
	tab,
	provider,
}: {
	tab: TabId;
	provider: NonNullable<ReturnType<typeof getProvider>>;
}) {
	if (tab === "Demographics") {
		const age = providerAge(provider.dob);
		const legalName = [
			provider.firstName,
			provider.middleName,
			provider.lastName,
			provider.suffix,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<Sheet>
				<div className={cn("grid xl:grid-cols-2", FADE_SPLIT_XL)}>
					<MetricStrip
						compact
						title="Snapshot"
						items={[
							{
								label: "Status",
								value: <StatusPill status={provider.status} />,
							},
							{ label: "Type", value: provider.providerType },
							{ label: "Gender", value: provider.gender },
							{
								label: "Age",
								value: age != null ? `${age} yrs` : "—",
							},
							{
								label: "Practice",
								value: `${provider.yearsInPractice} yrs`,
							},
							{ label: "Program", value: provider.program },
							{
								label: "Patients",
								value: provider.acceptingNewPatients ? "Accepting" : "Closed",
								accent: provider.acceptingNewPatients,
							},
						]}
					/>

					<MetricStrip
						compact
						title="Identifiers"
						items={provider.identifiers.map((id) => ({
							label: id.label,
							value: id.value,
							mono: true,
						}))}
					/>
				</div>

				<div
					className={cn(
						"grid border-t border-border/30 lg:grid-cols-3",
						FADE_SPLIT_LG
					)}
				>
					<Panel dense icon={UserRound} title="Personal identity">
						<div className="grid grid-cols-2 gap-x-4 gap-y-3">
							<MetaField label="Legal name" value={legalName} />
							<MetaField
								label="Display name"
								value={displayProviderName(provider)}
							/>
							<MetaField
								label="Preferred name"
								value={provider.preferredName ?? "—"}
							/>
							<MetaField label="Credentials" value={provider.credentials} />
							<MetaField
								label="Date of birth"
								value={
									<span className="tabular-nums">
										{formatDate(provider.dob)}
										{age != null ? (
											<span className="ml-1.5 font-normal text-muted-foreground">
												({age})
											</span>
										) : null}
									</span>
								}
							/>
							<MetaField label="Gender" value={provider.gender} />
							<MetaField label="Race" value={provider.race} />
							<MetaField label="Ethnicity" value={provider.ethnicity} />
							<div className="col-span-2">
								<MetaField
									label="Preferred language"
									value={
										<span className="inline-flex items-center gap-1.5">
											<Languages className="size-3.5 text-muted-foreground" />
											{provider.preferredLanguage}
										</span>
									}
								/>
							</div>
						</div>
					</Panel>

					<Panel dense icon={Stethoscope} title="Professional profile">
						<div className="grid grid-cols-2 gap-x-4 gap-y-3">
							<MetaField label="Provider type" value={provider.providerType} />
							<MetaField
								label="Years in practice"
								value={`${provider.yearsInPractice} years`}
							/>
							<MetaField label="Specialty" value={provider.specialty} />
							<MetaField label="Subspecialty" value={provider.subspecialty} />
							<div className="col-span-2">
								<MetaField
									label="Taxonomy"
									value={
										<span>
											<span className="font-mono">{provider.taxonomyCode}</span>
											<span className="ml-1.5 font-normal text-muted-foreground">
												· {provider.taxonomyDescription}
											</span>
										</span>
									}
								/>
							</div>
							<div className="col-span-2">
								<MetaField
									label="Board certification"
									value={provider.boardCertification}
								/>
							</div>
							<div className="col-span-2">
								<MetaField
									label="Medical school"
									value={
										<span className="inline-flex items-start gap-1.5">
											<GraduationCap className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
											<span>
												{provider.medicalSchool}
												<span className="text-muted-foreground">
													{" "}
													· Class of {provider.graduationYear}
												</span>
											</span>
										</span>
									}
								/>
							</div>
							<MetaField
								label="Accepting patients"
								value={
									<span
										className={cn(
											"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold",
											provider.acceptingNewPatients
												? "border-chart-2/20 bg-chart-2/10 text-chart-2"
												: "border-border/60 bg-muted text-muted-foreground"
										)}
									>
										{provider.acceptingNewPatients
											? "Accepting"
											: "Not accepting"}
									</span>
								}
							/>
						</div>
					</Panel>

					<Panel dense icon={BadgeCheck} title="Program & status">
						<div className="grid grid-cols-2 gap-x-4 gap-y-3">
							<MetaField label="Program" value={provider.program} />
							<MetaField
								label="Provider status"
								value={<StatusPill status={provider.status} />}
							/>
							<MetaField
								label="Enrollment"
								value={
									<span
										className={cn(
											"inline-flex rounded-sm border px-1.5 py-px text-[10px] font-semibold capitalize",
											provider.enrollmentStatus === "enrolled" &&
												"border-chart-2/20 bg-chart-2/10 text-chart-2",
											provider.enrollmentStatus === "pending" &&
												"border-chart-3/20 bg-chart-3/10 text-chart-3",
											provider.enrollmentStatus === "terminated" &&
												"border-destructive/20 bg-destructive/10 text-destructive"
										)}
									>
										{provider.enrollmentStatus}
									</span>
								}
							/>
							<MetaField
								label="Effective"
								value={
									<span className="tabular-nums">
										{formatDate(provider.enrollmentEffective)}
									</span>
								}
							/>
							<div className="col-span-2 border-t border-border/30 pt-3">
								<p className="text-[11px] leading-relaxed text-muted-foreground">
									Locations and networks are maintained on their dedicated tabs.
									<span className="mt-1 block">
										Data as of {provider.dataAsOf}
									</span>
								</p>
							</div>
						</div>
					</Panel>
				</div>

				<div className="border-t border-border/30">
					<Panel dense icon={Building2} title="Primary practice & contact">
						<div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
							<MetaField
								label="Practice / organization"
								value={provider.practiceName}
							/>
							<MetaField
								label="Service address"
								value={
									<span className="inline-flex items-start gap-1.5">
										<MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
										<span>
											{provider.practiceAddress}
											<span className="block font-normal text-muted-foreground">
												{provider.practiceCity}, {provider.practiceState}{" "}
												{provider.practiceZip}
											</span>
										</span>
									</span>
								}
							/>
							<MetaField
								label="Mailing address"
								value={provider.mailingAddress}
							/>
							<div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:col-span-2 xl:col-span-1 xl:grid-cols-1">
								<MetaField
									label="Phone"
									value={
										<span className="inline-flex items-center gap-1.5 tabular-nums">
											<Phone className="size-3.5 text-muted-foreground" />
											{provider.practicePhone}
										</span>
									}
								/>
								<MetaField
									label="Fax"
									value={<span className="tabular-nums">{provider.fax}</span>}
								/>
								<MetaField
									label="Email"
									value={
										<span className="inline-flex items-center gap-1.5 truncate">
											<Mail className="size-3.5 shrink-0 text-muted-foreground" />
											<span className="truncate">{provider.email}</span>
										</span>
									}
								/>
								{provider.website ? (
									<MetaField
										label="Website"
										value={
											<a
												href={provider.website}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-1.5 text-primary hover:underline"
											>
												<Globe className="size-3.5 shrink-0" />
												{provider.website.replace(/^https?:\/\//, "")}
											</a>
										}
									/>
								) : null}
							</div>
						</div>
					</Panel>
				</div>
			</Sheet>
		);
	}

	if (tab === "Identifiers") {
		return (
			<Sheet>
				<div className="bg-muted/10">
					<MetricStrip
						title="Core identifiers"
						items={provider.identifiers.map((id) => ({
							label: id.label,
							value: id.value,
							mono: true,
						}))}
					/>
				</div>
				<div className="border-t border-border/30">
					<Panel dense icon={BadgeCheck} title="Identifier details">
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{provider.identifiers.map((id) => (
								<MetaField
									key={id.id}
									label={id.label}
									value={
										<span className="font-mono text-sm tabular-nums tracking-tight">
											{id.value}
										</span>
									}
								/>
							))}
						</div>
					</Panel>
				</div>
			</Sheet>
		);
	}

	if (tab === "Enrollment") {
		return (
			<Sheet>
				<Panel dense icon={BadgeCheck} title="Enrollment">
					<div className="grid gap-5 sm:grid-cols-3">
						<MetaField
							label="Status"
							value={
								<span className="capitalize">{provider.enrollmentStatus}</span>
							}
						/>
						<MetaField
							label="Effective date"
							value={formatDate(provider.enrollmentEffective)}
						/>
						<MetaField label="Program" value={provider.program} />
					</div>
				</Panel>
			</Sheet>
		);
	}

	if (tab === "Network Participation") {
		return (
			<Sheet>
				<Panel dense icon={Network} title="Network Participation">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Network / Plan</TableHead>
									<TableHead>Payer</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Effective</TableHead>
									<TableHead>End</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{provider.networks.map((n) => (
									<TableRow key={n.id}>
										<TableCell className="text-sm font-medium">
											{n.networkPlan}
										</TableCell>
										<TableCell className="text-sm">{n.payer}</TableCell>
										<TableCell>
											<NetworkPill status={n.status} />
										</TableCell>
										<TableCell className="tabular-nums text-sm">
											{formatDate(n.effectiveDate)}
										</TableCell>
										<TableCell className="tabular-nums text-sm">
											{formatDate(n.endDate)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Panel>
			</Sheet>
		);
	}

	if (tab === "Locations") {
		return (
			<Sheet>
				<Panel dense icon={MapPin} title="Locations">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Location</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Primary</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{provider.locations.map((loc) => (
									<TableRow key={loc.id}>
										<TableCell className="text-sm font-medium">
											{loc.name}
										</TableCell>
										<TableCell className="text-sm">{loc.address}</TableCell>
										<TableCell className="text-sm">{loc.phone}</TableCell>
										<TableCell>
											<StatusPill status={loc.status} />
										</TableCell>
										<TableCell className="text-sm">
											{loc.isPrimary ? "Yes" : "No"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Panel>
			</Sheet>
		);
	}

	if (tab === "Claims & Encounters") {
		return <ClaimsEncountersTab provider={provider} />;
	}

	if (tab === "Rejection Trends") {
		return (
			<Sheet>
				<div className={cn("grid lg:grid-cols-2", FADE_SPLIT_LG)}>
					<Panel dense icon={ArrowDownRight} title="Rejection Trends">
						<div className="h-[280px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={provider.monthlyVolume}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis dataKey="month" tick={{ fontSize: 11 }} />
									<YAxis tick={{ fontSize: 11 }} width={36} />
									<Tooltip />
									<Bar
										dataKey="rejectionCount"
										name="Rejections"
										fill="#ef4444"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</Panel>
					<Panel dense icon={ClipboardList} title="Rejection Reasons">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Reason</TableHead>
										<TableHead className="text-right">Count</TableHead>
										<TableHead className="text-right">% of total</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{provider.rejectionReasons.map((r) => (
										<TableRow key={r.id}>
											<TableCell className="text-sm">{r.reason}</TableCell>
											<TableCell className="text-right tabular-nums text-sm">
												{r.count}
											</TableCell>
											<TableCell className="text-right tabular-nums text-sm">
												{r.pct}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</Panel>
				</div>
			</Sheet>
		);
	}

	if (tab === "Vendors / Sources") {
		return (
			<Sheet>
				<Panel dense icon={Building2} title="Vendors / Source Associations">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Vendor / Source</TableHead>
									<TableHead>File type</TableHead>
									<TableHead>Data sent</TableHead>
									<TableHead>Frequency</TableHead>
									<TableHead>Last received</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{provider.vendors.map((v) => (
									<TableRow key={v.id}>
										<TableCell className="text-sm font-medium">
											{v.vendor}
										</TableCell>
										<TableCell className="text-sm">{v.fileType}</TableCell>
										<TableCell className="text-sm">{v.dataSent}</TableCell>
										<TableCell className="text-sm">{v.frequency}</TableCell>
										<TableCell className="tabular-nums text-sm">
											{v.lastReceived}
										</TableCell>
										<TableCell>
											<FeedPill status={v.status} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Panel>
			</Sheet>
		);
	}

	return <CredentialingTab provider={provider} />;
}
