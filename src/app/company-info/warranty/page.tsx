import { ContactLink } from "@/components/ContactLink";
import { PageContent } from "@/components/PageContent";

export default function WarrantyPage() {
  return (
    <PageContent title="Limited lifetime warranty for flexible moulding">
      <div className="space-y-8 text-neutral-600 not-prose">
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-neutral-900">1. Warranty coverage &amp; transferability</h2>
          <p className="leading-relaxed">
            Flex Trim / Carter Millwork Inc. (&quot;Company&quot;) warrants that its flexible moulding products
            (&quot;Products&quot;) will be free from manufacturing defects in materials and workmanship for the
            lifetime of the product, subject to the terms, conditions, and exclusions stated herein. This warranty is
            non-transferable and applies only to the original installation of the Product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-neutral-900">2. Conditions of warranty</h2>
          <p className="leading-relaxed">
            To maintain eligibility for coverage under this warranty, the following conditions must be met:
          </p>
          <p className="leading-relaxed">
            <span className="font-medium text-neutral-900">Proof of origin:</span> The claimant must provide either
            the original proof of purchase (sales receipt/invoice) or the original manufacturing label affixed to the
            piece (or photographic proof thereof).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-neutral-900">3. What is not covered (exclusions)</h2>
          <p className="leading-relaxed">
            This warranty does not cover damages, failures, or defects resulting from normal wear and tear, acts of
            God, abuse, alteration beyond standard mitering and installation, environmental extremes, or improper
            storage.
          </p>
          <p className="leading-relaxed">
            Crucially, this warranty does not cover improperly ordered or installed items, including, but not limited
            to, the following scenarios:
          </p>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed">
            <li>Elliptical applications ordered as eyebrow arc pieces.</li>
            <li>Bullnose and tight-radius applications ordered as straight pieces.</li>
            <li>
              Style 2 bending and crown applications ordered as straight pieces without prior written approval from
              the Company.
            </li>
            <li>Thin crown profiles utilized in &quot;floating crown&quot; applications.</li>
            <li>Curved portions of trim that have been forcefully flexed into a straight position.</li>
            <li>Trim that has been painted or stained prior to installation.</li>
            <li>Trim that has been sanded before being stained.</li>
            <li>
              Trim that is stained, but was not specifically ordered and specified as &quot;stain grade&quot; at the
              time of purchase.
            </li>
            <li>Trim installed using staples or any other incompatible fasteners, adhesives, or fillers.</li>
            <li>
              Any Product marked as &quot;No Warranty&quot; on the order confirmation due to pushing limits beyond the
              Company&apos;s recommended radii or applications.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-neutral-900">4. Company&apos;s obligations (remedies)</h2>
          <p className="leading-relaxed">
            If a Product is proven to be defective under the terms of this warranty, the Company will, at its sole
            option, either: (a) provide replacement flexible moulding for the defective portion, or (b) refund the
            original purchase price of the defective Product.
          </p>
          <p className="leading-relaxed">
            <span className="font-medium text-neutral-900">No labor coverage:</span> The Company is not responsible
            for, and this warranty does not cover, any labor costs associated with the removal, disposal, or
            reinstallation of the Product, nor any costs related to finishing, painting, staining, or scaffolding. The
            Company&apos;s liability is strictly limited to the replacement of the material or refund of the purchase
            price. All items must be thoroughly inspected for defects, profile accuracy, and discrepancies prior to
            installation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-neutral-900">5. Limitation of liability</h2>
          <p className="leading-relaxed uppercase tracking-wide text-sm text-neutral-700">
            Except as expressly set forth herein, Flex Trim / Carter Millwork Inc. makes no other warranties, express
            or implied, including but not limited to any implied warranties of merchantability or fitness for a
            particular purpose. In no event shall the Company be liable for any incidental, special, indirect, or
            consequential damages (including but not limited to lost profits or property damage) arising out of the
            use or inability to use the Product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-neutral-900">6. How to make a claim</h2>
          <p className="leading-relaxed">
            To initiate a warranty claim, the claimant must contact Flex Trim / Carter Millwork Inc. Customer Service
            at{" "}
            <a href="mailto:orders@carterflex.com" className="font-medium text-primary hover:underline">
              orders@carterflex.com
            </a>{" "}
            or{" "}
            <a href="tel:8008610734" className="font-medium text-primary hover:underline">
              (800) 861-0734
            </a>{" "}
            within sixty (60) days of discovering the alleged defect. The claimant must provide a written description
            of the issue, photographs of the defect, and the required proof of purchase or manufacturing label.
          </p>
          <p className="leading-relaxed">
            You can also{" "}
            <ContactLink className="font-medium text-primary hover:underline">contact us</ContactLink> for
            assistance.
          </p>
        </section>
      </div>
    </PageContent>
  );
}
