"use client";

import { getScoreColor } from "@/lib/utils";

export default function LeadScoreGauge({ score, size = 48 }) {
  const color = getScoreColor(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(100,116,139,0.15)"
          strokeWidth={4}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: `drop-shadow(0 0 4px ${color}66)`,
          }}
        />
      </svg>
      <span
        className="absolute font-bold text-[13px]"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
