import {
	getLoginPath,
	isAdminPath,
	isPublicPath,
	localePath,
	resolveAuthRedirect,
} from "@/lib/routes";

describe("routes", () => {
	it("builds locale-prefixed paths", () => {
		expect(localePath("en", "/auth/login")).toBe("/en/auth/login");
	});

	it("detects public auth paths", () => {
		expect(isPublicPath("/en/auth/sign-up")).toBe(true);
		expect(isPublicPath("/en/dashboard")).toBe(false);
	});

	it("detects admin paths", () => {
		expect(isAdminPath("/en/admin/groups")).toBe(true);
		expect(isAdminPath("/en/admin")).toBe(true);
		expect(isAdminPath("/en")).toBe(false);
		expect(isAdminPath("/en/auth/login")).toBe(false);
	});

	it("returns login path for locale", () => {
		expect(getLoginPath("am")).toBe("/am/auth/login");
	});

	it("redirects unauthenticated users from admin to login", () => {
		expect(
			resolveAuthRedirect({
				pathname: "/en/admin/groups",
				authenticated: false,
				loginPath: "/en/auth/login",
				homePath: "/en",
			})
		).toBe("/en/auth/login");
	});

	it("allows authenticated users on admin paths", () => {
		expect(
			resolveAuthRedirect({
				pathname: "/en/admin/groups",
				authenticated: true,
				loginPath: "/en/auth/login",
				homePath: "/en",
			})
		).toBeNull();
	});

	it("redirects authenticated users away from login", () => {
		expect(
			resolveAuthRedirect({
				pathname: "/en/auth/login",
				authenticated: true,
				loginPath: "/en/auth/login",
				homePath: "/en",
			})
		).toBe("/en");
	});
});
