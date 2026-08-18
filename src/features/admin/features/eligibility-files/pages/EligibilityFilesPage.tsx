"use client";

import { useMemo, useState } from "react";

import { FileSpreadsheet, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import {
	VendorCoreErrorBanner,
	VendorCoreLiveChrome,
	VendorCoreLoadingRow,
} from "@/components/vendor-core/VendorCoreLiveChrome";
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import {
	useCreateEligibilityFileMutation,
	useEligibilityFilesList,
	useEligibilityVendorsList,
} from "@/features/admin/features/eligibility-files/feature/queries/useEligibilityFilesQuery";
import { Link } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
import { vendorLabel } from "@/lib/vendor-core/types";

function EligibilityFilesLiveBody() {
	const q = useEligibilityFilesList();
	const vendorsQ = useEligibilityVendorsList();
	const create = useCreateEligibilityFileMutation();
	const [vendorId, setVendorId] = useState("none");
	const [filename, setFilename] = useState("");
	const [memberCount, setMemberCount] = useState("0");

	const rows = useMemo(() => q.eligibilityFiles, [q.eligibilityFiles]);
	const vendors = useMemo(() => vendorsQ.vendors, [vendorsQ.vendors]);
	const nameById = useMemo(
		() => new Map(vendors.map((v) => [v.id, v.legal_name ?? v.code])),
		[vendors]
	);

	async function handleCreate() {
		if (!filename.trim()) {
			toast.error("Filename is required.");
			return;
		}
		try {
			await create.mutateAsync({
				vendor_id: vendorId === "none" ? undefined : vendorId,
				original_filename: filename.trim(),
				member_count: Number(memberCount) || 0,
				received_at: new Date().toISOString(),
			});
			toast.success("Eligibility file created.");
			setFilename("");
			setMemberCount("0");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Create failed.");
		}
	}

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Eligibility Files"
				description="834 eligibility file shells linked to member coverage intake."
				actions={
					<>
						<Button asChild variant="outline" size="sm">
							<Link href="/admin/members">Open Members</Link>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								void q.refetch();
								void vendorsQ.refetch();
							}}
							disabled={q.isFetching}
						>
							<RefreshCw className="mr-1.5 size-3.5" />
							Refresh
						</Button>
					</>
				}
			/>
			{q.error ? <VendorCoreErrorBanner message={q.error.message} /> : null}
			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-4 py-3">
					<CardTitle className="text-sm">Create eligibility file</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3 p-4 md:grid-cols-4">
					<Select value={vendorId} onValueChange={setVendorId}>
						<SelectTrigger>
							<SelectValue placeholder="Vendor" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">No vendor</SelectItem>
							{vendors.map((v) => (
								<SelectItem key={v.id} value={v.id}>
									{v.legal_name ?? v.code}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input
						placeholder="Original filename"
						value={filename}
						onChange={(e) => setFilename(e.target.value)}
					/>
					<Input
						placeholder="Member count"
						value={memberCount}
						onChange={(e) => setMemberCount(e.target.value)}
					/>
					<Button onClick={handleCreate} disabled={create.isPending}>
						<Plus className="mr-1.5 size-3.5" />
						Create
					</Button>
				</CardContent>
			</Card>
			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-4 py-3">
					<CardTitle className="flex items-center gap-2 text-sm">
						<FileSpreadsheet className="size-4" />
						Eligibility files ({rows.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{q.isLoading ? (
						<VendorCoreLoadingRow />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Filename</TableHead>
									<TableHead>Vendor</TableHead>
									<TableHead className="text-right">Members</TableHead>
									<TableHead>Received</TableHead>
									<TableHead>Reference</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">
											{row.originalFilename ?? "—"}
										</TableCell>
										<TableCell>
											{vendorLabel(row.vendor ?? row.vendorId, nameById)}
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{row.memberCount ?? 0}
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{row.receivedAt ?? "—"}
										</TableCell>
										<TableCell className="font-mono text-xs">
											{row.referenceId ?? row.id.slice(0, 8)}
										</TableCell>
									</TableRow>
								))}
								{rows.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-20 text-center text-muted-foreground"
										>
											No eligibility files yet.
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export function EligibilityFilesPage() {
	if (isMockEnabled()) {
		return (
			<div className="space-y-4">
				<ClaimPageHeader
					title="Eligibility Files"
					description="Turn off mock mode to manage live eligibility file intake shells."
				/>
			</div>
		);
	}
	return (
		<VendorCoreGate title="Eligibility Files">
			<VendorCoreLiveChrome title="Eligibility Files">
				<EligibilityFilesLiveBody />
			</VendorCoreLiveChrome>
		</VendorCoreGate>
	);
}
