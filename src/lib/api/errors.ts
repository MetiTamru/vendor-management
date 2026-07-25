export type ApiFieldErrors = Record<string, string | string[]>;

export type ApiErrorBody = {
	message?: string;
	error?: string;
	code?: string;
	fieldErrors?: ApiFieldErrors;
	errors?: ApiFieldErrors;
};

export class ApiError extends Error {
	readonly status: number;
	readonly code?: string;
	readonly fieldErrors?: ApiFieldErrors;

	constructor(
		message: string,
		status: number,
		options?: { code?: string; fieldErrors?: ApiFieldErrors }
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = options?.code;
		this.fieldErrors = options?.fieldErrors;
	}
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}

export async function parseApiErrorResponse(
	response: Response
): Promise<ApiError> {
	const status = response.status;
	let body: ApiErrorBody | null = null;

	try {
		const text = await response.text();
		if (text) {
			body = JSON.parse(text) as ApiErrorBody;
		}
	} catch {
		body = null;
	}

	const fieldErrors = body?.fieldErrors ?? body?.errors;
	const message =
		body?.message ??
		body?.error ??
		response.statusText ??
		`Request failed with status ${status}`;

	return new ApiError(message, status, {
		code: body?.code,
		fieldErrors,
	});
}

export function getMutationErrorMessage(error: unknown): string {
	if (isApiError(error)) {
		if (error.fieldErrors) {
			const first = Object.entries(error.fieldErrors)[0];
			if (first) {
				const [, value] = first;
				if (Array.isArray(value)) return value[0] ?? error.message;
				return String(value);
			}
		}
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "An unexpected error occurred.";
}
