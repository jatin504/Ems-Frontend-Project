import React from "react";

interface AuxLoadSVGProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const AuxLoadSVG: React.FC<AuxLoadSVGProps> = ({
  width = 38,
  height = 38,
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
      {/* Plug Head */}
      <rect
        x="22"
        y="16"
        width="20"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="3"
      />

      {/* Pins */}
      <line
        x1="27"
        y1="8"
        x2="27"
        y2="16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <line
        x1="37"
        y1="8"
        x2="37"
        y2="16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Cable */}
      <line
        x1="32"
        y1="34"
        x2="32"
        y2="48"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M32 48C32 54 28 57 22 57"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AuxLoadSVG;