import { vmsApi } from "@/features/shared/vms/api";
import type { ContractModel } from "@/features/shared/vms/types";

import type {
	ContractsCreateDto,
	ContractsUpdateDto,
} from "../dto/contractsDto";

function requireRecord<T>(record: T | null): T {
	if (!record) throw new Error("VMS record was not found");
	return record;
}

export async function listContracts(): Promise<ContractModel[]> {
	return vmsApi.listContracts();
}

export async function getContracts(id: string): Promise<ContractModel> {
	return requireRecord(await vmsApi.getContract(id));
}

export async function createContracts(
	input: ContractsCreateDto
): Promise<ContractModel> {
	return vmsApi.createContract(input);
}

export async function updateContracts(
	id: string,
	patch: ContractsUpdateDto
): Promise<ContractModel> {
	return requireRecord(await vmsApi.updateContract(id, patch));
}
