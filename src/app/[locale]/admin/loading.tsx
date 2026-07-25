import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<Skeleton className="h-8 w-48" />
			<div className="grid gap-4 sm:grid-cols-3">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
			<Skeleton className="h-64 w-full" />
		</div>
	);
}
