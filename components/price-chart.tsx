"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PriceHistory, TimeRange } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PriceChart({ priceHistory }: { priceHistory: PriceHistory[] }) {
  const [range, setRange] = useState<TimeRange>("1m");

  const data = priceHistory.map((ph) => ({
    date: formatDate(ph.timestamp),
    price: ph.price,
  }));

  return (
    <div className="bg-surface rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Price Trends</h3>
        <div className="flex gap-2">
          {(["1m", "6m", "life"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-sm ${
                range === r ? "bg-primary text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {r === "1m" ? "1M" : r === "6m" ? "6M" : "Lifetime"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#e6eef6" />
          <YAxis stroke="#e6eef6" tickFormatter={(val) => `₹${val}`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a2333", border: "none", borderRadius: "8px" }}
            formatter={(val: any) => [formatCurrency(val), "Price"]}
          />
          <Line type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
