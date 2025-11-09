"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    key: 1,
    title: "Brief",
    description: "Turn ideas into clear, prioritized product briefs with goals and constraints.",
  },
  {
    key: 2,
    title: "Plan",
    description: "Generate roadmaps, break initiatives into tickets, and align stakeholders.",
  },
  {
    key: 3,
    title: "Validate",
    description: "Design experiments, gather feedback, and model impact before build.",
  },
  {
    key: 4,
    title: "Ship",
    description: "Open actionable PRDs, track delivery, and announce launches with insights.",
  },
] as const

const images: Record<number, { src: string; alt: string }> = {
  1: {
    src: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2F94cd6fd0df9c41ffb2fd1a84e265f66b?format=webp&width=800",
    alt: "Product brief preview",
  },
  2: {
    src: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2F94cd6fd0df9c41ffb2fd1a84e265f66b?format=webp&width=800",
    alt: "Roadmap planning preview",
  },
  3: {
    src: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2F94cd6fd0df9c41ffb2fd1a84e265f66b?format=webp&width=800",
    alt: "Experiment & validation preview",
  },
  4: {
    src: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2F94cd6fd0df9c41ffb2fd1a84e265f66b?format=webp&width=800",
    alt: "Shipping & launch preview",
  },
}

export default function HeroPM() {
  const [active, setActive] = useState<number>(1)

  return (
    <section className="relative bg-white" id="steps">
      <div className="container grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:py-16 lg:py-20">
        {/* Left copy */}
        <div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            The first AI product manager
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600 sm:text-lg">
            Meet your personal PM that transforms goals into outcomes—writing briefs, aligning plans, validating
            solutions, and shipping results with your team.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/prmmode"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Steps */}
          <ol className="mt-10 space-y-3">
            {steps.map((s) => (
              <li key={s.key}>
                <button
                  onMouseEnter={() => setActive(s.key)}
                  onFocus={() => setActive(s.key)}
                  className={`group grid w-full grid-cols-[2.25rem_1fr] items-start gap-3 rounded-xl border bg-white/70 px-3 py-3 text-left ring-1 transition ${
                    active === s.key
                      ? "border-orange-300 ring-orange-200 shadow-sm"
                      : "border-orange-100 ring-transparent hover:border-orange-200"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                      active === s.key
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {s.key}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{s.title}</div>
                    <div className="text-sm text-neutral-600">{s.description}</div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Right preview */}
        <div className="relative mx-auto w-full max-w-xl">
          {steps.map((s) => (
            <PreviewCard
              key={s.key}
              active={active === s.key}
              title={s.title}
              src={images[s.key].src}
              alt={images[s.key].alt}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PreviewCard({ active, title, src, alt }: { active: boolean; title: string; src: string; alt: string }) {
  return (
    <div
      className={`absolute inset-0 rounded-2xl border border-orange-200 bg-white p-2 shadow-xl ring-1 ring-orange-100 transition-all duration-500 ${
        active ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
      }`}
    >
      <div className="h-full w-full overflow-hidden rounded-xl bg-white">
        <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50/50 px-3 py-2 text-xs text-neutral-600">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-2">{title} preview</span>
        </div>
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="h-[420px] w-full object-contain bg-gradient-to-br from-orange-50 via-white to-amber-50"
        />
      </div>
    </div>
  )
}
