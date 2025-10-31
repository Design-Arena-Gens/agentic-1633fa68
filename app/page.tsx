"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, BarChart3, Clock, Settings } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PriceChart } from "@/components/price-chart";
import { SentimentChart } from "@/components/sentiment-chart";
import { InsightsPanel } from "@/components/insights-panel";
import { ProgressLoader } from "@/components/progress-loader";
import { AnalysisResult, Job } from "@/lib/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analyze");

  const { data: jobStatus } = useQuery({
    queryKey: ["job-status", jobId],
    queryFn: async (): Promise<Job> => {
      const res = await axios.get(`/api/status/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data as Job | undefined;
      return status && !["completed", "failed"].includes(status.status) ? 2000 : false;
    },
  });

  const { data: result, isLoading: resultLoading } = useQuery({
    queryKey: ["analysis-result", jobId],
    queryFn: async (): Promise<AnalysisResult> => {
      const res = await axios.get(`/api/results/${jobId}`);
      return res.data;
    },
    enabled: jobStatus?.status === "completed",
  });

  const handleAnalyze = async () => {
    if (!url) return;
    try {
      const res = await axios.post("/api/analyze", { url });
      setJobId(res.data.jobId);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const tabs = [
    { id: "analyze", label: "Analyze", icon: Search },
    { id: "history", label: "History", icon: Clock },
    { id: "compare", label: "Compare", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface shadow-lg p-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MeeshoLens
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 pb-20">
        {!jobId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-20 space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Real-Time Product Analytics</h2>
              <p className="text-gray-400">
                Paste any Meesho product link to get instant insights, live reviews, and price trends
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 shadow-lg">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.meesho.com/..."
                className="w-full bg-background text-text px-4 py-3 rounded-lg border border-gray-700 focus:border-accent focus:outline-none mb-4"
              />
              <button
                onClick={handleAnalyze}
                disabled={!url}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Product
              </button>
            </div>

            <div className="bg-surface rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">What you will get:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Live product data and current pricing</li>
                <li>✓ Real-time review sentiment analysis</li>
                <li>✓ Price trend tracking (1M / 6M / Lifetime)</li>
                <li>✓ AI-powered buyer behavior insights</li>
                <li>✓ Estimated revenue potential</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Disclaimer: Data is fetched from publicly available sources. Revenue estimates are approximate.
            </p>
          </motion.div>
        ) : jobStatus?.status !== "completed" ? (
          <ProgressLoader
            progress={jobStatus?.progress || 0}
            message={jobStatus?.message || "Initializing..."}
          />
        ) : result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <ProductCard product={result.product} />
            <PriceChart priceHistory={result.priceHistory} />
            <SentimentChart sentimentSummary={result.insights.sentimentSummary} />
            <InsightsPanel insights={result.insights} />

            <div className="bg-surface rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.reviews.slice(0, 10).map((review) => (
                  <div key={review.id} className="border-b border-gray-700 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-600"}>
                            ★
                          </span>
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Verified</span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          review.sentiment === "positive"
                            ? "bg-green-600/20 text-green-400"
                            : review.sentiment === "negative"
                            ? "bg-red-600/20 text-red-400"
                            : "bg-yellow-600/20 text-yellow-400"
                        }`}
                      >
                        {review.sentiment}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setJobId(null);
                setUrl("");
              }}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Analyze Another Product
            </button>
          </motion.div>
        ) : null}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 shadow-lg">
        <div className="container mx-auto flex justify-around py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                activeTab === tab.id ? "text-accent" : "text-gray-400"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
