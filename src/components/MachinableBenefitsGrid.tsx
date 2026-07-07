"use client";

import { motion } from "framer-motion";

const KEY_BENEFITS = [
  {
    title: "Seamless workflow",
    description:
      "Ideal for custom short runs, allowing you to transition immediately after a standard wood moulding run.",
  },
  {
    title: "Cost-effective",
    description:
      "Offers significant savings by eliminating the need for custom tooling on orders with low linear footage.",
  },
  {
    title: "Specialty uses",
    description:
      "Recommended for radius arch extension jamb material, curved baseboard, and chair rail.",
  },
] as const;

const DIAGONAL_STEPS = [
  { offset: "ml-0", width: "w-full" },
  { offset: "ml-[8%]", width: "w-[92%]" },
  { offset: "ml-[16%]", width: "w-[84%]" },
] as const;

export function MachinableBenefitsGrid() {
  return (
    <section className="mt-14" aria-labelledby="key-benefits-heading">
      <motion.h2
        id="key-benefits-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
      >
        Key benefits &amp; applications
      </motion.h2>

      <ul className="relative mt-10 flex list-none flex-col gap-8 p-0 sm:gap-10">
        {KEY_BENEFITS.map((benefit, index) => (
          <motion.li
            key={benefit.title}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8% 0px" }}
            variants={{
              hidden: {
                opacity: 0,
                x: -36,
                y: 48,
              },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
              },
            }}
            transition={{ duration: 0.55, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
            className={`${DIAGONAL_STEPS[index].offset} ${DIAGONAL_STEPS[index].width}`}
          >
            <article className="h-full rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-white to-neutral-50 p-5 shadow-sm transition-shadow duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <div className="mb-3 h-1 w-8 rounded-full bg-primary" />
              <h3 className="text-sm font-semibold text-neutral-900 md:text-base">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">{benefit.description}</p>
            </article>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
