import type { ContractModel } from "@/features/shared/vms/types";

export type ContractsModel = ContractModel;

export type ContractsListResult = {
	items: ContractModel[];
	total: number;
};
