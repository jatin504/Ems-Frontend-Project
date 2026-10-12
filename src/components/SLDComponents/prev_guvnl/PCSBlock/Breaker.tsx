import React from "react";
import { Group, Line, Rect } from "react-konva";
import { Stroke } from "../electrical/constants";

interface BreakerProps {
  x: number;
  y: number;
}

/* Breaker / disconnect */
export default function Breaker({
  x,
  y,
}: BreakerProps) {
  return (
    <Group x={x} y={y}>
      <Line
        points={[0, 0, 0, 13]}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      {/* small breaker box */}
      <Rect
        x={-4}
        y={13}
        width={8}
        height={9}
        stroke={Stroke}
        strokeWidth={1}
      />

      <Line
        points={[0, 22, 0, 35]}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      {/* grounding / switch indication */}
      <Line
        points={[0, 13, 6, 7]}
        stroke={Stroke}
        strokeWidth={1}
      />
    </Group>
  );
}
