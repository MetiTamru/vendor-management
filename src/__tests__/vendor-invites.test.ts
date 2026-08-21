/**
 * @jest-environment jsdom
 */
import {
	buildAcceptPath,
	createVendorInvite,
	getInviteByToken,
	getPendingInviteByVendorId,
	markInviteAccepted,
	resolveInviteToken,
} from "@/lib/auth/vendor-invites";

describe("vendor-invites", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("creates a pending invite and resolves by token", () => {
		const invite = createVendorInvite({
			vendorId: "vnd-test",
			legalName: "Acme Supply",
			email: "ops@acme.test",
			categories: ["PBM"],
		});

		expect(invite.status).toBe("pending");
		expect(buildAcceptPath(invite.token)).toContain(invite.token);

		const byToken = getInviteByToken(invite.token);
		expect(byToken?.legalName).toBe("Acme Supply");
		expect(getPendingInviteByVendorId("vnd-test")?.token).toBe(invite.token);
		expect(resolveInviteToken(invite.token).state).toBe("valid");
	});

	it("marks invite accepted and blocks reuse", () => {
		const invite = createVendorInvite({
			vendorId: "vnd-2",
			legalName: "Beta",
			email: "a@b.co",
			categories: [],
		});

		const accepted = markInviteAccepted(invite.token);
		expect(accepted?.status).toBe("accepted");
		expect(resolveInviteToken(invite.token).state).toBe("accepted");
		expect(getPendingInviteByVendorId("vnd-2")).toBeNull();
	});

	it("reports missing and invalid tokens", () => {
		expect(resolveInviteToken(null).state).toBe("missing");
		expect(resolveInviteToken("nope").state).toBe("invalid");
	});
});
