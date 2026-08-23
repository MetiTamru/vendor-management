import { getLoginPath, isPublicPath } from "@/lib/routes";

describe("public route detection", () => {
	it("treats locale home as protected", () => {
		expect(isPublicPath("/en")).toBe(false);
		expect(isPublicPath("/am/")).toBe(false);
	});

	it("treats auth routes as public", () => {
		expect(isPublicPath("/en/auth/login")).toBe(true);
		expect(getLoginPath("en")).toBe("/en/auth/login");
	});
});
