import Link from "next/link";
import { PageContent } from "@/components/PageContent";

export default function PortalPage() {
  return (
    <PageContent title="Customer portal">
      <p className="text-neutral-500">Coming soon</p>
      <p className="mt-4">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Back to site
        </Link>
      </p>
    </PageContent>
  );
}
