import { isBuyerRole, isVendorRole } from "@/features/shared/vms/utils";

describe("vms role helpers", () => {
	it("detects vendor roles", () => {
		expect(isVendorRole(["vendor_admin"])).toBe(true);
		expect(isVendorRole(["admin"])).toBe(false);
	});

	it("detects buyer roles", () => {
		expect(isBuyerRole(["admin"])).toBe(true);
		expect(isBuyerRole(["vendor_finance"])).toBe(false);
		expect(isBuyerRole([])).toBe(true);
	});
});
