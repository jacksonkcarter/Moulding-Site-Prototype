import { OrderingTips } from "@/components/OrderingTips";
import { PageContent } from "@/components/PageContent";

export default function OrderingTipsPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
          What you need to know to order
        </h1>
        <OrderingTips showTopBorder={false} hideHeading />
      </div>
    </PageContent>
  );
}
