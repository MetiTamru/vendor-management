import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export * from "../../mock-data";

export type * from "./qualityPerformanceModel";

export type QualityPerformanceListResult<T> = FeatureListResult<T>;
