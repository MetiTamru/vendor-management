"use client";

import { useEffect, useMemo, useState } from "react";

import {
	AlertTriangle,
	Beaker,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Circle,
	Clock3,
	Filter,
	History,
	Link2,
	MoreVertical,
	Plus,
	Search,
	Truck,
	Upload,
	UserRound,
	Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
	MIGRATION_STATUS_LABEL,
	WHITELIST_STATUS_LABEL,
} from "../feature/api/myWorkQueueApi";
import {
	useTpaTpvRowsList,
	useUpdateTpaTpvContactsMutation,
	useUpdateTpaTpvInfoMutation,
	useUpdateTpaTpvMigrationMutation,
	useWorkQueueKpisList,
} from "../feature/queries/useMyWorkQueueQuery";
import type {
	MigrationStatus,
	TpaTpvModel,
	WhitelistStatus,
} from "../feature/types/myWorkQueueModel";

type ActionModal = "info" | "contacts" | "migration" | "history" | null;

const KPI_ICON = {
	blue: Users,
	green: Link2,
	orange: Truck,
	purple: Beaker,
	red: AlertTriangle,
	slate: Clock3,
} as const;

const KPI_TONE = {
	blue: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
	green: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
	orange: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
	purple: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
	red: "bg-red-500/15 text-red-700 dark:text-red-300",
	slate: "bg-muted text-muted-foreground",
} as const;

const HISTORY_DOT: Record<string, string> = {
	orange: "bg-orange-500",
	purple: "bg-violet-500",
	green: "bg-emerald-500",
	blue: "bg-sky-500",
	red: "bg-red-500",
};

const th =
	"h-8 px-1.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const td = "px-1.5 py-1.5 text-[11px] align-middle";

function FieldLabel({ children }: { children: React.ReactNode }) {
	return (
		<label className="mb-1 block text-[11px] font-medium text-muted-foreground">
			{children}
		</label>
	);
}

function MigrationStatusPill({ status }: { status: MigrationStatus }) {
	const styles: Record<MigrationStatus, string> = {
		waiting_on_vendor:
			"bg-orange-500/15 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
		testing:
			"bg-violet-500/15 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
		need_testing:
			"bg-violet-500/15 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
		ready:
			"bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
		production_ready:
			"bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
		not_started: "bg-muted text-muted-foreground",
		exception:
			"bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-300",
	};

	return (
		<span
			className={cn(
				"inline-flex max-w-full truncate rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
				styles[status]
			)}
			title={MIGRATION_STATUS_LABEL[status]}
		>
			{MIGRATION_STATUS_LABEL[status]}
		</span>
	);
}

function WhitelistCell({ status }: { status: WhitelistStatus }) {
	return (
		<span
			className="inline-flex items-center gap-1 text-[11px] text-foreground"
			title={WHITELIST_STATUS_LABEL[status]}
		>
			{status === "complete" ? (
				<CheckCircle2 className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
			) : status === "pending" ? (
				<Circle className="size-3 shrink-0 fill-orange-400 text-orange-400" />
			) : (
				<Circle className="size-3 shrink-0 text-muted-foreground" />
			)}
			<span className="truncate">{WHITELIST_STATUS_LABEL[status]}</span>
		</span>
	);
}

