import { getLoginPath, isPublicPath } from "@/lib/routes";

describe("public route detection", () => {
	it("treats locale home as public", () => {
		expect(isPublicPath("/en")).toBe(true);
		expect(isPublicPath("/am/")).toBe(true);
	});

	it("treats auth routes as public", () => {
		expect(isPublicPath("/en/auth/login")).toBe(true);
		expect(getLoginPath("en")).toBe("/en/auth/login");
	});
});
