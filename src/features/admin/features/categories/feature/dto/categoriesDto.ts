import type { VendorCategoryModel } from "@/features/shared/vms/types";

export type ApiCategoriesDto = VendorCategoryModel;
export type CategoriesCreateDto = Omit<VendorCategoryModel, "id" | "vendorCount">;
export type CategoriesUpdateDto = Partial<VendorCategoryModel>;
