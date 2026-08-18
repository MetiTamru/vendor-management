import type { VendorCategoryModel } from "@/features/shared/vms/types";

export type CategoriesModel = VendorCategoryModel;

export type CategoriesListResult = {
	items: VendorCategoryModel[];
	total: number;
};
