"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AnalysisLoader from "../components/AnalysisLoader"

interface Company {
  company_id: number
  name: string
  company_resources: string | null
}

export default function RequirementsPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showLoader, setShowLoader] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    companyId: "",
    companyResources: "",
    projectName: "",
    projectDescription: "",
    businessObjectives: "",
    targetAudience: "",
    budgetRange: "Flexible",
    timeline: "Flexible",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFormValid = formData.companyId && formData.projectName.trim() && formData.projectDescription.trim()

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await fetch(`${apiUrl}/api/v1/companies`)
        const result = await response.json()
        if (result.success) {
          setCompanies(result.data)
        }
      } catch (error) {
        console.error("Error fetching companies:", error)
      }
    }
    fetchCompanies()
  }, [])

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value
    const company = companies.find(c => c.company_id.toString() === companyId)
    
    setSelectedCompany(company || null)
    setFormData((prev) => ({
      ...prev,
      companyId,
      companyResources: company?.company_resources || ""
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    setShowLoader(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/v1/requirements/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log("✅ Requirements saved:", result.data)
        setAnalysisResult(result.data)
        // Loader will complete and show success
      } else {
        setShowLoader(false)
        alert(`Failed to submit requirements: ${result.message || result.error}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setShowLoader(false)
      alert("An error occurred. Please make sure the backend server is running on http://localhost:5000")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnalysisComplete = () => {
    // Show success message
    alert(
      `✅ Analysis Complete!\n\n` +
      `Project ID: ${analysisResult?.projectId}\n` +
      `Company ID: ${analysisResult?.companyId}\n\n` +
      `All reports have been generated and saved.`
    )
    
    // Optionally redirect to results page
    // router.push(`/results/${analysisResult?.projectId}`)
    
    // Or reset form
    setShowLoader(false)
    setSelectedCompany(null)
    setFormData({
      companyId: "",
      companyResources: "",
      projectName: "",
      projectDescription: "",
      businessObjectives: "",
      targetAudience: "",
      budgetRange: "Flexible",
      timeline: "Flexible",
    })
  }

  return (
    <>
      {showLoader && <AnalysisLoader onComplete={handleAnalysisComplete} />}
      
      <div className="min-h-screen bg-white">
        {/* Navigation */}

        {/* Main Content */}
        <main className="container px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
              Tell Us About Your New Service
            </h1>
            <p className="mt-3 text-base text-neutral-600 md:text-lg">
              Share your project details and we'll provide comprehensive analysis on market fit, technology stack, and
              cost estimates.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 0: Company Selection */}
            <section className="space-y-6 rounded-lg border border-orange-200 bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-neutral-900">Company Information</h2>

              <div>
                <label htmlFor="companyId" className="block text-sm font-medium text-neutral-700">
                  Select Company <span className="text-orange-500">*</span>
                </label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleCompanyChange}
                  className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                >
                  <option value="">-- Select a company --</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="companyResources" className="block text-sm font-medium text-neutral-700">
                  Company Resources
                </label>
                <p className="mt-1 text-xs text-neutral-500">
                  Describe your company's available resources, team size, budget, infrastructure, etc.
                </p>
                <textarea
                  id="companyResources"
                  name="companyResources"
                  value={formData.companyResources}
                  onChange={handleChange}
                  placeholder="e.g., 'Software development team (10 engineers), Cloud infrastructure (AWS), $500K annual tech budget'"
                  rows={4}
                  className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                />
                {selectedCompany?.company_resources && (
                  <p className="mt-2 text-xs text-orange-600">
                    💡 Pre-filled from previous entry. You can edit if needed.
                  </p>
                )}
              </div>
            </section>

            {/* Section 1: Main Project Details */}
            <section className="space-y-6 rounded-lg border border-orange-200 bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-neutral-900">Project Details</h2>

              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-neutral-700">
                  Project Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g., 'E-commerce Payment Service' or 'Acme Corp Marketing Site'"
                  className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-neutral-700">
                  Project Description <span className="text-orange-500">*</span>
                </label>
                <p className="mt-1 text-xs text-neutral-500">
                  This is the most important field. Be as detailed as possible.
                </p>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  placeholder="Describe the service you want to build. What are the main features? What problem does it solve? Be as detailed as possible."
                  rows={8}
                  className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
            </section>

            {/* Section 2: Key Objectives */}
            <section className="space-y-6 rounded-lg border border-orange-200 bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-neutral-900">Key Objectives</h2>

              <div>
                <label htmlFor="businessObjectives" className="block text-sm font-medium text-neutral-700">
                  Business Objectives
                </label>
                <p className="mt-1 text-xs text-neutral-500">
                  What are the goals? e.g., 'Increase user signups by 20%', 'Reduce checkout friction'.
                </p>
                <textarea
                  id="businessObjectives"
                  name="businessObjectives"
                  value={formData.businessObjectives}
                  onChange={handleChange}
                  placeholder="List your business goals, one per line if possible..."
                  rows={4}
                  className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-neutral-700">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="e.g., 'B2C customers', 'Internal employees', 'B2B enterprise clients'"
                  className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </section>

            {/* Section 3: Constraints */}
            <section className="space-y-6 rounded-lg border border-orange-200 bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-neutral-900">Constraints</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="budgetRange" className="block text-sm font-medium text-neutral-700">
                    Estimated Budget Range
                  </label>
                  <select
                    id="budgetRange"
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  >
                    <option>Flexible</option>
                    <option>{"<$25,000"}</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-neutral-700">
                    Expected Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-orange-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  >
                    <option>Flexible</option>
                    <option>Under 1 Month</option>
                    <option>1-3 Months</option>
                    <option>3-6 Months</option>
                    <option>6+ Months</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedCompany(null)
                  setFormData({
                    companyId: "",
                    companyResources: "",
                    projectName: "",
                    projectDescription: "",
                    businessObjectives: "",
                    targetAudience: "",
                    budgetRange: "Flexible",
                    timeline: "Flexible",
                  })
                }}
                className="rounded-md border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-orange-50"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-400 hover:to-amber-400"
              >
                {isSubmitting ? "Analyzing..." : "Analyze Requirements"} →
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 rounded-lg bg-orange-50/50 border border-orange-200 p-4 md:p-6">
            <p className="text-sm text-neutral-700">
              <span className="font-semibold text-orange-600">💡 Tip:</span> The more detail you provide in the Project
              Description, the better our AI analysis will be. Include information about your target market, competitive
              landscape, and any specific technology preferences.
            </p>
          </div>
        </div>
      </main>
      </div>
    </>
  )
}
