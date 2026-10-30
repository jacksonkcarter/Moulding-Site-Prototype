import { HowToMeasure } from "@/components/HowToMeasure";
import { PageContent } from "@/components/PageContent";

export default function HowToMeasurePage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
          How to measure based on your application
        </h1>
        <div className="mt-4">
          <HowToMeasure />
        </div>
      </div>
    </PageContent>
  );
}
