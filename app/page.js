"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = shouldReduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-glow blur-3xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-md flex-col items-center text-center"
      >
        <motion.p variants={item} className="mb-3 text-sm font-semibold tracking-wide text-yellow">
          Burgir Fries
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl leading-none text-cream [text-shadow:0_0_40px_rgba(245,197,24,0.25)] sm:text-7xl"
        >
          BURGIR
          <br />
          FRIES
        </motion.h1>

        {/* Placeholder burger, built from CSS shapes.
            Swap this block for a real <img> once you have product photos. */}
        <motion.div variants={item} className="my-10 w-56">
          <div className="bun-top" />
          <div className="lettuce" />
          <div className="cheese" />
          <div className="patty" />
          <div className="bun-bottom" />
        </motion.div>

        {/* Now that /menu exists, the button links to the real page. */}
        <motion.a
          variants={item}
          href="/menu"
          whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: "0 12px 30px rgba(245,197,24,0.25)" }}
          className="inline-block rounded-full bg-yellow px-9 py-4 text-sm font-extrabold uppercase tracking-wide text-bg-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream"
        >
          Enter Burgir Fries
        </motion.a>
      </motion.div>
    </main>
  );
}