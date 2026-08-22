import React from "react";

interface SolarPanelSVGProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const SolarPanelSVG: React.FC<SolarPanelSVGProps> = ({
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
      {/* Panel */}
      <polygon
        points="14,18 50,18 46,40 18,40"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />

      {/* Vertical Grid */}
      <line
        x1="26"
        y1="18"
        x2="24"
        y2="40"
        stroke={color}
        strokeWidth="2"
      />

      <line
        x1="38"
        y1="18"
        x2="36"
        y2="40"
        stroke={color}
        strokeWidth="2"
      />

      {/* Horizontal Grid */}
      <line
        x1="16"
        y1="26"
        x2="49"
        y2="26"
        stroke={color}
        strokeWidth="2"
      />

      <line
        x1="15"
        y1="33"
        x2="47"
        y2="33"
        stroke={color}
        strokeWidth="2"
      />

      {/* Stand */}
      <line
        x1="32"
        y1="40"
        x2="32"
        y2="52"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <line
        x1="22"
        y1="52"
        x2="42"
        y2="52"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SolarPanelSVG;