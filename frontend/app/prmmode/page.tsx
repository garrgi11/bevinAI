"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap } from "lucide-react";

export default function TemplatePicker() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<"new" | "update" | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className={`w-full max-w-4xl mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-widest uppercase text-orange-600 bg-orange-100/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Get Started
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Pick a <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Template</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-light tracking-wide max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Choose the perfect service template to kickstart your project with AI-powered assistance
            </p>
          </div>
        </div>

        {/* Cards Container */}
        <div className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.6s' }}>
          {/* New Service Card */}
          <div
            onMouseEnter={() => setHoveredCard("new")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => router.push("/requirements")}
            className="group cursor-pointer h-full animate-fade-in"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="relative h-full bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 hover:-translate-y-2">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-500" />
              
              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card Content */}
              <div className="relative flex flex-col items-center justify-center gap-6 h-full text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                  <div className="relative py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 ring-1 ring-orange-500/10 transition-all duration-300 group-hover:from-orange-400 group-hover:to-amber-400 group-hover:scale-110 group-hover:rotate-3">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    New Service
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 group-hover:text-orange-500 transition-colors">Start from scratch</p>
                </div>

                {/* Description */}
                <div className={`pt-4 border-t border-orange-200 w-full transition-all duration-500 ${hoveredCard === "new" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                  <p className="text-sm sm:text-base text-gray-600 font-medium mb-8">Create a brand new service with AI-powered requirements analysis</p>
                  
                  {/* Hover indicator */}
                  <div className="flex items-center justify-center gap-2 text-orange-600 text-sm font-semibold">
                    <span>Get Started</span>
                    <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Update Services Card */}
          <div
            onMouseEnter={() => setHoveredCard("update")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group cursor-pointer h-full animate-fade-in"
            style={{ animationDelay: '0.9s' }}
          >
            <div className="relative h-full bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 hover:-translate-y-2">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-500" />
              
              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card Content */}
              <div className="relative flex flex-col items-center justify-center gap-6 h-full text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                  <div className="relative py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 ring-1 ring-orange-500/10 transition-all duration-300 group-hover:from-orange-400 group-hover:to-amber-400 group-hover:scale-110 group-hover:-rotate-3">
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" style={{ animationDuration: '1.5s' }} />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    Update Services
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 group-hover:text-orange-500 transition-colors">Modernize existing</p>
                </div>

                {/* Description */}
                <div className={`pt-4 border-t border-orange-200 w-full transition-all duration-500 ${hoveredCard === "update" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                  <p className="text-sm sm:text-base text-gray-600 font-medium mb-8">
                    Update or migrate from an older service to a newer version with intelligent analysis
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="flex items-center justify-center gap-2 text-orange-600 text-sm font-semibold">
                    <span>Coming Soon</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-12 text-center animate-fade-in`} style={{ animationDelay: '1.1s' }}>
          <p className="text-sm text-gray-500">
            Need help choosing? <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Contact our team</span>
          </p>
        </div>
      </div>
    </div>
  )
}
