"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JiraLoader from "../components/JiraLoader";

export default function JiraPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || searchParams.get("projectid");

  const [jiraUrl, setJiraUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateJiraTickets = async () => {
      if (!projectId) {
        setError("No project ID provided");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/v1/jira/${projectId}`, {
          method: "POST",
        });

        const result = await response.json();

        if (result.success && result.data) {
          setJiraUrl(result.data.jiraUrl);
        } else {
          setError(result.message || "Failed to generate Jira tickets");
        }
      } catch (err) {
        console.error("Error generating Jira tickets:", err);
        setError("Error generating Jira tickets");
      }
    };

    generateJiraTickets();
  }, [projectId]);

  const handleComplete = () => {
    if (jiraUrl) {
      // Show completion screen with button to view Jira
      // The JiraLoader component handles this
    } else if (error) {
      alert(`Error: ${error}`);
      router.push("/");
    }
  };

  if (error && !jiraUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-400 hover:to-amber-400 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return <JiraLoader onComplete={handleComplete} jiraUrl={jiraUrl} />;
}
