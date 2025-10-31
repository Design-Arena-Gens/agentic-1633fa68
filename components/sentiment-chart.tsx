"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SentimentChartProps {
  sentimentSummary: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const COLORS = {
  positive: "#22c55e",
  neutral: "#facc15",
  negative: "#ef4444",
};

export function SentimentChart({ sentimentSummary }: SentimentChartProps) {
  const data = [
    { name: "Positive", value: sentimentSummary.positive },
    { name: "Neutral", value: sentimentSummary.neutral },
    { name: "Negative", value: sentimentSummary.negative },
  ];

  return (
    <div className="bg-surface rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1a2333", border: "none", borderRadius: "8px" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
