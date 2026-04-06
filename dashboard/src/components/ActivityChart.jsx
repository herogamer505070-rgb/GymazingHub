"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-card-static p-3 text-[13px]"
      style={{ minWidth: 140 }}
    >
      <p className="font-semibold text-[#f1f5f9] mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-[#94a3b8]">{entry.name}:</span>
          <span className="text-[#f1f5f9] font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ActivityChart({ data }) {
  return (
    <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <h3 className="text-[16px] font-bold text-[#f1f5f9] mb-1">
        نشاط آخر 7 أيام
      </h3>
      <p className="text-[13px] text-[#64748b] mb-6">الردود والعملاء المحتملين</p>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(99,102,241,0.08)"
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "rgba(99,102,241,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 13, color: "#94a3b8" }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="replies"
              name="الردود"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={{ fill: "#818cf8", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#818cf8", stroke: "#0a0e1a", strokeWidth: 3 }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              name="العملاء المحتملين"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ fill: "#34d399", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#34d399", stroke: "#0a0e1a", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
