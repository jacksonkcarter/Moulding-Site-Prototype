import type { ReactNode } from "react";

type FeatureItem = {
  title: string;
  description: ReactNode;
};

type ProductKeyBenefitsProps = {
  benefits: readonly FeatureItem[];
  limitations: readonly FeatureItem[];
};

export function ProductKeyBenefits({ benefits, limitations }: ProductKeyBenefitsProps) {
  const rowCount = Math.max(benefits.length, limitations.length);

  return (
    <section className="mt-14" aria-labelledby="key-benefits-heading limitations-heading">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-neutral-300">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th
                id="key-benefits-heading"
                scope="col"
                className="w-1/2 border-b border-r border-neutral-300 bg-neutral-200 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-neutral-800"
              >
                Key benefits
              </th>
              <th
                id="limitations-heading"
                scope="col"
                className="w-1/2 border-b border-neutral-300 bg-neutral-200 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-neutral-800"
              >
                Limitations
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, index) => {
              const benefit = benefits[index];
              const limitation = limitations[index];
              const isLast = index === rowCount - 1;
              return (
                <tr key={index} className="align-top">
                  <td
                    className={`border-r border-neutral-300 px-4 py-4 ${isLast ? "" : "border-b"}`}
                  >
                    {benefit ? (
                      <>
                        <p className="text-sm font-semibold text-neutral-900 md:text-base">
                          {benefit.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                          {benefit.description}
                        </p>
                      </>
                    ) : null}
                  </td>
                  <td className={`px-4 py-4 ${isLast ? "" : "border-b border-neutral-300"}`}>
                    {limitation ? (
                      <>
                        <p className="text-sm font-semibold text-neutral-900 md:text-base">
                          {limitation.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                          {limitation.description}
                        </p>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
