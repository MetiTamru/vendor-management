"use client";

import { useMemo, useState } from "react";

import { KeyRound, Plus, RefreshCw } from "lucide-react";
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
	useCreateCredentialMutation,
	useCredentialsList,
} from "@/features/admin/features/credentials/feature/queries/useCredentialsQuery";
import { isMockEnabled } from "@/lib/mock-mode";

function CredentialsLiveBody() {
	const q = useCredentialsList();
	const create = useCreateCredentialMutation();
	const [name, setName] = useState("");
	const [kind, setKind] = useState("password");
	const [secretRef, setSecretRef] = useState("");

	const rows = useMemo(() => q.credentials, [q.credentials]);

	async function handleCreate() {
		if (!name.trim() || !secretRef.trim()) {
			toast.error("Name and secret reference are required.");
			return;
		}
		try {
			await create.mutateAsync({
				name: name.trim(),
				kind,
				secret_ref: secretRef.trim(),
			});
			toast.success("Credential created.");
			setName("");
			setSecretRef("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Create failed.");
		}
	}

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Credential References"
				description="Secrets and credential refs used by vendor connections and intake jobs."
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
					<CardTitle className="text-sm">Create credential</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3 p-4 md:grid-cols-4">
					<Input
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Select value={kind} onValueChange={setKind}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="password">Password</SelectItem>
							<SelectItem value="ssh_key">SSH Key</SelectItem>
							<SelectItem value="api_token">API Token</SelectItem>
							<SelectItem value="certificate">Certificate</SelectItem>
						</SelectContent>
					</Select>
					<Input
						placeholder="Secret ref (vault path / alias)"
						value={secretRef}
						onChange={(e) => setSecretRef(e.target.value)}
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
						<KeyRound className="size-4" />
						Credentials ({rows.length})
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
									<TableHead>Kind</TableHead>
									<TableHead>Secret Ref</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">{row.name}</TableCell>
										<TableCell className="capitalize">{row.kind}</TableCell>
										<TableCell className="font-mono text-xs">
											{row.secretRef}
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{row.createdAt ?? "—"}
										</TableCell>
									</TableRow>
								))}
								{rows.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="h-20 text-center text-muted-foreground"
										>
											No credentials yet.
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

export function CredentialsPage() {
	if (isMockEnabled()) {
		return (
			<div className="space-y-4">
				<ClaimPageHeader
					title="Credential References"
					description="Turn off mock mode (NEXT_PUBLIC_USE_MOCK=false) to manage live vendor-core credentials."
				/>
				<p className="text-sm text-muted-foreground">
					Credentials are a live vendor-core resource. Switch to live mode to
					list and create credential references.
				</p>
			</div>
		);
	}
	return (
		<VendorCoreGate title="Credentials">
			<VendorCoreLiveChrome title="Credential References">
				<CredentialsLiveBody />
			</VendorCoreLiveChrome>
		</VendorCoreGate>
	);
}
