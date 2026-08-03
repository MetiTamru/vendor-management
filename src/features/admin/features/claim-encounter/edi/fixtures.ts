export const EDI_FIXTURE_PATHS = {
	"837I": "/edi/837I_Magellan_sample.txt",
	"835": "/edi/835_P_sample.txt",
} as const;

export type EdiFixtureKey = keyof typeof EDI_FIXTURE_PATHS;

const cache = new Map<string, string>();

export async function loadEdiFixture(key: EdiFixtureKey): Promise<string> {
	const path = EDI_FIXTURE_PATHS[key];
	const cached = cache.get(path);
	if (cached) return cached;
	const res = await fetch(path);
	if (!res.ok) {
		throw new Error(`Failed to load EDI fixture ${path}: ${res.status}`);
	}
	const text = await res.text();
	cache.set(path, text);
	return text;
}

export async function loadEdiByPath(path: string): Promise<string> {
	const cached = cache.get(path);
	if (cached) return cached;
	const res = await fetch(path);
	if (!res.ok) {
		throw new Error(`Failed to load EDI ${path}: ${res.status}`);
	}
	const text = await res.text();
	cache.set(path, text);
	return text;
}

/** Map transaction / file type to a fixture key. */
export function fixtureKeyForTransaction(
	transactionType: string
): EdiFixtureKey {
	if (transactionType === "835") return "835";
	return "837I";
}
