import React from "react";
import { Group, Line, Ellipse, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface CableProps {
  x: number;
  y: number;
  height?: number;
}

export default function Cable({
  x,
  y,
  height = 70,
}: CableProps) {
  return (
    <Group>
      {/* Cable conductor */}
      <Line
        points={[x, y, x, y + height]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* Cable termination / oval */}
      <Ellipse
        x={x}
        y={y}
        radiusX={38}
        radiusY={7}
        stroke={RED}
        strokeWidth={2}
      />

      {/* Cable text */}
      <Text
        x={x - 290}
        y={y - 18}
        text="1R/PH,66KV,1CX 630SQ. MM"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 290}
        y={y + 2}
        text="AL. XLPE ARMOURED U/G CABLE"
        fontSize={15}
        fill={BLUE}
      />
    </Group>
  );
}
