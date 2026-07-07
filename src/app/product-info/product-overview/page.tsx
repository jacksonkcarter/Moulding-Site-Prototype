import { PageContent } from "@/components/PageContent";
import { ProductApplicationShowcase } from "@/components/ProductApplicationShowcase";

export default function ProductOverviewPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <ProductApplicationShowcase />
      </div>
    </PageContent>
  );
}
