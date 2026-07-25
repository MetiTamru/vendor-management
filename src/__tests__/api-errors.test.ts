import {
	ApiError,
	getMutationErrorMessage,
	parseApiErrorResponse,
} from "@/lib/api/errors";

describe("ApiError", () => {
	it("parses JSON error bodies", async () => {
		const response = {
			status: 422,
			statusText: "Unprocessable Entity",
			text: async () =>
				JSON.stringify({
					message: "Validation failed",
					code: "VALIDATION",
					fieldErrors: { name: ["Name is required"] },
				}),
		} as Response;

		const error = await parseApiErrorResponse(response);
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(422);
		expect(error.message).toBe("Validation failed");
		expect(error.fieldErrors?.name).toEqual(["Name is required"]);
	});

	it("formats mutation messages from field errors", () => {
		const error = new ApiError("Validation failed", 422, {
			fieldErrors: { name: ["Name is required"] },
		});
		expect(getMutationErrorMessage(error)).toBe("Name is required");
	});
});
