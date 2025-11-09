"use client"
import { useState } from "react"

const useCases = [
  {
    id: 1,
    title: "Code Migration + Refactors",
    description:
      "From implementing new features to fixing thousands of lint errors, Bevin can clear your backlog, modernize your codebase, and help you build more.",
    features: ["Language migrations", "Version upgrades", "Codebase restructuring"],
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd96283145e66417d93c4ce71c628ef6a?format=webp&width=800",
  },
  {
    id: 2,
    title: "Feature Development",
    description:
      "Ship new features end-to-end with AI-powered planning, coding, testing, and deployment—all integrated with your existing workflow.",
    features: ["End-to-end development", "Automated testing", "CI/CD integration"],
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd96283145e66417d93c4ce71c628ef6a?format=webp&width=800",
  },
  {
    id: 3,
    title: "Bug Fixes + Maintenance",
    description:
      "Identify, diagnose, and resolve bugs across your codebase. Keep your product running smoothly with automated maintenance tasks.",
    features: ["Bug detection", "Root cause analysis", "Automated fixes"],
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1266dee22f9f4ea39c124bde63ed8528%2Fd96283145e66417d93c4ce71c628ef6a?format=webp&width=800",
  },
]

export default function UseCases() {
  const [activeId, setActiveId] = useState<number | null>(null)

  return (
    <section id="use-cases" className="relative bg-white py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">Use cases</h2>
          <p className="mt-2 text-neutral-900">
            From implementing new features to fixing thousands of lint errors, Bevin can clear your backlog, modernize
            your codebase, and help you build more.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:gap-3">
          {useCases.map((useCase) => {
            const isActive = activeId === useCase.id
            const isAnyActive = activeId !== null

            return (
              <div
                key={useCase.id}
                onMouseEnter={() => setActiveId(useCase.id)}
                onMouseLeave={() => setActiveId(null)}
                className={`relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br transition-all duration-500 ${
                  isActive
                    ? "from-orange-50 via-white to-amber-50 shadow-xl lg:flex-[2]"
                    : isAnyActive
                      ? "from-white to-orange-50/30 lg:flex-[0.5]"
                      : "from-white to-orange-50/30 lg:flex-1"
                }`}
              >
                {/* Content */}
                <div className={`relative z-10 p-6 transition-all duration-500 ${isActive ? "lg:p-8" : ""}`}>
                  <h3
                    className={`font-semibold text-neutral-900 transition-all duration-300 ${
                      isActive ? "text-2xl lg:text-3xl" : "text-xl"
                    }`}
                  >
                    {useCase.title}
                  </h3>

                  <div
                    className={`grid transition-all duration-500 ${
                      isActive ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-6 text-neutral-700 lg:text-base">{useCase.description}</p>
                      <ul className="mt-4 space-y-2">
                        {useCase.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-neutral-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Screenshot preview */}
                      <div className="mt-6 overflow-hidden rounded-xl border border-orange-200 bg-white shadow-lg">
                        <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50/50 px-3 py-2">
                          <span className="h-3 w-3 rounded-full bg-red-400/80" />
                          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                          <span className="h-3 w-3 rounded-full bg-green-400/80" />
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
                          <img
                            src={useCase.image || "/placeholder.svg"}
                            alt={`${useCase.title} preview`}
                            className="h-auto w-full rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient overlay for inactive state */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
