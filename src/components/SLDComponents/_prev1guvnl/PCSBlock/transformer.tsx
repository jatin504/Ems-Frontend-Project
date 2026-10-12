import React from "react";
import { Group, Circle, Line } from "react-konva";
import StarSymbol from "./StarSymbol";
import { Stroke } from "../electrical/constants";

interface TransformerProps {
  x: number;
  y: number;
  scale?: number;
}

/* Transformer */
export default function Transformer({
  x,
  y,
  scale = 1,
}: TransformerProps) {
  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >
      {/* Transformer windings */}
      <Circle
        x={0}
        y={0}
        radius={47}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      <Circle
        x={-42}
        y={35}
        radius={18}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      <Circle
        x={42}
        y={35}
        radius={18}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      {/* LV windings / inner circles */}
      <Circle
        x={-14}
        y={40}
        radius={18}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      <Circle
        x={14}
        y={40}
        radius={18}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      {/* HV delta */}
      <Line
        points={[
          -17,
          -4,
          0,
          -28,
          18,
          -4,
          -17,
          -4,
        ]}
        stroke={Stroke}
        strokeWidth={1.2}
        closed
      />

      {/* Y symbols */}
      <StarSymbol x={-42} y={35} />
      <StarSymbol x={42} y={35} />
      <StarSymbol x={-14} y={40} />
      <StarSymbol x={14} y={40} />
    </Group>
  );
}
