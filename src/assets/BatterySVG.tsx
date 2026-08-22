import React from "react";

interface BatterySVGProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const BatterySVG: React.FC<BatterySVGProps> = ({
  width = 36,
  height = 36,
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
      {/* Battery Cap */}
      <rect
        x="26"
        y="5"
        width="12"
        height="5"
        rx="1"
        stroke={color}
        strokeWidth="3"
      />

      {/* Battery Body */}
      <rect
        x="18"
        y="10"
        width="28"
        height="44"
        rx="2"
        stroke={color}
        strokeWidth="3"
      />

      {/* Lightning */}
      <path
        d="M35 21L28 34H33L30 44L39 30H34L35 21Z"
        fill={color}
      />
    </svg>
  );
};

export default BatterySVG;