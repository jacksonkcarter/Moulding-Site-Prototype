import Link from "next/link";
import { PageContent } from "@/components/PageContent";

export default function PortalPage() {
  return (
    <PageContent title="Customer Portal">
      <p className="text-neutral-600">
        Welcome to your customer portal. More features will be available here soon.
      </p>
      <p className="mt-4">
        <Link href="/portal/login" className="text-sm text-primary hover:underline">
          Sign out (return to login)
        </Link>
      </p>
    </PageContent>
  );
}
