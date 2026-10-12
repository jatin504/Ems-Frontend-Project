import React from "react";
import { Group, Circle, Line } from "react-konva";
import StarSymbol from "./StarSymbol";

interface TransformerProps {
  x: number;
  y: number;
  scale?: number;

  outlineColor?: string;
  fillColor?: string;
}

/* Transformer */
export default function Transformer({
  x,
  y,
  scale = 1,

  // Modern transformer palette
  outlineColor = "#90B800",
  fillColor = "#D9EFBD",
}: TransformerProps) {
  const outerRadius = 47;

  const outlineWidth = 1.6;
  const windingWidth = 1.3;

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >
      {/* ==========================================
          Main transformer body
         ========================================== */}
      <Circle
        x={0}
        y={0}
        radius={outerRadius}
        fill={fillColor}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
      />

      {/* ==========================================
          HV winding circles
         ========================================== */}
      <Circle
        x={-42}
        y={35}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      <Circle
        x={42}
        y={35}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      {/* ==========================================
          LV winding circles
         ========================================== */}
      <Circle
        x={-14}
        y={40}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      <Circle
        x={14}
        y={40}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      {/* ==========================================
          HV Delta
         ========================================== */}
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
        closed
        fill={outlineColor}
        stroke={outlineColor}
        strokeWidth={1.2}
        lineJoin="round"
      />

      {/* ==========================================
          Y / Star symbols
         ========================================== */}
      <StarSymbol
        x={-42}
        y={35}
        color={outlineColor}
      />

      <StarSymbol
        x={42}
        y={35}
        color={outlineColor}
      />

      <StarSymbol
        x={-14}
        y={40}
        color={outlineColor}
      />

      <StarSymbol
        x={14}
        y={40}
        color={outlineColor}
      />
    </Group>
  );
}
