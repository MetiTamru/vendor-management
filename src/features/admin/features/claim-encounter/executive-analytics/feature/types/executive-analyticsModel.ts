import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export * from "../../mock-data";
export * from "../../regulatory-quality-mock";
export * from "../../risk-exceptions-mock";

export type ExecutiveAnalyticsListResult<T> = FeatureListResult<T>;
