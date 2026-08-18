import type { ContractModel } from "@/features/shared/vms/types";

export type ApiContractsDto = ContractModel;
export type ContractsCreateDto = Omit<ContractModel, "id" | "updatedAt">;
export type ContractsUpdateDto = Partial<ContractModel>;
