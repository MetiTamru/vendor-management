"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import { VendorCoreLoadingRow } from "@/components/vendor-core/VendorCoreLiveChrome";
import { getProviderDto } from "@/features/admin/features/providers/feature/api/providersApi";
import {
	useProviderRostersQuery,
	useSetProviderStatusMutation,
	useUpdateProviderMutation,
} from "@/features/admin/features/providers/feature/queries/useProvidersQuery";
import {
	EMPTY_PROVIDER_WIZARD,
	ProviderFormWizard,
	type ProviderWizardValues,
	valuesFromProviderDto,
	wizardValuesToPayload,
} from "@/features/admin/features/providers/pages/ProviderFormWizard";
import { Link, useRouter } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";

export function ProviderEditPage({
	providerId: providerIdProp,
}: {
	providerId?: string;
}) {
	const params = useParams<{ providerId?: string | string[] }>();
	const raw = providerIdProp ?? params.providerId;
	const providerId = decodeURIComponent(
		Array.isArray(raw) ? (raw[0] ?? "") : String(raw ?? "")
	);
	const body = <ProviderEditForm providerId={providerId} />;
	if (!isMockEnabled()) {
		return <VendorCoreGate title="Edit provider">{body}</VendorCoreGate>;
	}
	return body;
}

function ProviderEditForm({ providerId }: { providerId: string }) {
	const router = useRouter();
	const live = !isMockEnabled();
	const rostersQ = useProviderRostersQuery(undefined, live);
	const updateMutation = useUpdateProviderMutation();
	const statusMutation = useSetProviderStatusMutation();
	const [values, setValues] = useState<ProviderWizardValues>(
		EMPTY_PROVIDER_WIZARD
	);
	const [originalStatus, setOriginalStatus] =
		useState<ProviderWizardValues["status"]>("active");
	const [loading, setLoading] = useState(live);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		if (!live || !providerId) {
			setLoading(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		setLoadError(null);
		getProviderDto(providerId)
			.then((dto) => {
				if (cancelled) return;
				if (!dto) {
					setLoadError("Provider not found.");
					return;
				}
				const next = valuesFromProviderDto(dto);
				setValues(next);
				setOriginalStatus(next.status);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setLoadError(
					err instanceof Error ? err.message : "Failed to load provider."
				);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [live, providerId]);

	function patch(next: Partial<ProviderWizardValues>) {
		setValues((prev) => ({ ...prev, ...next }));
	}

	async function submit() {
		if (!live) {
			toast.info("Live-only action. Enable vendor-core mode.");
			return;
		}
		if (!values.roster_file_id.trim()) {
			setError("Select a roster file.");
			toast.error("Select a roster file.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const payload = wizardValuesToPayload(values);
			await updateMutation.mutateAsync({
				id: providerId,
				body: payload,
			});
			if (values.status !== originalStatus) {
				await statusMutation.mutateAsync({
					id: providerId,
					body: { status: values.status },
				});
			}
			toast.success("Provider updated.");
			router.push(`/admin/providers/${providerId}`);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to update provider.";
			setError(message);
			toast.error(message);
		} finally {
			setBusy(false);
		}
	}

	if (loading) {
		return <VendorCoreLoadingRow label="Loading provider…" />;
	}

	if (loadError) {
		return (
			<div className="space-y-3">
				<p className="text-sm text-destructive">{loadError}</p>
				<Button asChild variant="outline" size="sm">
					<Link href="/admin/providers">Back to providers</Link>
				</Button>
			</div>
		);
	}

	return (
		<ProviderFormWizard
			mode="edit"
			values={values}
			onChange={patch}
			rosters={rostersQ.data ?? []}
			busy={busy}
			error={error}
			onCancelHref={`/admin/providers/${providerId}`}
			onSubmit={submit}
		/>
	);
}
