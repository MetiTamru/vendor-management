import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="container mx-auto space-y-8 px-4 py-16">
			<Skeleton className="mx-auto h-12 w-64" />
			<Skeleton className="mx-auto h-6 w-96 max-w-full" />
			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-32 w-full rounded-lg" />
				))}
			</div>
		</div>
	);
}
