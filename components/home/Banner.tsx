"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=70";

export function Banner() {
  const reduceMotion = useReducedMotion();
  const start = reduceMotion ? false : { opacity: 0, y: 24 };

  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

      <Container className="py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl text-white">
          <motion.p
            initial={start}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest uppercase text-white/80"
          >
            Your wedding, beautifully planned
          </motion.p>
          <motion.h1
            initial={start}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-5xl leading-tight font-semibold sm:text-6xl lg:text-7xl"
          >
            Find the perfect vendors for your big day
          </motion.h1>
          <motion.p
            initial={start}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-lg text-white/85"
          >
            Browse photographers, venues, florists, caterers and more. Compare services and
            send booking requests in a few clicks.
          </motion.p>
          <motion.div
            initial={start}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Link href="/services" className={buttonVariants({ size: "lg" })}>
              Explore Wedding Services
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}