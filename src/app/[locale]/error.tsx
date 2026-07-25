"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { captureException } from "@/lib/error-reporting";

export default function LocaleError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		captureException(error, { boundary: "locale" });
	}, [error]);

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
			<h2 className="text-2xl font-semibold">Something went wrong</h2>
			<p className="max-w-md text-center text-muted-foreground">
				{error.message || "An unexpected error occurred. Please try again."}
			</p>
			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
