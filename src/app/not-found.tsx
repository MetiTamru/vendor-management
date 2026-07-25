import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<html lang="en">
			<body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-foreground">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="text-muted-foreground">This page could not be found.</p>
				<Button asChild>
					<Link href="/">Go home</Link>
				</Button>
			</body>
		</html>
	);
}
