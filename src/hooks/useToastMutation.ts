import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getMutationErrorMessage, isApiError } from "@/lib/api/errors";

export type APIResponseType = {
	ok: boolean;
	message: string;
	data?: object;
};

type MutationFunctionType<TParams> = (
	_params: TParams
) => Promise<APIResponseType>;

type UseToastMutationOptions<TParams> = {
	// eslint-disable-next-line no-unused-vars
	onSuccess?: (data: APIResponseType, variables: TParams) => void;

	// eslint-disable-next-line no-unused-vars
	onError?: (error: any) => void;
};

export default function useToastMutation<TParams>(
	mutationKey: unknown,
	mutationFn: MutationFunctionType<TParams>,
	loadingMessage?: string,
	options?: UseToastMutationOptions<TParams>
): UseMutationResult<APIResponseType, unknown, TParams, unknown> {
	return useMutation({
		mutationKey: [mutationKey],
		mutationFn: async (params: TParams) => {
			const response = await mutationFn(params);
			if (!response.ok) throw response;
			return response;
		},
		onMutate: () => {
			toast.dismiss();
			toast.loading(loadingMessage || "Loading...");
		},
		onSuccess: (data, variables) => {
			toast.dismiss();
			toast.success(data.message);
			options?.onSuccess?.(data, variables); // Call provided onSuccess if exists
		},
		onError: (error: unknown) => {
			toast.dismiss();
			toast.error(getMutationErrorMessage(error));

			if (isApiError(error) && error.fieldErrors) {
				for (const [field, value] of Object.entries(error.fieldErrors)) {
					const messages = Array.isArray(value) ? value : [String(value)];
					for (const msg of messages) {
						toast.error(`${field}: ${msg}`);
					}
				}
			}

			options?.onError?.(error);
		},
	});
}
