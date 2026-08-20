"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
	CalendarDays,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Download,
	RefreshCw,
	Search,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import {
	type MemberStatus,
	displayName,
	formatDate,
	maskSsn,
} from "@/features/admin/features/members/feature/api/membersApi";
import {
	useInvalidateVendorCore,
	useMemberSummariesList,
	useVendorCoreMemberCoverages,
	useVendorCoreVendors,
} from "@/features/admin/features/members/feature/queries/useMembersQuery";
import { memberCoveragesToSummaries } from "@/features/admin/features/members/live-members";
import { VENDOR_NAMES } from "@/features/admin/features/vendors/vendor-integration-mock";
import { Link, useRouter } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
import { cn } from "@/lib/utils";
import { vendorCoreApi } from "@/lib/vendor-core";
import { useAdminModuleStore } from "@/stores/admin-module-store";

type GenderFilter = "all" | "Male" | "Female" | "Other" | "Unknown";

function StatusPill({ status }: { status: MemberStatus }) {
	const map: Record<MemberStatus, string> = {
		active:
			"bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
		inactive: "bg-muted text-muted-foreground",
		pending:
			"bg-amber-500/15 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
		termed: "bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-300",
	};
	const label =
		status === "active"
			? "Active"
			: status === "inactive"
				? "Inactive"
				: status === "pending"
					? "Pending"
					: "Termed";

	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
				map[status]
			)}
		>
			{label}
		</span>
	);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
	return (
		<label className="text-[11px] font-semibold text-muted-foreground">
			{children}
		</label>
	);
}

export function MembersPage() {
	if (!isMockEnabled()) {
		return (
			<VendorCoreGate title="Members">
				<MembersDirectoryPage />
			</VendorCoreGate>
		);
	}
	return <MembersDirectoryPage />;
}

