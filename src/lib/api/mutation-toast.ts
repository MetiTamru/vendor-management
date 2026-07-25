import { toast } from "sonner";

import { getMutationErrorMessage, isApiError } from "./errors";

export function toastMutationError(error: unknown, fallback?: string) {
	const message = getMutationErrorMessage(error);
	toast.error(
		fallback && message === "An unexpected error occurred." ? fallback : message
	);

	if (isApiError(error) && error.fieldErrors) {
		for (const [field, value] of Object.entries(error.fieldErrors)) {
			const messages = Array.isArray(value) ? value : [String(value)];
			for (const msg of messages) {
				if (msg !== message) {
					toast.error(`${field}: ${msg}`);
				}
			}
		}
	}
}
