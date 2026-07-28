import { resolveAuthRedirect } from "@/lib/routes";

describe("middleware auth decisions", () => {
	it("protects all admin routes when unauthenticated", () => {
		for (const path of ["/en/admin", "/en/admin/groups", "/am/admin/users"]) {
			expect(
				resolveAuthRedirect({
					pathname: path,
					authenticated: false,
					loginPath: path.startsWith("/am")
						? "/am/auth/login"
						: "/en/auth/login",
					homePath: path.startsWith("/am") ? "/am" : "/en",
				})
			).toMatch(/\/auth\/login$/);
		}
	});

	it("protects vendor routes when unauthenticated", () => {
		expect(
			resolveAuthRedirect({
				pathname: "/en/vendor/contracts",
				authenticated: false,
				loginPath: "/en/auth/login",
				homePath: "/en/admin",
			})
		).toBe("/en/auth/login");
	});
});
