import type { RfxModel } from "@/features/shared/vms/types";

export type SourcingModel = RfxModel;

export type SourcingListResult = {
	items: RfxModel[];
	total: number;
};
