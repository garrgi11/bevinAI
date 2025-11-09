"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete";
}

interface AnalysisLoaderProps {
  onComplete?: () => void;
}

export default function AnalysisLoader({ onComplete }: AnalysisLoaderProps) {
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: "details", label: "Analyzing project details", status: "pending" },
    { id: "market", label: "Generating market research analysis", status: "pending" },
    { id: "cost", label: "Generating cost analysis", status: "pending" },
    { id: "functionality", label: "Generating functionality analysis", status: "pending" },
  ]);

  useEffect(() => {
    const runAnalysis = async () => {
      // Step 1: Analyzing project details
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 0 ? { ...step, status: "loading" } : step))
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 0 ? { ...step, status: "complete" } : step))
      );

      // Step 2: Market research
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 1 ? { ...step, status: "loading" } : step))
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 1 ? { ...step, status: "complete" } : step))
      );

      // Step 3: Cost analysis
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 2 ? { ...step, status: "loading" } : step))
      );
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 2 ? { ...step, status: "complete" } : step))
      );

      // Step 4: Functionality analysis
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 3 ? { ...step, status: "loading" } : step))
      );
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setSteps((prev) =>
        prev.map((step, idx) => (idx === 3 ? { ...step, status: "complete" } : step))
      );

      // All complete
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (onComplete) onComplete();
    };

    runAnalysis();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">Analyzing Your Project</h2>
          <p className="mt-2 text-neutral-600">
            Our AI is working on your comprehensive analysis...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center justify-between rounded-lg border-2 p-4 transition-all duration-300 ${
                step.status === "complete"
                  ? "border-orange-200 bg-orange-50/50"
                  : step.status === "loading"
                    ? "border-orange-400 bg-orange-50"
                    : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    step.status === "complete"
                      ? "bg-orange-500 text-white"
                      : step.status === "loading"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-lg font-medium ${
                    step.status === "complete"
                      ? "text-neutral-900"
                      : step.status === "loading"
                        ? "text-orange-600"
                        : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Status Icon */}
              <div className="flex items-center">
                {step.status === "loading" && (
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                )}
                {step.status === "complete" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 animate-in zoom-in duration-300">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
                {step.status === "pending" && (
                  <div className="h-6 w-6 rounded-full border-2 border-neutral-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
              style={{
                width: `${(steps.filter((s) => s.status === "complete").length / steps.length) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-neutral-600">
            {steps.filter((s) => s.status === "complete").length} of {steps.length} steps completed
          </p>
        </div>
      </div>
    </div>
  );
}
