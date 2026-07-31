import { Button } from "@/components/ui/button";
import { VendorComparisonPage } from "@/features/admin/features/vendor-comparison/pages/VendorComparisonPage";
import { Link } from "@/i18n/navigation";

export default function Page() {
	return (
		<VendorComparisonPage
			headerActions={
				<>
					<Button asChild size="sm" variant="outline" className="h-9">
						<Link href="/admin/vendors">Vendors</Link>
					</Button>
					<Button asChild size="sm" variant="outline" className="h-9">
						<Link href="/admin/risk-scoring">Risk Scoring</Link>
					</Button>
				</>
			}
		/>
	);
}
