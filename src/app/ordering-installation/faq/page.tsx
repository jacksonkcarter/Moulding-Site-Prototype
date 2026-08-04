import { ContactLink } from "@/components/ContactLink";
import { ContactPhoneLink } from "@/components/ContactPhoneLink";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageContent } from "@/components/PageContent";
import { FAQ_CATEGORIES } from "@/data/faq";

export default function FAQPage() {
  return (
    <PageContent title="FAQ">
      <div className="space-y-8 text-neutral-600 not-prose">
        <FaqAccordion
          categories={FAQ_CATEGORIES}
          footer={
            <section className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-6 text-center sm:px-8">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Still have a question?</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed md:text-base">
                Call a product specialist at <ContactPhoneLink className="font-medium text-primary hover:underline" />{" "}
                or <ContactLink className="font-medium text-primary hover:underline">contact us</ContactLink>—we’re
                happy to help with profiles, materials, and installation.
              </p>
            </section>
          }
        />
      </div>
    </PageContent>
  );
}
