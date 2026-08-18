import type { RfxModel } from "@/features/shared/vms/types";

import type { ApiSourcingDto } from "../dto/sourcingDto";

/** VMS records already use the frontend model shape. */
export function toSourcingModel(dto: ApiSourcingDto): RfxModel {
	return dto;
}
