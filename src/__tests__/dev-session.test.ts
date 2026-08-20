import {
	DEV_SIGNED_OUT_COOKIE,
	isDevSignedOutCookieValue,
} from "@/lib/auth/dev-session";

describe("dev session cookie", () => {
	it("treats only value 1 as signed out", () => {
		expect(isDevSignedOutCookieValue("1")).toBe(true);
		expect(isDevSignedOutCookieValue("0")).toBe(false);
		expect(isDevSignedOutCookieValue(undefined)).toBe(false);
	});

	it("exports a stable cookie name", () => {
		expect(DEV_SIGNED_OUT_COOKIE).toBe("tilla-dev-signed-out");
	});
});
