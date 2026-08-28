"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import {
	useCreateProviderMutation,
	useProviderRostersQuery,
	useSetProviderStatusMutation,
} from "@/features/admin/features/providers/feature/queries/useProvidersQuery";
import {
	EMPTY_PROVIDER_WIZARD,
	ProviderFormWizard,
	type ProviderWizardValues,
	wizardValuesToPayload,
} from "@/features/admin/features/providers/pages/ProviderFormWizard";
import { useRouter } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
import type { ProviderCreateInput } from "@/lib/vendor-core/types";

export function ProviderCreatePage() {
	const body = <ProviderCreateForm />;
	if (!isMockEnabled()) {
		return <VendorCoreGate title="Create provider">{body}</VendorCoreGate>;
	}
	return body;
}

function ProviderCreateForm() {
	const router = useRouter();
	const live = !isMockEnabled();
	const rostersQ = useProviderRostersQuery(undefined, live);
	const createMutation = useCreateProviderMutation();
	const statusMutation = useSetProviderStatusMutation();
	const firstRosterId = rostersQ.data?.[0]?.id ?? "";
	const [values, setValues] = useState<ProviderWizardValues>({
		...EMPTY_PROVIDER_WIZARD,
	});
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const form = useMemo(
		() => ({
			...values,
			roster_file_id: values.roster_file_id || firstRosterId,
		}),
		[values, firstRosterId]
	);

	function patch(next: Partial<ProviderWizardValues>) {
		setValues((prev) => ({ ...prev, ...next }));
	}

	async function submit() {
		if (!live) {
			toast.info("Live-only action. Enable vendor-core mode.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const payload = wizardValuesToPayload(form);
			if (!payload.roster_file_id) {
				setError("Select a roster file.");
				toast.error("Select a roster file.");
				return;
			}
			const created = await createMutation.mutateAsync(
				payload as ProviderCreateInput
			);
			if (form.status !== "active" && created.id) {
				await statusMutation.mutateAsync({
					id: created.id,
					body: { status: form.status },
				});
			}
			toast.success("Provider created.");
			router.push(`/admin/providers/${created.id}`);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to create provider.";
			setError(message);
			toast.error(message);
		} finally {
			setBusy(false);
		}
	}

	return (
		<ProviderFormWizard
			mode="create"
			values={form}
			onChange={patch}
			rosters={rostersQ.data ?? []}
			busy={busy}
			error={error}
			onCancelHref="/admin/providers"
			onSubmit={submit}
		/>
	);
}
