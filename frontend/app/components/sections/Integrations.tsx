"use client"
import { useEffect, useRef, useState } from "react"

const integrations = [
  {
    name: "JIRA",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd2d81302dc20473ea740f0c0d0c52723?format=webp&width=800",
    position: "top-[10%] left-[8%]",
    delay: 0,
  },
  {
    name: "Confluence",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd2d81302dc20473ea740f0c0d0c52723?format=webp&width=800",
    position: "top-[25%] right-[12%]",
    delay: 100,
  },
  {
    name: "Github",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd2d81302dc20473ea740f0c0d0c52723?format=webp&width=800",
    position: "bottom-[30%] left-[15%]",
    delay: 200,
  },
  {
    name: "Slack",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd2d81302dc20473ea740f0c0d0c52723?format=webp&width=800",
    position: "bottom-[15%] right-[10%]",
    delay: 300,
  },
]

export default function Integrations() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-20 md:py-32">
      <div className="container relative">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            Able to work{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              with hundreds of tools
            </span>
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
            Bevin connects to your favorite services, from JIRA to Slack
          </p>
        </div>

        {/* Floating integration icons */}
        <div className="relative mx-auto mt-12 h-[400px] max-w-4xl md:h-[500px]">
          {integrations.map((integration, index) => (
            <div
              key={integration.name}
              className={`absolute ${integration.position} transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{
                transitionDelay: `${integration.delay}ms`,
              }}
            >
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon container */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-200 bg-white/90 p-4 shadow-lg ring-1 ring-orange-100 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-24 sm:w-24">
                  <img
                    src={integration.icon || "/placeholder.svg"}
                    alt={integration.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {integration.name}
                </div>
              </div>
            </div>
          ))}

          {/* Center card */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/50 p-8 shadow-xl ring-1 ring-orange-100">
              <div className="relative z-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Build together with</h3>
                <p className="mt-1 text-sm text-neutral-600">Bevin.AI</p>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/10" />
            </div>
          </div>
        </div>

        {/* Additional integrations mention */}
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-500">Plus hundreds more integrations available</p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
    </section>
  )
}
