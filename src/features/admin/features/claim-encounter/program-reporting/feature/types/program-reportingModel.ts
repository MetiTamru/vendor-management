import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export * from "../../mock-data";
export type { ProgramType } from "../../types";

export type ProgramReportingListResult<T> = FeatureListResult<T>;
