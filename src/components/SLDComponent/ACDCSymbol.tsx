import React from "react";
import { Group, Line, Rect } from "react-konva";

const ACDCSymbol: React.FC<{ textColor?: string }> = ({ textColor = "white" }) => {
  const fixedX = 211;
  const fixedY = 161;

  return (
    <Group x={fixedX} y={fixedY}>
      {/* Outer square */}
      <Rect width={40} height={40} stroke={textColor} strokeWidth={2} />

      {/* Diagonal line */}
      <Line points={[0, 40, 40, 0]} stroke={textColor} strokeWidth={2} />

      {/* AC tilde ~ */}
      <Line
        points={[8, 10, 10, 8, 12, 10, 14, 8]}
        stroke={textColor}
        strokeWidth={1.6}
        tension={0.5}
        bezier
      />

      {/* DC equal sign = */}
      <Line points={[26, 28, 34, 28]} stroke={textColor} strokeWidth={2} />
      <Line points={[26, 32, 34, 32]} stroke={textColor} strokeWidth={2} />
    </Group>
  );
};

export default ACDCSymbol;
