export function isVmsMockEnabled() {
	return process.env.NEXT_PUBLIC_USE_MOCK_VMS !== "false";
}
