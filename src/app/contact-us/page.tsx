import { PageContent } from "@/components/PageContent";

export default function ContactUsPage() {
  return (
    <PageContent title="Contact us">
      <div className="space-y-8 text-neutral-600">
        <p>Reach Flex Trim East or West for sales, orders, and support.</p>
        <section>
          <h2 className="text-xl font-medium text-neutral-900">Flex Trim East</h2>
          <p>117 Cedar Lane Drive, Lexington, NC 27292</p>
          <p>Phone: <a href="tel:8008610734" className="text-[#9f1b20] hover:underline">(800) 861-0734</a></p>
          <p>Fax: (800) 861-0737</p>
          <p>Email: <a href="mailto:sales@flextrim.com" className="text-[#9f1b20] hover:underline">sales@flextrim.com</a></p>
        </section>
        <section>
          <h2 className="text-xl font-medium text-neutral-900">Flex Trim West</h2>
          <p>533 South 500 West, Provo, UT 84601</p>
          <p>Phone: <a href="tel:8778774595" className="text-[#9f1b20] hover:underline">(877) 877-4595</a></p>
          <p>Fax: (877) 865-1660</p>
          <p>Email: <a href="mailto:orders@flextrim.com" className="text-[#9f1b20] hover:underline">orders@flextrim.com</a></p>
        </section>
      </div>
    </PageContent>
  );
}
