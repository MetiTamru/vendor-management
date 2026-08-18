import type { VendorCategoryModel } from "@/features/shared/vms/types";

import type { ApiCategoriesDto } from "../dto/categoriesDto";

/** VMS records already use the frontend model shape. */
export function toCategoriesModel(dto: ApiCategoriesDto): VendorCategoryModel {
	return dto;
}
