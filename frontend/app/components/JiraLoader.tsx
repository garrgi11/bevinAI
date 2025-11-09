"use client"

import { useState, useEffect } from "react"

interface JiraLoaderProps {
  onComplete: () => void
  jiraUrl?: string
}

const steps = [
  { id: 1, label: "NVIDIA NIM API (Nemotron 70B)", icon: "🤖", color: "from-green-500 to-emerald-500" },
  { id: 2, label: "JIRA Cloud API v3", icon: "📋", color: "from-blue-500 to-cyan-500" },
  { id: 3, label: "Slack Bolt SDK", icon: "💬", color: "from-purple-500 to-pink-500" },
  { id: 4, label: "GitHub REST API v3", icon: "🔧", color: "from-orange-500 to-amber-500" },
  { id: 5, label: "PostgreSQL Database", icon: "🗄️", color: "from-indigo-500 to-violet-500" },
  { id: 6, label: "Redis Cache", icon: "⚡", color: "from-red-500 to-rose-500" },
]

const bots = [
  "Orchestration Bot",
  "JIRA Automation Bot",
  "Code Generation Bot",
  "Validation Bot",
  "Reporting Bot"
]

export default function JiraLoader({ onComplete, jiraUrl }: JiraLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    // Progress through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        clearInterval(stepInterval)
        return prev
      })
    }, 2000) // 2 seconds per step

    // Smooth progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setShowComplete(true)
            setTimeout(() => {
              onComplete()
            }, 2000)
          }, 500)
          return 100
        }
        return prev + 1
      })
    }, 120) // Complete in ~12 seconds

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  if (showComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="text-center animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Jira Tickets Created!</h2>
          <p className="text-gray-600 mb-6">All epics and stories have been generated</p>
          {jiraUrl && (
            <a
              href={jiraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span>View in Jira</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="w-full max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            MCP Server Initialization & Integration
          </h1>
          <p className="text-lg text-gray-600">
            Generating Jira tickets with AI-powered automation
          </p>
        </div>

        {/* Connected Services */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-200 p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Connected Services:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-500 ${
                  index <= currentStep
                    ? "border-green-500 bg-green-50 scale-105"
                    : "border-gray-200 bg-gray-50"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`text-3xl ${index <= currentStep ? "animate-bounce" : "opacity-50"}`}>
                  {index <= currentStep ? "✓" : step.icon}
                </div>
                <span className={`font-semibold ${index <= currentStep ? "text-green-700" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* NVIDIA Nemotron Bots Active */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-200 p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">NVIDIA Nemotron Bots Active:</h2>
          <div className="space-y-3">
            {bots.map((bot, index) => (
              <div
                key={bot}
                className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 transition-all duration-500 ${
                  index <= currentStep ? "opacity-100 translate-x-0" : "opacity-50 -translate-x-4"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-gray-700">{bot}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-200 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-orange-600">{progress}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Creating epics and stories in Jira...
          </p>
        </div>
      </div>
    </div>
  )
}
