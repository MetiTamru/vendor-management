"use client";

import { useMemo, useState } from "react";

import { GitBranch, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
	useCreateRoutingRuleMutation,
	useRoutingRulesList,
} from "@/features/admin/features/routing-rules/feature/queries/useRoutingRulesQuery";
import { isMockEnabled } from "@/lib/mock-mode";

function RoutingRulesLiveBody() {
	const q = useRoutingRulesList();
	const create = useCreateRoutingRuleMutation();
	const [name, setName] = useState("");
	const [destination, setDestination] = useState("claims");
	const [priority, setPriority] = useState("100");
	const [ediType, setEdiType] = useState("837");

	const rows = useMemo(() => q.routingRules, [q.routingRules]);

	async function handleCreate() {
		if (!name.trim()) {
			toast.error("Rule name is required.");
			return;
		}
		try {
			await create.mutateAsync({
				name: name.trim(),
				destination_module: destination.trim(),
				priority: Number(priority) || 100,
				is_active: true,
				edi_type: ediType.trim() || null,
				parser: "auto",
			});
			toast.success("Routing rule created.");
			setName("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Create failed.");
		}
	}

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Routing Rules"
				description="Map inbound EDI/file types to destination modules by priority."
				actions={
					<Button
						variant="outline"
						size="sm"
						onClick={() => q.refetch()}
						disabled={q.isFetching}
					>
						<RefreshCw className="mr-1.5 size-3.5" />
						Refresh
					</Button>
				}
			/>
			{q.error ? <VendorCoreErrorBanner message={q.error.message} /> : null}
			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-4 py-3">
					<CardTitle className="text-sm">Create routing rule</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3 p-4 md:grid-cols-5">
					<Input
						placeholder="Rule name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						placeholder="Destination module"
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
					/>
					<Input
						placeholder="Priority"
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
					/>
					<Input
						placeholder="EDI type"
						value={ediType}
						onChange={(e) => setEdiType(e.target.value)}
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
						<GitBranch className="size-4" />
						Rules ({rows.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{q.isLoading ? (
						<VendorCoreLoadingRow />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Destination</TableHead>
									<TableHead>EDI</TableHead>
									<TableHead className="text-right">Priority</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">{row.name}</TableCell>
										<TableCell>{row.destinationModule}</TableCell>
										<TableCell>{row.ediType ?? "—"}</TableCell>
										<TableCell className="text-right tabular-nums">
											{row.priority}
										</TableCell>
										<TableCell>
											{row.isActive ? "Active" : "Inactive"}
										</TableCell>
									</TableRow>
								))}
								{rows.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-20 text-center text-muted-foreground"
										>
											No routing rules yet.
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

export function RoutingRulesPage() {
	if (isMockEnabled()) {
		return (
			<div className="space-y-4">
				<ClaimPageHeader
					title="Routing Rules"
					description="Turn off mock mode to manage live vendor-core routing rules."
				/>
			</div>
		);
	}
	return (
		<VendorCoreGate title="Routing Rules">
			<VendorCoreLiveChrome title="Routing Rules">
				<RoutingRulesLiveBody />
			</VendorCoreLiveChrome>
		</VendorCoreGate>
	);
}
