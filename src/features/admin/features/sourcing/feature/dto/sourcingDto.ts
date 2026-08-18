import type { RfxModel } from "@/features/shared/vms/types";

export type ApiSourcingDto = RfxModel;
export type SourcingCreateDto = Omit<RfxModel, "id" | "updatedAt" | "bidCount">;
export type SourcingUpdateDto = Partial<RfxModel>;
