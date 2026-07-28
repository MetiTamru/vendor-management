import { Skeleton } from "@/components/ui/skeleton";

export default function VendorLoading() {
	return (
		<div className="container space-y-6 py-8">
			<Skeleton className="h-10 w-48" />
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}
