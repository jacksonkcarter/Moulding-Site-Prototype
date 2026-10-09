import { PageContent } from "@/components/PageContent";

const PRINCIPLES = [
  "Treat people the way you want to be treated, including our suppliers, our employees, and most importantly our customers.",
  "Do the right thing the first time, and do it on time.",
  "If you make a mistake, fix it immediately.",
  "Say what you are going to do, and do what you say.",
  "Nothing falls into the \"it's not my job\" category, from top management down.",
] as const;

export default function ManagementPhilosophyPage() {
  return (
    <PageContent title="Management philosophy">
      <div className="space-y-8 text-neutral-600 not-prose">
        <section className="space-y-4">
          <p className="leading-relaxed">
            As a second-generation family-owned business, we take a hands-on approach with a conservative operating
            style. We grow carefully, because the worst mistake a company can make is promising something to a
            customer, whether new or longtime, and failing to deliver. Our goal is simple: we do not aim to be the biggest
            flexible moulding supplier, only the best.
          </p>
          <p className="leading-relaxed">
            Flex Trim™ has grown by listening to our customers and finding practical solutions to their challenges.
            We believe our service and support are unmatched in the industry, and we work to make every buying
            experience straightforward and reliable.
          </p>
        </section>

        <section className="space-y-4">
          <p className="leading-relaxed">
            Customers are the lifeblood of our business. Our management philosophy is simple:
          </p>
          <ul className="list-disc space-y-3 pl-5 leading-relaxed">
            {PRINCIPLES.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <p className="leading-relaxed">
            What we are most proud of is hearing from customers that we are among their best suppliers, that when they
            place an order with us, it arrives on time and the parts are right the first time. And if we do make a
            mistake, we jump through hoops to make it right.
          </p>
          <p className="leading-relaxed">
            Our objective is to stay out of sight and out of mind from the moment an order is placed until the
            customer is ready to place the next one.
          </p>
        </section>
      </div>
    </PageContent>
  );
}
