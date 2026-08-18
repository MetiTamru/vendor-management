import { vmsApi } from "@/features/shared/vms/api";
import type { VendorCategoryModel } from "@/features/shared/vms/types";

function requireRecord<T>(record: T | null | undefined): T {
	if (!record) throw new Error("VMS record was not found");
	return record;
}

export async function listCategories(): Promise<VendorCategoryModel[]> {
	return vmsApi.listCategories();
}

export async function getCategories(id: string): Promise<VendorCategoryModel> {
	const items = await listCategories();
	return requireRecord(items.find((item) => item.id === id));
}
