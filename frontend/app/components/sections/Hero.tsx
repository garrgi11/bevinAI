"use client";

import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate">
      <div className="container pt-20 pb-10 md:pt-28 md:pb-16 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            The first AI software engineer
          </h1>
          <p className="mt-6 text-pretty text-base leading-7 text-white/70 sm:text-lg">
            Forge pairs with your team to plan, code, test, and ship features end‑to‑end. Give high‑level goals, get production‑ready pull requests.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#cta"
              onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-violet-400 hover:to-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Request access
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#demo"
              onClick={(e) => { e.preventDefault(); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Play className="h-4 w-4" /> Watch demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