function ModalShell({
	open,
	onOpenChange,
	title,
	icon: Icon,
	children,
	footer,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	footer: React.ReactNode;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
				<DialogHeader className="border-b border-border px-4 py-3">
					<DialogTitle className="flex items-center gap-2 text-base font-semibold text-primary">
						<Icon className="size-4 shrink-0" />
						{title}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-3 px-4 py-4">{children}</div>
				<DialogFooter className="border-t border-border px-4 py-3 sm:justify-end">
					{footer}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function MyWorkQueuePage() {
	const { rows: allRows } = useTpaTpvRowsList();
	const { kpis } = useWorkQueueKpisList();
	const updateInfo = useUpdateTpaTpvInfoMutation();
	const updateContacts = useUpdateTpaTpvContactsMutation();
	const updateMigration = useUpdateTpaTpvMigrationMutation();

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [analystFilter, setAnalystFilter] = useState("all");
	const [waveFilter, setWaveFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [activeRow, setActiveRow] = useState<TpaTpvModel | null>(null);
	const [modal, setModal] = useState<ActionModal>(null);

	const [infoForm, setInfoForm] = useState({
		name: "",
		code: "",
		type: "TPA",
		wave: "1",
		serverType: "New SFTP",
		notes: "",
	});
	const [contactsForm, setContactsForm] = useState({
		primaryContact: "",
		primaryEmail: "",
		primaryPhone: "",
		secondaryContact: "",
		secondaryEmail: "",
		secondaryPhone: "",
	});
	const [migrationForm, setMigrationForm] = useState({
		status: "waiting_on_vendor" as MigrationStatus,
		migrationStartDate: "",
		waitingOnVendorDate: "",
		currentStage: "",
		nextStep: "",
	});

	useEffect(() => {
		if (!activeRow) return;
		setInfoForm({
			name: activeRow.name,
			code: activeRow.code,
			type: activeRow.type,
			wave: String(activeRow.wave),
			serverType: activeRow.serverType,
			notes: activeRow.notes,
		});
		setContactsForm({
			primaryContact: activeRow.primaryContact,
			primaryEmail: activeRow.primaryEmail,
			primaryPhone: activeRow.primaryPhone,
			secondaryContact: activeRow.secondaryContact,
			secondaryEmail: activeRow.secondaryEmail,
			secondaryPhone: activeRow.secondaryPhone,
		});
		setMigrationForm({
			status: activeRow.status,
			migrationStartDate: activeRow.migrationStartDate,
			waitingOnVendorDate: activeRow.waitingOnVendorDate,
			currentStage: activeRow.currentStage,
			nextStep: activeRow.nextStep,
		});
	}, [activeRow]);

	const analysts = useMemo(
		() => Array.from(new Set(allRows.map((r) => r.assignedAnalyst))).sort(),
		[allRows]
	);
	const waves = useMemo(
		() =>
			Array.from(new Set(allRows.map((r) => String(r.wave)))).sort(
				(a, b) => Number(a) - Number(b)
			),
		[allRows]
	);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return allRows.filter((row) => {
			if (statusFilter !== "all" && row.status !== statusFilter) return false;
			if (analystFilter !== "all" && row.assignedAnalyst !== analystFilter)
				return false;
			if (waveFilter !== "all" && String(row.wave) !== waveFilter) return false;
			if (!q) return true;
			return (
				row.name.toLowerCase().includes(q) ||
				row.serverType.toLowerCase().includes(q) ||
				row.contactEmail.toLowerCase().includes(q) ||
				row.assignedAnalyst.toLowerCase().includes(q)
			);
		});
	}, [allRows, search, statusFilter, analystFilter, waveFilter]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const safePage = Math.min(page, pageCount);
	const pageRows = filtered.slice(
		(safePage - 1) * pageSize,
		safePage * pageSize
	);
	const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const rangeEnd = Math.min(safePage * pageSize, filtered.length);

	function applyKpiFilter(id: string) {
		setPage(1);
		if (id === "assigned") setStatusFilter("all");
		else if (id === "connected") setStatusFilter("ready");
		else if (id === "migration") setStatusFilter("waiting_on_vendor");
		else if (id === "testing") setStatusFilter("testing");
		else if (id === "exceptions") setStatusFilter("exception");
		else if (id === "not_started") setStatusFilter("not_started");
	}

	function openModal(row: TpaTpvModel, next: ActionModal) {
		setActiveRow(row);
		setModal(next);
	}

	function closeModal() {
		setModal(null);
		setActiveRow(null);
	}

	async function saveInfo() {
		if (!activeRow) return;
		await updateInfo.mutateAsync({
			id: activeRow.id,
			body: {
				name: infoForm.name,
				code: infoForm.code,
				type: infoForm.type as TpaTpvModel["type"],
				wave: Number(infoForm.wave) || 1,
				serverType: infoForm.serverType,
				notes: infoForm.notes,
			},
		});
		toast.success(`TPA/TPV Information saved for ${activeRow.name}`);
		closeModal();
	}

	async function saveContacts() {
		if (!activeRow) return;
		await updateContacts.mutateAsync({
			id: activeRow.id,
			body: contactsForm,
		});
		toast.success(`Contacts saved for ${activeRow.name}`);
		closeModal();
	}

	async function saveMigration() {
		if (!activeRow) return;
		await updateMigration.mutateAsync({
			id: activeRow.id,
			body: migrationForm,
		});
		toast.success(`Migration Details saved for ${activeRow.name}`);
		closeModal();
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-foreground">
						TPA/TPV Tracking
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Centralized tracking of TPA/TPV vendors, connections, communications,
						and migration status.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9"
						onClick={() => toast.message("Import spreadsheet…")}
					>
						<Upload className="mr-1.5 size-3.5" />
						Import Spreadsheet
					</Button>
					<Button
						size="sm"
						className="h-9"
						onClick={() => toast.message("Add TPA/TPV…")}
					>
						<Plus className="mr-1.5 size-3.5" />
						Add TPA/TPV
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9"
						onClick={() => toast.message("Add feed…")}
					>
						<Plus className="mr-1.5 size-3.5" />
						Add Feed
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-9">
								Update Status
								<ChevronDown className="ml-1.5 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => toast.success("Marked as Testing")}
							>
								Mark as Testing
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => toast.success("Marked as Ready")}
							>
								Mark as Ready
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => toast.success("Marked Waiting on Vendor")}
							>
								Waiting on Vendor
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{kpis.map((kpi) => {
					const Icon = KPI_ICON[kpi.tone];
					return (
						<button
							key={kpi.id}
							type="button"
							onClick={() => applyKpiFilter(kpi.id)}
							className="rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/30"
						>
							<div className="flex items-start gap-2.5">
								<span
									className={cn(
										"flex size-8 shrink-0 items-center justify-center rounded-lg",
										KPI_TONE[kpi.tone]
									)}
								>
									<Icon className="size-3.5" />
								</span>
								<div className="min-w-0">
									<p className="text-[11px] font-medium text-muted-foreground">
										{kpi.label}
									</p>
									<p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">
										{kpi.count}
									</p>
									<span className="mt-0.5 inline-block text-[11px] font-medium text-primary">
										View all
									</span>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			<section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
				<div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
					<div className="relative min-w-[180px] flex-1">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							placeholder="Search TPA/TPV name, server, email..."
							className="h-8 pl-8 text-xs"
						/>
					</div>
					<Select
						value={statusFilter}
						onValueChange={(v) => {
							setStatusFilter(v);
							setPage(1);
						}}
					>
						<SelectTrigger className="h-8 w-[150px] text-xs">
							<SelectValue placeholder="All Migration Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Migration Status</SelectItem>
							{(Object.keys(MIGRATION_STATUS_LABEL) as MigrationStatus[]).map(
								(key) => (
									<SelectItem key={key} value={key}>
										{MIGRATION_STATUS_LABEL[key]}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
					<Select
						value={analystFilter}
						onValueChange={(v) => {
							setAnalystFilter(v);
							setPage(1);
						}}
					>
						<SelectTrigger className="h-8 w-[130px] text-xs">
							<SelectValue placeholder="All Analysts" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Analysts</SelectItem>
							{analysts.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={waveFilter}
						onValueChange={(v) => {
							setWaveFilter(v);
							setPage(1);
						}}
					>
						<SelectTrigger className="h-8 w-[110px] text-xs">
							<SelectValue placeholder="All Waves" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Waves</SelectItem>
							{waves.map((wave) => (
								<SelectItem key={wave} value={wave}>
									Wave {wave}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={() => toast.message("More filters…")}
					>
						<Filter className="mr-1.5 size-3.5" />
						Filters
					</Button>
				</div>

				<div className="w-full overflow-hidden">
					<Table className="w-full table-fixed">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className={cn(th, "w-[3%]")}>#</TableHead>
								<TableHead className={cn(th, "w-[4%]")}>Wave</TableHead>
								<TableHead className={cn(th, "w-[12%]")}>TPA/TPV</TableHead>
								<TableHead className={cn(th, "w-[9%]")}>Server</TableHead>
								<TableHead className={cn(th, "w-[13%]")}>Email</TableHead>
								<TableHead className={cn(th, "w-[9%]")}>IP Whitelist</TableHead>
								<TableHead className={cn(th, "w-[9%]")}>Last Comm</TableHead>
								<TableHead className={cn(th, "w-[11%]")}>Status</TableHead>
								<TableHead className={cn(th, "w-[11%]")}>Analyst</TableHead>
								<TableHead className={cn(th, "w-[12%]")}>Updated</TableHead>
								<TableHead className={cn(th, "w-[4%] text-right")}>
									···
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pageRows.map((row, index) => (
								<TableRow key={row.id} className="hover:bg-muted/40">
									<TableCell
										className={cn(td, "tabular-nums text-muted-foreground")}
									>
										{(safePage - 1) * pageSize + index + 1}
									</TableCell>
									<TableCell className={cn(td, "tabular-nums")}>
										{row.wave}
									</TableCell>
									<TableCell className={td}>
										<button
											type="button"
											className="block w-full truncate text-left font-medium text-primary hover:underline"
											title={row.name}
											onClick={() => openModal(row, "info")}
										>
											{row.name}
										</button>
									</TableCell>
									<TableCell className={cn(td, "truncate")} title={row.serverType}>
										{row.serverType}
									</TableCell>
									<TableCell
										className={cn(td, "truncate text-muted-foreground")}
										title={row.contactEmail}
									>
										{row.contactEmail}
									</TableCell>
									<TableCell className={td}>
										<WhitelistCell status={row.whitelistStatus} />
									</TableCell>
									<TableCell className={cn(td, "tabular-nums")}>
										{row.lastCommunication}
									</TableCell>
									<TableCell className={td}>
										<MigrationStatusPill status={row.status} />
									</TableCell>
									<TableCell
										className={cn(td, "truncate")}
										title={row.assignedAnalyst}
									>
										{row.assignedAnalyst}
									</TableCell>
									<TableCell
										className={cn(td, "truncate tabular-nums text-muted-foreground")}
										title={row.lastUpdated}
									>
										{row.lastUpdated}
									</TableCell>
									<TableCell className={cn(td, "text-right")}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="size-7"
													aria-label={`Actions for ${row.name}`}
												>
													<MoreVertical className="size-3.5" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-52">
												<DropdownMenuItem
													onClick={() => openModal(row, "info")}
												>
													<UserRound className="mr-2 size-3.5 text-primary" />
													TPA/TPV Information
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openModal(row, "contacts")}
												>
													<Link2 className="mr-2 size-3.5 text-primary" />
													Contacts Information
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openModal(row, "migration")}
												>
													<Truck className="mr-2 size-3.5 text-primary" />
													Migration Information
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openModal(row, "history")}
												>
													<History className="mr-2 size-3.5 text-primary" />
													History
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
							{pageRows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={11}
										className="h-20 text-center text-sm text-muted-foreground"
									>
										No TPA/TPV records match your filters.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5 text-xs text-muted-foreground">
					<p>
						Showing{" "}
						<span className="font-medium text-foreground">{rangeStart}</span> to{" "}
						<span className="font-medium text-foreground">{rangeEnd}</span> of{" "}
						<span className="font-medium text-foreground">
							{filtered.length}
						</span>{" "}
						entries
					</p>
					<div className="flex items-center gap-1.5">
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							disabled={safePage <= 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							<ChevronLeft className="size-3.5" />
						</Button>
						{Array.from({ length: pageCount }, (_, i) => i + 1)
							.slice(0, 5)
							.map((n) => (
								<Button
									key={n}
									variant={n === safePage ? "default" : "outline"}
									size="icon"
									className="size-7 text-xs"
									onClick={() => setPage(n)}
								>
									{n}
								</Button>
							))}
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							disabled={safePage >= pageCount}
							onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
						>
							<ChevronRight className="size-3.5" />
						</Button>
						<Select
							value={String(pageSize)}
							onValueChange={(v) => {
								setPageSize(Number(v));
								setPage(1);
							}}
						>
							<SelectTrigger className="h-7 w-[88px] text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10/page</SelectItem>
								<SelectItem value="20">20/page</SelectItem>
								<SelectItem value="50">50/page</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</section>

			{/* TPA/TPV Information */}
			<ModalShell
				open={modal === "info"}
				onOpenChange={(open) => !open && closeModal()}
				title="TPA/TPV Information"
				icon={UserRound}
				footer={
					<>
						<Button variant="outline" size="sm" onClick={closeModal}>
							Cancel
						</Button>
						<Button size="sm" onClick={() => void saveInfo()}>
							Save
						</Button>
					</>
				}
			>
				<div className="grid gap-3 sm:grid-cols-2">
					<div>
						<FieldLabel>TPA/TPV Name</FieldLabel>
						<Input
							value={infoForm.name}
							onChange={(e) =>
								setInfoForm((f) => ({ ...f, name: e.target.value }))
							}
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>TPA/TPV ID</FieldLabel>
						<Input
							value={infoForm.code}
							onChange={(e) =>
								setInfoForm((f) => ({ ...f, code: e.target.value }))
							}
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>Type</FieldLabel>
						<Select
							value={infoForm.type}
							onValueChange={(v) => setInfoForm((f) => ({ ...f, type: v }))}
						>
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="TPA">TPA</SelectItem>
								<SelectItem value="TPV">TPV</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<FieldLabel>Wave</FieldLabel>
						<Select
							value={infoForm.wave}
							onValueChange={(v) => setInfoForm((f) => ({ ...f, wave: v }))}
						>
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{["1", "2", "3", "4"].map((w) => (
									<SelectItem key={w} value={w}>
										{w}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Server / Connection Type</FieldLabel>
						<Select
							value={infoForm.serverType}
							onValueChange={(v) =>
								setInfoForm((f) => ({ ...f, serverType: v }))
							}
						>
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="New SFTP">New SFTP</SelectItem>
								<SelectItem value="Legacy SFTP">Legacy SFTP</SelectItem>
								<SelectItem value="API Feed">API Feed</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Notes</FieldLabel>
						<Textarea
							value={infoForm.notes}
							onChange={(e) =>
								setInfoForm((f) => ({ ...f, notes: e.target.value }))
							}
							rows={3}
						/>
					</div>
				</div>
			</ModalShell>

			{/* Contacts Information */}
			<ModalShell
				open={modal === "contacts"}
				onOpenChange={(open) => !open && closeModal()}
				title="Contacts Information"
				icon={Link2}
				footer={
					<>
						<Button variant="outline" size="sm" onClick={closeModal}>
							Cancel
						</Button>
						<Button size="sm" onClick={() => void saveContacts()}>
							Save
						</Button>
					</>
				}
			>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="sm:col-span-2">
						<FieldLabel>Primary Contact</FieldLabel>
						<Input
							value={contactsForm.primaryContact}
							onChange={(e) =>
								setContactsForm((f) => ({
									...f,
									primaryContact: e.target.value,
								}))
							}
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>Email</FieldLabel>
						<Input
							value={contactsForm.primaryEmail}
							onChange={(e) =>
								setContactsForm((f) => ({
									...f,
									primaryEmail: e.target.value,
								}))
							}
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>Phone</FieldLabel>
						<Input
							value={contactsForm.primaryPhone}
							onChange={(e) =>
								setContactsForm((f) => ({
									...f,
									primaryPhone: e.target.value,
								}))
							}
							className="h-9"
						/>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Secondary Contact</FieldLabel>
						<Input
							value={contactsForm.secondaryContact}
							onChange={(e) =>
								setContactsForm((f) => ({
									...f,
									secondaryContact: e.target.value,
								}))
							}
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>Email</FieldLabel>
						<Input
							value={contactsForm.secondaryEmail}
							onChange={(e) =>
								setContactsForm((f) => ({
									...f,
									secondaryEmail: e.target.value,
								}))
							}
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>Phone</FieldLabel>
						<Input
							value={contactsForm.secondaryPhone}
							onChange={(e) =>
								setContactsForm((f) => ({
									...f,
									secondaryPhone: e.target.value,
								}))
							}
							className="h-9"
						/>
					</div>
				</div>
			</ModalShell>

			{/* Migration Information */}
			<ModalShell
				open={modal === "migration"}
				onOpenChange={(open) => !open && closeModal()}
				title="Migration Information"
				icon={Truck}
				footer={
					<>
						<Button variant="outline" size="sm" onClick={closeModal}>
							Cancel
						</Button>
						<Button size="sm" onClick={() => void saveMigration()}>
							Save
						</Button>
					</>
				}
			>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="sm:col-span-2">
						<FieldLabel>Migration Status</FieldLabel>
						<Select
							value={migrationForm.status}
							onValueChange={(v) =>
								setMigrationForm((f) => ({
									...f,
									status: v as MigrationStatus,
								}))
							}
						>
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{(Object.keys(MIGRATION_STATUS_LABEL) as MigrationStatus[]).map(
									(key) => (
										<SelectItem key={key} value={key}>
											{MIGRATION_STATUS_LABEL[key]}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
					<div>
						<FieldLabel>Migration Start Date</FieldLabel>
						<Input
							value={migrationForm.migrationStartDate}
							onChange={(e) =>
								setMigrationForm((f) => ({
									...f,
									migrationStartDate: e.target.value,
								}))
							}
							placeholder="MM/DD/YYYY"
							className="h-9"
						/>
					</div>
					<div>
						<FieldLabel>Waiting on Vendor</FieldLabel>
						<Input
							value={migrationForm.waitingOnVendorDate}
							onChange={(e) =>
								setMigrationForm((f) => ({
									...f,
									waitingOnVendorDate: e.target.value,
								}))
							}
							placeholder="MM/DD/YYYY"
							className="h-9"
						/>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Current Stage</FieldLabel>
						<Select
							value={migrationForm.currentStage || "Data Exchange"}
							onValueChange={(v) =>
								setMigrationForm((f) => ({ ...f, currentStage: v }))
							}
						>
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[
									"Not Started",
									"Data Exchange",
									"Connectivity Testing",
									"Whitelist Review",
									"Contract Review",
									"Go-Live Readiness",
									"Exception Handling",
									"Production",
								].map((stage) => (
									<SelectItem key={stage} value={stage}>
										{stage}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Next Step / Action</FieldLabel>
						<Textarea
							value={migrationForm.nextStep}
							onChange={(e) =>
								setMigrationForm((f) => ({ ...f, nextStep: e.target.value }))
							}
							rows={3}
						/>
					</div>
				</div>
			</ModalShell>

			{/* History */}
			<ModalShell
				open={modal === "history"}
				onOpenChange={(open) => !open && closeModal()}
				title="History"
				icon={History}
				footer={
					<Button variant="outline" size="sm" onClick={closeModal}>
						Close
					</Button>
				}
			>
				<ol className="relative space-y-4 border-l border-border pl-4">
					{(activeRow?.history ?? []).map((event) => (
						<li key={event.id} className="relative">
							<span
								className={cn(
									"absolute -left-[21px] top-1 size-2.5 rounded-full ring-4 ring-card",
									HISTORY_DOT[event.tone]
								)}
							/>
							<p className="text-xs font-semibold text-foreground">{event.at}</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{event.message}
							</p>
						</li>
					))}
				</ol>
			</ModalShell>
		</div>
	);
}
