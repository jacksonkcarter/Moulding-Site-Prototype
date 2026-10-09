"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import style1Image from "../../Project_Info/Miscellaneous-Images/Style 1.png";

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
      "Recommended for radius arch extension jamb material, curved baseboard, and chair rail bending style 1 only.",
  },
] as const;

export function MachinableBenefitsGrid() {
  const listRef = useRef<HTMLUListElement>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      // Match image to the text column only from lg up.
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setImageHeight(list.getBoundingClientRect().height);
      } else {
        setImageHeight(null);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="mt-14 mx-[1in]" aria-labelledby="key-benefits-heading">
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

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <ul
          ref={listRef}
          className="flex min-w-0 flex-1 list-none flex-col gap-3 p-0 sm:gap-3.5 lg:max-w-3xl"
        >
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
                  x: -24,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                },
              }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="px-0.5 py-0.5">
                <div className="mb-2 h-0.5 w-6 rounded-full bg-primary" />
                <h3 className="text-sm font-semibold text-neutral-900">{benefit.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {benefit.description}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>

        <motion.figure
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full shrink-0 justify-center lg:w-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- sized to match text column height */}
          <img
            src={style1Image.src}
            alt="Style 1 bending orientation for Machinable S4S specialty uses"
            className="w-full max-w-md object-contain lg:max-w-none"
            style={
              imageHeight
                ? { height: imageHeight, width: "auto", maxWidth: "100%" }
                : { height: "auto", width: "100%" }
            }
          />
        </motion.figure>
      </div>
    </section>
  );
}
