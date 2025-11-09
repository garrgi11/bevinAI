"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplatePicker() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<"new" | "update" | null>(null)

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-orange-600">
                Get Started
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Pick a<span className="block text-orange-600 mt-2">Template</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-light tracking-wide max-w-2xl mx-auto">
              Choose the perfect service template to get started with your project
            </p>
          </div>
        </div>

        {/* Cards Container */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
          {/* New Service Card */}
          <div
            onMouseEnter={() => setHoveredCard("new")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => router.push("/requirements")}
            className="group cursor-pointer h-full"
          >
            <div className="relative h-full bg-white border-2 border-gray-200 rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:border-orange-500 hover:shadow-lg">
              {/* Card Content */}
              <div className="flex flex-col items-center justify-center gap-6 h-full text-center">
                <div className="py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-500/10 transition hover:from-orange-400 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 shadow-md">
                  <span className="text-3xl sm:text-4xl font-bold text-white block">+</span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    New Service
                  </h2>
                </div>

                {/* Description - shown on hover or always on mobile */}
                <div
                  className={`pt-4 border-t border-gray-200 w-full transition-all duration-300 ${hoveredCard === "new" ? "opacity-100" : "opacity-0 md:opacity-0 group-hover:opacity-100"}`}
                >
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Create a New Service</p>
                </div>
              </div>
            </div>
          </div>

          {/* Update Services Card */}
          <div
            onMouseEnter={() => setHoveredCard("update")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group cursor-pointer h-full"
          >
            <div className="relative h-full bg-white border-2 border-gray-200 rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:border-orange-500 hover:shadow-lg">
              {/* Card Content */}
              <div className="flex flex-col items-center justify-center gap-6 h-full text-center">
                <div className="py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-500/10 transition hover:from-orange-400 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 shadow-md">
                  <span className="text-3xl sm:text-4xl font-bold text-white block">↻</span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    Update Services
                  </h2>
                </div>

                {/* Description - shown on hover or always on mobile */}
                <div
                  className={`pt-4 border-t border-gray-200 w-full transition-all duration-300 ${hoveredCard === "update" ? "opacity-100" : "opacity-0 md:opacity-0 group-hover:opacity-100"}`}
                >
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    Update or Migrate From an Older to Newer Service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
