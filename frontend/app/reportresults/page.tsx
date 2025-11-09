"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, DollarSign, TrendingUp, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface ReportData {
  functionality_report: string;
  cost_analysis_report: string;
  market_analysis_report: string;
  project_name?: string;
}

export default function ReportResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState<"functionality" | "cost" | "market">("functionality");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!projectId) {
        alert("No project ID provided");
        router.push("/requirements");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        console.log("Fetching reports for project:", projectId);
        const response = await fetch(`${apiUrl}/api/v1/reports/${projectId}`);
        const result = await response.json();
        
        console.log("Reports API response:", result);

        if (result.success && result.data) {
          console.log("Report data received:", result.data);
          setReportData(result.data);
          setIsVisible(true);
        } else {
          console.error("Failed to load reports:", result);
          alert(`Failed to load reports: ${result.error || "Unknown error"}`);
          router.push("/requirements");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        alert("Error loading reports. Please check the console for details.");
        router.push("/requirements");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [projectId, router]);

  const handleSatisfied = async () => {
    if (!projectId) return;
    
    // Redirect to tech stack decision page
    router.push(`/techstack?projectId=${projectId}`);
  };

  const handleNotSatisfied = () => {
    router.push("/prmmode");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  const reports = [
    {
      id: "functionality",
      title: "Functionality Report",
      icon: FileText,
      content: reportData.functionality_report || "Report not available",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      id: "cost",
      title: "Cost Analysis Report",
      icon: DollarSign,
      content: reportData.cost_analysis_report || "Report not available",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      id: "market",
      title: "Market Analysis Report",
      icon: TrendingUp,
      content: reportData.market_analysis_report || "Report not available",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
  ];

  const activeReportData = reports.find((r) => r.id === activeReport);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s", animationDuration: "4s" }} />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
          <button
            onClick={() => router.push("/requirements")}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requirements
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Analysis <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Complete</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Here are your comprehensive reports. Review each section carefully.
          </p>
        </div>

        {/* Report Cards - Horizontal Display */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "0.2s" }}>
          {reports.map((report, index) => {
            const Icon = report.icon;
            const isActive = activeReport === report.id;
            
            return (
              <div
                key={report.id}
                onClick={() => setActiveReport(report.id as any)}
                className={`group cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${0.4 + index * 0.2}s` }}
              >
                <div className={`relative h-full bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-500 ${
                  isActive 
                    ? "border-orange-500 shadow-2xl shadow-orange-500/20 scale-105" 
                    : "border-orange-200 hover:border-orange-400 hover:shadow-xl"
                }`}>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${report.bgColor} opacity-0 transition-opacity duration-500 ${isActive ? "opacity-30" : "group-hover:opacity-20"}`} />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${report.color} mb-4 shadow-lg transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {report.content ? report.content.substring(0, 150) + "..." : "Loading report..."}
                    </p>
                    
                    <div className={`mt-4 flex items-center gap-2 text-orange-600 text-sm font-semibold transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <span>{isActive ? "Reading" : "Click to read"}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Report Display */}
        {activeReportData && (
          <div className={`animate-fade-in bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-orange-200 p-6 md:p-8 shadow-xl mb-8`} style={{ animationDelay: "0.8s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${activeReportData.color} shadow-lg`}>
                <activeReportData.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{activeReportData.title}</h2>
            </div>
            
            <div className="prose prose-orange max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {activeReportData.content}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in`} style={{ animationDelay: "1s" }}>
          <button
            onClick={handleNotSatisfied}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-orange-200 bg-white hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <XCircle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-900">Not Satisfied</span>
          </button>
          
          <button
            onClick={handleSatisfied}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Satisfied</span>
          </button>
        </div>

        {/* Info Box */}
        <div className={`mt-8 max-w-2xl mx-auto rounded-lg bg-orange-50/50 border border-orange-200 p-4 md:p-6 animate-fade-in`} style={{ animationDelay: "1.2s" }}>
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold text-orange-600">💡 Tip:</span> These reports are saved to your account. You can download or share them with your team anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
