"use client";

import { useMemo } from "react";

import { ClipboardList, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	useProviderRosterVendorsList,
	useProviderRostersList,
} from "@/features/admin/features/provider-rosters/feature/queries/useProviderRostersQuery";
import { Link } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";

function ProviderRostersLiveBody() {
	const q = useProviderRostersList();
	const vendorsQ = useProviderRosterVendorsList();
	const rows = useMemo(() => q.providerRosters, [q.providerRosters]);
	const vendors = useMemo(() => vendorsQ.vendors, [vendorsQ.vendors]);
	const nameById = useMemo(
		() => new Map(vendors.map((v) => [v.id, v.legal_name ?? v.code])),
		[vendors]
	);

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Provider Rosters"
				description="Inbound provider roster files and associated provider counts."
				actions={
					<>
						<Button asChild variant="outline" size="sm">
							<Link href="/admin/providers">Open Providers</Link>
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
					<CardTitle className="flex items-center gap-2 text-sm">
						<ClipboardList className="size-4" />
						Rosters ({rows.length})
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
									<TableHead className="text-right">Providers</TableHead>
									<TableHead>Received</TableHead>
									<TableHead>Reference</TableHead>
									<TableHead>Source File</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">
											{row.originalFilename ?? "—"}
										</TableCell>
										<TableCell>
											{row.vendorId
												? (nameById.get(row.vendorId) ??
													row.vendor ??
													row.vendorId.slice(0, 8))
												: (row.vendor ?? "—")}
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{row.providerCount ?? 0}
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{row.receivedAt ?? "—"}
										</TableCell>
										<TableCell className="font-mono text-xs">
											{row.referenceId ?? row.id.slice(0, 8)}
										</TableCell>
										<TableCell className="font-mono text-xs">
											{row.sourceInboundFileId
												? row.sourceInboundFileId.slice(0, 8)
												: "—"}
										</TableCell>
									</TableRow>
								))}
								{rows.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="h-20 text-center text-muted-foreground"
										>
											No provider rosters found.
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

export function ProviderRostersPage() {
	if (isMockEnabled()) {
		return (
			<div className="space-y-4">
				<ClaimPageHeader
					title="Provider Rosters"
					description="Turn off mock mode to browse live provider roster files."
				/>
			</div>
		);
	}
	return (
		<VendorCoreGate title="Provider Rosters">
			<VendorCoreLiveChrome title="Provider Rosters">
				<ProviderRostersLiveBody />
			</VendorCoreLiveChrome>
		</VendorCoreGate>
	);
}
