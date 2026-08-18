import type { ScorecardModel } from "@/features/shared/vms/types";

export type ApiPerformanceDto = ScorecardModel;
export type PerformanceCreateDto = Omit<ScorecardModel, "id" | "updatedAt">;
export type PerformanceUpdateDto = Partial<ScorecardModel>;
