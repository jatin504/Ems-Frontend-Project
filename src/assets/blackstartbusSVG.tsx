import React from "react";

interface BlackStartBusSVGProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const BlackStartBusSVG: React.FC<BlackStartBusSVGProps> = ({
  width = 40,
  height = 40,
  color = "#1F2937",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Bus */}
      <line
        x1="12"
        y1="16"
        x2="52"
        y2="16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Left Support */}
      <line
        x1="18"
        y1="16"
        x2="18"
        y2="23"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Center Support */}
      <line
        x1="32"
        y1="16"
        x2="32"
        y2="23"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Right Support */}
      <line
        x1="46"
        y1="16"
        x2="46"
        y2="23"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Lower Bus */}
      <line
        x1="14"
        y1="23"
        x2="50"
        y2="23"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Main Drop */}
      <line
        x1="32"
        y1="23"
        x2="32"
        y2="43"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Breaker Body */}
      <rect
        x="27"
        y="43"
        width="10"
        height="13"
        rx="2"
        stroke={color}
        strokeWidth="3"
      />

      {/* Breaker Handle */}
      <line
        x1="32"
        y1="36"
        x2="37"
        y2="42"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BlackStartBusSVG;