import React from "react";
import { Group, Line } from "react-konva";
import { Stroke } from "./constants";

interface StarSymbolProps {
  x: number;
  y: number;
  color: string;
}

export default function StarSymbol({
  x,
  y,
  color
}: StarSymbolProps) {
  return (
    <Group x={x} y={y}>
      <Line
        points={[0, 0, 0, 13]}
        stroke={color}
        strokeWidth={1}
      />

      <Line
        points={[0, 0, -10, -7]}
        stroke={color}
        strokeWidth={1}
      />

      <Line
        points={[0, 0, 10, -7]}
        stroke={color}
        strokeWidth={1}
      />
    </Group>
  );
}
