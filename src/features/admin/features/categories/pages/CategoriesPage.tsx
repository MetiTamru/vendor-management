"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCategoriesList } from "../feature/queries/useCategoriesQuery";

export function CategoriesPage() {
	const { categories, isLoading, error } = useCategoriesList();

	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-56" />
				<Skeleton className="h-72 w-full" />
			</div>
		);

	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Vendor categories
				</h1>
				<p className="text-sm text-muted-foreground">
					Procurement taxonomy and supplier coverage.
				</p>
			</div>
			{error ? (
				<p className="text-sm text-destructive">{error.message}</p>
			) : (
				<div className="rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Category</TableHead>
								<TableHead>Code</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right">Vendors</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{categories.map((category) => (
								<TableRow key={category.id}>
									<TableCell className="font-medium">{category.name}</TableCell>
									<TableCell className="font-mono text-xs">
										{category.code}
									</TableCell>
									<TableCell className="max-w-md whitespace-normal text-muted-foreground">
										{category.description ?? "—"}
									</TableCell>
									<TableCell className="text-right tabular-nums">
										{category.vendorCount}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
