import type { ContractModel } from "@/features/shared/vms/types";

import type { ApiContractsDto } from "../dto/contractsDto";

/** VMS records already use the frontend model shape. */
export function toContractsModel(dto: ApiContractsDto): ContractModel {
	return dto;
}
