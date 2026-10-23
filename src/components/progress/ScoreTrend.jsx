import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ScoreTrend({ attempts }) {
  const data = [...attempts]
    .reverse()
    .map((attempt, index) => ({
      label: `Set ${index + 1}`,
      score: Math.round(Number(attempt.score_percent) || 0),
    }));

  if (data.length < 2) {
    return (
      <p className="py-10 text-sm text-muted-foreground">
        Two attempts are enough to draw your trend line. Keep going.
      </p>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b4572f" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#b4572f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d5" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e7e1d5",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#b4572f"
            strokeWidth={2}
            fill="url(#scoreFill)"
            dot={{ r: 3, fill: "#b4572f", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
