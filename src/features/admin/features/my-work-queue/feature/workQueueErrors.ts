import { VendorCoreApiError } from "@/lib/vendor-core/client";

/** Prefer human field messages; drop `field: ` prefix when single migration error. */
export function workQueueErrorMessage(err: unknown, fallback: string): string {
	if (err instanceof VendorCoreApiError) {
		const raw = (err.message || "").trim();
		if (!raw) return fallback;
		const cleaned = raw
			.replace(/^migration_status:\s*/i, "")
			.replace(/;\s*migration_status:\s*/gi, "; ")
			.trim();
		return cleaned || fallback;
	}
	if (err instanceof Error) return err.message || fallback;
	return fallback;
}
