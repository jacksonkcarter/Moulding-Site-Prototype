import { PageContent } from "@/components/PageContent";
import { RegionalContacts } from "@/components/RegionalContacts";

type ContactUsPageProps = {
  searchParams: Promise<{ region?: string }>;
};

export default async function ContactUsPage({ searchParams }: ContactUsPageProps) {
  const params = await searchParams;
  const preferredRegion = params.region ?? null;

  return (
    <PageContent title="Contact us">
      <div className="space-y-6 text-neutral-600 not-prose">
        <p className="leading-relaxed">
          Reach Flex Trim East or West for sales, orders, and support.
        </p>
        <RegionalContacts preferredRegion={preferredRegion} />
      </div>
    </PageContent>
  );
}
