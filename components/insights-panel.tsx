"use client";

import { AnalysisResult } from "@/lib/types";
import { TrendingUp, Users, DollarSign, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function InsightsPanel({ insights }: { insights: AnalysisResult["insights"] }) {
  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <p className="text-gray-300 mb-4">{insights.overallSummary}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-gray-400">Sales Behavior</p>
              <p className="font-semibold">{insights.salesBehavior}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-gray-400">Buyer Style</p>
              <p className="font-semibold">{insights.buyerStyle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-gray-400">Est. Monthly Revenue</p>
              <p className="font-semibold">{formatCurrency(insights.estimatedMonthlyRevenue)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-gray-400">Top Topic</p>
              <p className="font-semibold">{insights.topTopics[0]?.topic || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Top Topics</h3>
        <div className="space-y-2">
          {insights.topTopics.map((topic) => {
            const percentage = Math.min(topic.count * 20, 100);
            return (
              <div key={topic.topic} className="flex justify-between items-center">
                <span className="text-gray-300">{topic.topic}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{topic.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