function MembersDirectoryPage() {
	const router = useRouter();
	const useLive = !isMockEnabled();
	const invalidate = useInvalidateVendorCore();
	const coveragesQ = useVendorCoreMemberCoverages();
	const vendorsQ = useVendorCoreVendors();
	const { members: mockSummaries } = useMemberSummariesList();
	const programFilter = useAdminModuleStore((s) => s.fileType);

	const [memberId, setMemberId] = useState("");
	const [alternateId, setAlternateId] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dob, setDob] = useState("");
	const [gender, setGender] = useState<GenderFilter>("all");
	const [accountGroup, setAccountGroup] = useState("all");
	const [plan, setPlan] = useState("all");
	const [eligibilityStatus, setEligibilityStatus] = useState("all");
	const [memberStatus, setMemberStatus] = useState("all");
	const [effectiveFrom, setEffectiveFrom] = useState("");
	const [effectiveTo, setEffectiveTo] = useState("");
	const [showMoreFilters, setShowMoreFilters] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [refreshing, setRefreshing] = useState(false);
	const [seeding, setSeeding] = useState(false);
	const autoSeedAttempted = useRef(false);

	const programScoped = useMemo(() => {
		if (!useLive) {
			return mockSummaries.filter((m) => m.program === programFilter);
		}
		return memberCoveragesToSummaries(coveragesQ.data ?? []);
	}, [useLive, coveragesQ.data, programFilter, mockSummaries]);

	const plans = useMemo(
		() => Array.from(new Set(programScoped.map((m) => m.planName))).sort(),
		[programScoped]
	);
	const accountGroups = useMemo(
		() =>
			Array.from(
				new Set(
					programScoped
						.map((m) => m.accountGroup)
						.filter((g): g is string => Boolean(g))
				)
			).sort(),
		[programScoped]
	);
	const vendors = useMemo(() => {
		if (!useLive) return VENDOR_NAMES;
		const fromRows = Array.from(
			new Set(programScoped.map((m) => m.vendorSource).filter(Boolean))
		).sort();
		if (fromRows.length) return fromRows;
		return (vendorsQ.data ?? []).map((v) => v.name).sort();
	}, [useLive, programScoped, vendorsQ.data]);

	const filtered = useMemo(() => {
		return programScoped.filter((m) => {
			if (
				memberId &&
				!m.memberId.toLowerCase().includes(memberId.toLowerCase())
			)
				return false;
			if (
				alternateId &&
				!(m.alternateId ?? "").toLowerCase().includes(alternateId.toLowerCase())
			)
				return false;
			if (
				firstName &&
				!m.firstName.toLowerCase().includes(firstName.toLowerCase())
			)
				return false;
			if (
				lastName &&
				!m.lastName.toLowerCase().includes(lastName.toLowerCase())
			)
				return false;
			if (dob && m.dob !== dob) return false;
			if (gender !== "all" && m.gender !== gender) return false;
			if (accountGroup !== "all" && m.accountGroup !== accountGroup)
				return false;
			if (plan !== "all" && m.planName !== plan) return false;
			if (
				eligibilityStatus !== "all" &&
				(m.eligibilityLabel ?? "") !== eligibilityStatus
			)
				return false;
			if (memberStatus !== "all") {
				const memberStatusLabel =
					m.status === "active"
						? "Active"
						: m.status === "inactive"
							? "Inactive"
							: m.status === "pending"
								? "Pending"
								: "Termed";
				if (memberStatusLabel !== memberStatus) return false;
			}
			if (effectiveFrom && (m.coverageEffectiveDate ?? "") < effectiveFrom)
				return false;
			if (effectiveTo && (m.coverageEffectiveDate ?? "") > effectiveTo)
				return false;
			return true;
		});
	}, [
		programScoped,
		memberId,
		alternateId,
		firstName,
		lastName,
		dob,
		gender,
		accountGroup,
		plan,
		eligibilityStatus,
		memberStatus,
		effectiveFrom,
		effectiveTo,
	]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const safePage = Math.min(page, pageCount);
	const pageRows = filtered.slice(
		(safePage - 1) * pageSize,
		safePage * pageSize
	);

	async function handleRefresh() {
		setRefreshing(true);
		try {
			if (useLive) await invalidate();
			else await new Promise((r) => setTimeout(r, 250));
			toast.success("Member search refreshed");
		} finally {
			setRefreshing(false);
		}
	}

	async function handleSeed(options?: { silent?: boolean }) {
		setSeeding(true);
		try {
			const result = await vendorCoreApi.seedMemberCoverages();
			if (result.created > 0 && !options?.silent) {
				toast.success(`Seeded ${result.created} member coverages`);
			}
			await invalidate();
		} catch (err) {
			if (!options?.silent) {
				toast.error(
					err instanceof Error ? err.message : "Failed to seed member coverages"
				);
			}
			throw err;
		} finally {
			setSeeding(false);
		}
	}

	useEffect(() => {
		if (!useLive || autoSeedAttempted.current || coveragesQ.isLoading) return;
		if (coveragesQ.error || (coveragesQ.data?.length ?? 0) > 0) return;
		autoSeedAttempted.current = true;
		void handleSeed({ silent: true }).catch(() => {
			/* ignore */
		});
	}, [useLive, coveragesQ.isLoading, coveragesQ.error, coveragesQ.data]);

	function clearFilters() {
		setMemberId("");
		setAlternateId("");
		setFirstName("");
		setLastName("");
		setDob("");
		setGender("all");
		setAccountGroup("all");
		setPlan("all");
		setEligibilityStatus("all");
		setMemberStatus("all");
		setEffectiveFrom("");
		setEffectiveTo("");
		setPage(1);
	}

	if (useLive && coveragesQ.isLoading && !coveragesQ.data) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-56" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-5">
			{useLive && coveragesQ.error ? (
				<div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
					{coveragesQ.error.message}
				</div>
			) : null}

			<section className="rounded-xl border border-border bg-card p-4 shadow-sm">
				<div className="mb-4 flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="text-xl font-semibold text-foreground">
							Member Search
						</h1>
						<p className="text-sm text-muted-foreground">
							Search and view member information across all sources.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{useLive && programScoped.length === 0 ? (
							<Button
								size="sm"
								onClick={() => void handleSeed()}
								disabled={seeding}
							>
								{seeding ? "Seeding..." : "Seed demo coverages"}
							</Button>
						) : null}
						<Button
							variant="outline"
							size="sm"
							className="border-primary/30 text-primary"
							onClick={clearFilters}
						>
							Clear
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="border-primary/30 text-primary"
						>
							Save Search
						</Button>
						<Button size="sm" className="bg-primary text-primary-foreground">
							<Search className="mr-1.5 size-4" />
							Search
						</Button>
					</div>
				</div>

				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
					<div className="space-y-1.5">
						<FieldLabel>Member ID</FieldLabel>
						<Input
							value={memberId}
							onChange={(e) => {
								setMemberId(e.target.value);
								setPage(1);
							}}
							placeholder="Enter Member ID"
							className="h-10"
						/>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Alternate ID</FieldLabel>
						<Input
							value={alternateId}
							onChange={(e) => {
								setAlternateId(e.target.value);
								setPage(1);
							}}
							placeholder="Enter Alternate ID"
							className="h-10"
						/>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>First Name</FieldLabel>
						<Input
							value={firstName}
							onChange={(e) => {
								setFirstName(e.target.value);
								setPage(1);
							}}
							placeholder="Enter First Name"
							className="h-10"
						/>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Last Name</FieldLabel>
						<Input
							value={lastName}
							onChange={(e) => {
								setLastName(e.target.value);
								setPage(1);
							}}
							placeholder="Enter Last Name"
							className="h-10"
						/>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Date of Birth</FieldLabel>
						<div className="relative">
							<Input
								type="date"
								value={dob}
								onChange={(e) => {
									setDob(e.target.value);
									setPage(1);
								}}
								className="h-10 pr-10"
							/>
							<CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Gender</FieldLabel>
						<Select
							value={gender}
							onValueChange={(value: GenderFilter) => {
								setGender(value);
								setPage(1);
							}}
						>
							<SelectTrigger className="h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="Male">Male</SelectItem>
								<SelectItem value="Female">Female</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
								<SelectItem value="Unknown">Unknown</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
					<div className="space-y-1.5">
						<FieldLabel>Account / Group</FieldLabel>
						<Select
							value={accountGroup}
							onValueChange={(value) => {
								setAccountGroup(value);
								setPage(1);
							}}
						>
							<SelectTrigger className="h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								{accountGroups.map((group) => (
									<SelectItem key={group} value={group}>
										{group}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Plan</FieldLabel>
						<Select
							value={plan}
							onValueChange={(value) => {
								setPlan(value);
								setPage(1);
							}}
						>
							<SelectTrigger className="h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								{plans.map((planName) => (
									<SelectItem key={planName} value={planName}>
										{planName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Eligibility Status</FieldLabel>
						<Select
							value={eligibilityStatus}
							onValueChange={(value) => {
								setEligibilityStatus(value);
								setPage(1);
							}}
						>
							<SelectTrigger className="h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="Active">Active</SelectItem>
								<SelectItem value="Pending">Pending</SelectItem>
								<SelectItem value="Inactive">Inactive</SelectItem>
								<SelectItem value="Termed">Termed</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Member Status</FieldLabel>
						<Select
							value={memberStatus}
							onValueChange={(value) => {
								setMemberStatus(value);
								setPage(1);
							}}
						>
							<SelectTrigger className="h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="Active">Active</SelectItem>
								<SelectItem value="Pending">Pending</SelectItem>
								<SelectItem value="Inactive">Inactive</SelectItem>
								<SelectItem value="Termed">Termed</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Effective Date From</FieldLabel>
						<div className="relative">
							<Input
								type="date"
								value={effectiveFrom}
								onChange={(e) => {
									setEffectiveFrom(e.target.value);
									setPage(1);
								}}
								className="h-10 pr-10"
							/>
							<CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>
					<div className="space-y-1.5">
						<FieldLabel>Effective Date To</FieldLabel>
						<div className="relative">
							<Input
								type="date"
								value={effectiveTo}
								onChange={(e) => {
									setEffectiveTo(e.target.value);
									setPage(1);
								}}
								className="h-10 pr-10"
							/>
							<CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>
				</div>

				<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
					<button
						type="button"
						onClick={() => setShowMoreFilters((value) => !value)}
						className="inline-flex items-center text-sm font-medium text-primary"
					>
						More Filters
						<ChevronDown
							className={cn(
								"ml-1 size-4 transition-transform",
								showMoreFilters && "rotate-180"
							)}
						/>
					</button>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="border-primary/25"
							onClick={() => void handleRefresh()}
							disabled={refreshing}
						>
							<RefreshCw
								className={cn("mr-1.5 size-3.5", refreshing && "animate-spin")}
							/>
							Refresh
						</Button>
						<Button variant="outline" size="sm" className="border-primary/25">
							<Download className="mr-1.5 size-3.5" />
							Export
						</Button>
					</div>
				</div>

				{showMoreFilters ? (
					<div className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
						Additional advanced filters can be added here later. The current
						view matches the provided search design and is wired to mock data.
					</div>
				) : null}
			</section>

			<section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
				<div className="border-b border-border bg-muted/40 px-4 py-3">
					<p className="text-sm font-semibold text-foreground">
						Search Results
					</p>
					<p className="text-xs text-muted-foreground">
						{filtered.length} members found in {programFilter}
					</p>
				</div>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>Member ID</TableHead>
								<TableHead>Alternate ID</TableHead>
								<TableHead>Member Name</TableHead>
								<TableHead>Date of Birth</TableHead>
								<TableHead>Gender</TableHead>
								<TableHead>Eligibility Status</TableHead>
								<TableHead>Current Plan</TableHead>
								<TableHead>Account / Group</TableHead>
								<TableHead>Member Status</TableHead>
								<TableHead className="text-right">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pageRows.map((member) => (
								<TableRow
									key={member.id}
									className="cursor-pointer hover:bg-muted/40"
									onClick={() => router.push(`/admin/members/${member.id}`)}
								>
									<TableCell className="font-medium text-primary">
										{member.memberId}
									</TableCell>
									<TableCell className="font-mono text-xs text-muted-foreground">
										{member.alternateId ?? "—"}
									</TableCell>
									<TableCell>
										<div>
											<p className="text-sm font-medium text-foreground">
												{displayName(member)}
											</p>
											<p className="text-xs text-muted-foreground">
												{maskSsn(member.ssnLast4)}
											</p>
										</div>
									</TableCell>
									<TableCell className="text-sm">
										{formatDate(member.dob)}
									</TableCell>
									<TableCell className="text-sm">
										{member.gender === "Male"
											? "M"
											: member.gender === "Female"
												? "F"
												: member.gender}
									</TableCell>
									<TableCell>
										<StatusPill status={member.status} />
									</TableCell>
									<TableCell className="text-sm">{member.planName}</TableCell>
									<TableCell className="text-sm">
										{member.accountGroup ?? "—"}
									</TableCell>
									<TableCell className="text-sm">
										{member.status === "active"
											? "Active"
											: member.status === "inactive"
												? "Inactive"
												: member.status === "pending"
													? "Pending"
													: "Termed"}
									</TableCell>
									<TableCell
										className="text-right"
										onClick={(e) => e.stopPropagation()}
									>
										<Button asChild variant="outline" size="sm" className="h-8">
											<Link href={`/admin/members/${member.id}`}>Open</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
							{pageRows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={10}
										className="h-24 text-center text-muted-foreground"
									>
										No members match the current filters.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground">
					<p>
						Showing{" "}
						<span className="font-medium text-foreground">
							{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
						</span>
						-
						<span className="font-medium text-foreground">
							{Math.min(safePage * pageSize, filtered.length)}
						</span>{" "}
						of{" "}
						<span className="font-medium text-foreground">
							{filtered.length}
						</span>
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							className="size-8"
							disabled={safePage <= 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							<ChevronLeft className="size-4" />
						</Button>
						<span className="px-2 text-xs tabular-nums">
							{safePage} / {pageCount}
						</span>
						<Button
							variant="outline"
							size="icon"
							className="size-8"
							disabled={safePage >= pageCount}
							onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
						>
							<ChevronRight className="size-4" />
						</Button>
						<Select
							value={String(pageSize)}
							onValueChange={(value) => {
								setPageSize(Number(value));
								setPage(1);
							}}
						>
							<SelectTrigger className="h-8 w-[76px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[10, 25, 50].map((size) => (
									<SelectItem key={size} value={String(size)}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</section>
		</div>
	);
}
