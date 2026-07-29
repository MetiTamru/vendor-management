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
});
