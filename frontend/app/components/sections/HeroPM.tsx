"use client"

import { useState, useEffect } from "react"
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
    src: "/screenshot-1430.png",
    alt: "Product brief preview",
  },
  2: {
    src: "/screenshot-1430.png",
    alt: "Roadmap planning preview",
  },
  3: {
    src: "/screenshot-1430.png",
    alt: "Experiment & validation preview",
  },
  4: {
    src: "/screenshot-1430.png",
    alt: "Shipping & launch preview",
  },
}

export default function HeroPM() {
  const [active, setActive] = useState<number>(1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-white overflow-hidden" id="steps">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-amber-50/30 animate-pulse" style={{ animationDuration: '4s' }} />
      
      <div className="container relative grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:py-16 lg:py-20">
        {/* Left copy */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl animate-fade-in">
            The first AI product manager
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600 sm:text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Meet your personal PM that transforms goals into outcomes—writing briefs, aligning plans, validating
            solutions, and shipping results with your team.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/prmmode"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:from-orange-400 hover:to-amber-400 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Start building
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Steps */}
          <ol className="mt-10 space-y-3">
            {steps.map((s, index) => (
              <li 
                key={s.key}
                className="animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <button
                  onMouseEnter={() => setActive(s.key)}
                  onFocus={() => setActive(s.key)}
                  className={`group grid w-full grid-cols-[2.25rem_1fr] items-start gap-3 rounded-xl border bg-white/70 backdrop-blur-sm px-3 py-3 text-left ring-1 transition-all duration-300 hover:scale-[1.02] ${
                    active === s.key
                      ? "border-orange-300 ring-orange-200 shadow-lg shadow-orange-100/50"
                      : "border-orange-100 ring-transparent hover:border-orange-200 hover:shadow-md"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 ${
                      active === s.key
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white scale-110 shadow-lg"
                        : "bg-orange-100 text-orange-700 group-hover:scale-105"
                    }`}
                  >
                    {s.key}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 transition-colors group-hover:text-orange-600">{s.title}</div>
                    <div className="text-sm text-neutral-600">{s.description}</div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Right preview */}
        <div className={`relative mx-auto w-full max-w-xl h-[500px] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
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
      className={`absolute inset-0 rounded-2xl border border-orange-200 bg-white p-2 shadow-2xl ring-1 ring-orange-100 transition-all duration-700 ease-out ${
        active 
          ? "opacity-100 translate-y-0 scale-100 rotate-0" 
          : "pointer-events-none translate-y-4 scale-95 opacity-0 rotate-1"
      }`}
    >
      <div className="h-full w-full overflow-hidden rounded-xl bg-white shadow-inner">
        <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50/50 px-3 py-2 text-xs text-neutral-600">
          <span className="h-3 w-3 rounded-full bg-red-400/80 animate-pulse" style={{ animationDuration: '2s' }} />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80 animate-pulse" style={{ animationDuration: '2.5s' }} />
          <span className="h-3 w-3 rounded-full bg-green-400/80 animate-pulse" style={{ animationDuration: '3s' }} />
          <span className="ml-2">{title} preview</span>
        </div>
        <div className="relative h-[420px] w-full bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-full object-contain transition-all duration-700 ${
              active ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
