import React from 'react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string; // default Google blue
  subtitle?: string;
  showPercentSign?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 130,
  strokeWidth = 9,
  color = '#1a73e8',
  subtitle,
  showPercentSign = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e8eaed"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-medium text-[#202124] tracking-tight leading-none">
          {value}{showPercentSign && <span className="text-sm font-normal text-[#5f6368]">%</span>}
        </span>
        {subtitle && (
          <span className="text-[11px] font-medium text-[#5f6368] mt-1.5 uppercase tracking-wider">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
