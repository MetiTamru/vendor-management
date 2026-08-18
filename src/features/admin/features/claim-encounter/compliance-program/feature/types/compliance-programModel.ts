import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export * from "../../mock-data";

export type * from "./complianceProgramModel";

export type ComplianceProgramListResult<T> = FeatureListResult<T>;
