/**
 * Frontend feature-layer contract (no backend changes).
 *
 * Each admin domain should expose:
 * - feature/dto        transport-shaped create/update/list DTOs
 * - feature/types      UI/domain models consumed by pages
 * - feature/mappers    DTO <-> model adapters
 * - feature/api        mock-or-remote / vendor-core facades
 * - feature/queries    TanStack Query keys + list/detail/mutation hooks
 *
 * Pages must import from feature/queries (or shared re-exports), not mock stores.
 * Live-capable domains use `@/lib/vendor-core`; mock-backed domains wrap `vmsApi`
 * or domain mock fixtures until a backend route exists.
 */

export type FeatureListResult<T> = {
	items: T[];
	total: number;
};

export function featureQueryKey(domain: string, ...parts: unknown[]) {
	return ["admin", "feature", domain, ...parts] as const;
}
