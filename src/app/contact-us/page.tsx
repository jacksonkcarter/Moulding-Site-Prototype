import { ContactUsForm } from "@/components/ContactUsForm";
import { PageContent } from "@/components/PageContent";
import { RegionalContacts } from "@/components/RegionalContacts";

type ContactUsPageProps = {
  searchParams: Promise<{ region?: string }>;
};

export default async function ContactUsPage({ searchParams }: ContactUsPageProps) {
  const params = await searchParams;
  const preferredRegion = params.region ?? null;

  return (
    <PageContent title="Contact us" fullWidth>
      <div className="mx-auto max-w-5xl space-y-8 text-neutral-600 not-prose">
        <p className="leading-relaxed text-neutral-700">
          Fill out this form and we&apos;ll get back to you within 24 hours. You can also reach out to us
          at the facility that serves your area.
        </p>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
          <ContactUsForm />
          <RegionalContacts dense preferredRegion={preferredRegion} className="lg:sticky lg:top-28" />
        </div>
      </div>
    </PageContent>
  );
}
