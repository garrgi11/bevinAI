"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cpu, Server, Database, Cloud, Wrench, Sparkles, CheckCircle2, TrendingUp, ArrowLeft } from "lucide-react";

interface TechStackOption {
  id: string;
  label: string;
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  devops_tooling: string[];
  ai_llm_components: string[];
  pros: string[];
  cons: string[];
  estimated_monthly_cost_usd: number;
  scores: {
    performance: number;
    scalability: number;
    cost: number;
    maintainability: number;
    team_expertise: number;
    community_support: number;
    learning_curve: number;
  };
  weighted_score: number;
}

interface TechStackDecision {
  company_id: number;
  project_id: number;
  report_type: string;
  decision_framework: {
    criteria_weights: Record<string, number>;
  };
  tech_tags: string[];
  options: TechStackOption[];
  recommended_option: {
    option_id: string;
    reason: string;
    confidence_percent: number;
  };
  summary: string;
  jira_ready_actions: string[];
}

export default function TechStackDecision() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [decision, setDecision] = useState<TechStackDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchOrGenerateDecision = async () => {
      if (!projectId) {
        alert("No project ID provided");
        router.push("/requirements");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // Try to fetch existing decision
        let response = await fetch(`${apiUrl}/api/v1/techstack/${projectId}`);
        
        if (!response.ok) {
          // Generate new decision
          setGenerating(true);
          console.log("Generating tech stack decision...");
          response = await fetch(`${apiUrl}/api/v1/techstack/${projectId}`, {
            method: "POST",
          });
        }

        const result = await response.json();

        if (result.success && result.data) {
          setDecision(result.data);
          setSelectedOption(result.data.recommended_option.option_id);
          setIsVisible(true);
        } else {
          alert("Failed to load tech stack decision");
          router.push(`/reportresults?projectId=${projectId}`);
        }
      } catch (error) {
        console.error("Error fetching tech stack decision:", error);
        alert("Error loading tech stack decision");
        router.push(`/reportresults?projectId=${projectId}`);
      } finally {
        setLoading(false);
        setGenerating(false);
      }
    };

    fetchOrGenerateDecision();
  }, [projectId, router]);

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-semibold">
            {generating ? "Analyzing tech stack options..." : "Loading..."}
          </p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!decision) {
    return null;
  }

  const selectedOptionData = decision.options.find((opt) => opt.id === selectedOption);
  const recommendedOption = decision.options.find((opt) => opt.id === decision.recommended_option.option_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s", animationDuration: "4s" }} />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
          <button
            onClick={() => router.push(`/reportresults?projectId=${projectId}`)}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tech Stack <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Recommendations</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            AI-powered multi-criteria analysis of technology options for your project
          </p>
          
          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {decision.tech_tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className={`max-w-4xl mx-auto mb-8 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200 p-6 shadow-xl animate-fade-in`} style={{ animationDelay: "0.4s" }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">AI Recommendation</h2>
              <p className="text-gray-700 mb-3">{decision.summary}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-blue-600">Recommended:</span>
                <span className="font-bold text-gray-900">{recommendedOption?.label}</span>
                <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                  {decision.recommended_option.confidence_percent}% Confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "0.6s" }}>
          {decision.options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const isRecommended = decision.recommended_option.option_id === option.id;
            
            return (
              <div
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`group cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${0.8 + index * 0.2}s` }}
              >
                <div className={`relative h-full bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-500 ${
                  isSelected 
                    ? "border-blue-500 shadow-2xl shadow-blue-500/20 scale-105" 
                    : "border-blue-200 hover:border-blue-400 hover:shadow-xl"
                }`}>
                  {/* Recommended Badge */}
                  {isRecommended && (
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      RECOMMENDED
                    </div>
                  )}
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 transition-opacity duration-500 ${isSelected ? "opacity-30" : "group-hover:opacity-20"}`} />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{option.label}</h3>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {option.weighted_score.toFixed(1)}/10
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          Frontend
                        </div>
                        <div className="text-gray-600 text-xs">{option.frontend.join(", ")}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                          <Server className="w-4 h-4 text-purple-600" />
                          Backend
                        </div>
                        <div className="text-gray-600 text-xs">{option.backend.join(", ")}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                          <Database className="w-4 h-4 text-green-600" />
                          Database
                        </div>
                        <div className="text-gray-600 text-xs">{option.database.join(", ")}</div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Est. Monthly Cost</span>
                          <span className="font-bold text-gray-900">${option.estimated_monthly_cost_usd}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`mt-4 flex items-center gap-2 text-blue-600 text-sm font-semibold transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <span>{isSelected ? "Selected" : "Click to view details"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed View */}
        {selectedOptionData && (
          <div className={`max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200 p-6 md:p-8 shadow-xl mb-8 animate-fade-in`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedOptionData.label} - Detailed Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Tech Stack Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" />
                  Technology Stack
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Infrastructure</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedOptionData.infrastructure.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">DevOps Tooling</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedOptionData.devops_tooling.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedOptionData.ai_llm_components.length > 0 && selectedOptionData.ai_llm_components[0] && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">AI/LLM Components</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOptionData.ai_llm_components.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Scores */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Performance Scores
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(selectedOptionData.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-bold text-gray-900">{value}/10</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-green-700 mb-2">✓ Pros</h4>
                <ul className="space-y-1">
                  {selectedOptionData.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-red-700 mb-2">✗ Cons</h4>
                <ul className="space-y-1">
                  {selectedOptionData.cons.map((con, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Jira Ready Actions */}
        <div className={`max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6 mb-8 animate-fade-in`}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Next Steps (Jira Ready)</h3>
          <ul className="space-y-2">
            {decision.jira_ready_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push(`/jira?projectId=${projectId}`)}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-400 hover:to-purple-400 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Generate Jira Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
}
