import React from "react";
import { Group, Line } from "react-konva";
import { Stroke } from "./constants";

interface StarSymbolProps {
  x: number;
  y: number;
}

export default function StarSymbol({
  x,
  y,
}: StarSymbolProps) {
  return (
    <Group x={x} y={y}>
      <Line
        points={[0, 0, 0, 13]}
        stroke={Stroke}
        strokeWidth={1}
      />

      <Line
        points={[0, 0, -10, -7]}
        stroke={Stroke}
        strokeWidth={1}
      />

      <Line
        points={[0, 0, 10, -7]}
        stroke={Stroke}
        strokeWidth={1}
      />
    </Group>
  );
}
