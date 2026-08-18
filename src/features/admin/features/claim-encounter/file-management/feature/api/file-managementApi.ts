/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";
import * as mock from "../../mock-data";

export async function listSourceFiles(...args: Parameters<typeof mock.mockSourceFiles>) {
	return withMockOrRemote(
		() => mock.mockSourceFiles(...args),
		async () => [] as Awaited<ReturnType<typeof mock.mockSourceFiles>>
	);
}

export async function listIssuerFiles(...args: Parameters<typeof mock.mockIssuerFiles>) {
	return withMockOrRemote(
		() => mock.mockIssuerFiles(...args),
		async () => [] as Awaited<ReturnType<typeof mock.mockIssuerFiles>>
	);
}

export async function listHhsFiles(...args: Parameters<typeof mock.mockHhsFiles>) {
	return withMockOrRemote(
		() => mock.mockHhsFiles(...args),
		async () => [] as Awaited<ReturnType<typeof mock.mockHhsFiles>>
	);
}
