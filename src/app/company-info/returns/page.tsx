import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";
import { ContactPhoneLink } from "@/components/ContactPhoneLink";

export default function ReturnsPage() {
  return (
    <PageContent title="Returns">
      <div className="space-y-6 text-neutral-600 not-prose">
        <p className="leading-relaxed">
          If you need to return a product, please contact us before shipping anything back. We will confirm whether
          the item is eligible and provide return instructions. An RMA (Return Merchandise Authorization) is required
          for all returns.
        </p>

        <div className="space-y-4">
          <p className="font-medium text-neutral-900">Our policy:</p>
          <ul className="list-disc space-y-3 pl-5 leading-relaxed">
            <li>
              <span className="font-medium text-neutral-900">Stock items</span> — eligible for return when in unused
              and resellable condition. The customer is responsible for the return freight plus a 25% restocking fee.
            </li>
            <li>
              <span className="font-medium text-neutral-900">Custom items</span> — not eligible for return. Exceptions
              may be made for items that we commonly sell, evaluated on a case-by-case basis. If approved, the customer
              is also responsible for the return freight plus a 30–50% restocking fee.
            </li>
          </ul>
        </div>

        <p className="leading-relaxed">
          For further assistance, call a product specialist at{" "}
          <ContactPhoneLink className="font-medium text-primary hover:underline" /> or{" "}
          <ContactLink className="font-medium text-primary hover:underline">contact us</ContactLink>.
        </p>
      </div>
    </PageContent>
  );
}
