import React from "react";
import {
  Group,
  Line,
  Rect,
  Text,
} from "react-konva";

import { Stroke } from "./constants";

interface PCSProps {
  x: number;
  y: number;

  size?: number;
  scale?: number;

  label?: string;
  outlineColor?: string;
  rightFillColor?: string;
}

export default function PCS({
  x,
  y,
  size = 64,
  scale = 1,

  label = "5 MW",

  // Modern light blue outline
  outlineColor = "#60A5FA",

  // Very light blue fill
  rightFillColor = "#AAF6EE",
}: PCSProps) {
  const radius = size * 0.10;
  const strokeWidth = Math.max(1.5, size * 0.035);

  const center = size / 2;

  const symbolSize = size * 0.32;
  const labelSize = Math.max(7, size * 0.13);

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >
      {/* ==========================================
          AC connection - top
         ========================================== */}
      <Line
        points={[
          center,
          -size * 0.40,
          center,
          0,
        ]}
        stroke={Stroke}
        strokeWidth={Math.max(1, size * 0.018)}
      />

      {/* ==========================================
          Right-side light fill

          Polygon:
          top-right
          bottom-right
          bottom-left
         ========================================== */}
      <Line
        points={[
          size,
          0,
          size,
          size,
          0,
          size,
        ]}
        closed
        fill={rightFillColor}
        strokeEnabled={false}
      />

      {/* ==========================================
          PCS outer body
         ========================================== */}
      <Rect
        x={0}
        y={0}
        width={size}
        height={size}
        cornerRadius={radius}
        fill="white"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* ==========================================
          Right region fill

          Drawn inside the border
         ========================================== */}
      <Line
        points={[
          size - strokeWidth,
          strokeWidth,
          size - strokeWidth,
          size - strokeWidth,
          strokeWidth,
          size - strokeWidth,
        ]}
        closed
        fill={rightFillColor}
        strokeEnabled={false}
      />

      {/* ==========================================
          Diagonal
          TOP-RIGHT → BOTTOM-LEFT
         ========================================== */}
      <Line
        points={[
          size,
          0,
          0,
          size,
        ]}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />

      {/* ==========================================
          AC "~"
          Left / upper region
         ========================================== */}
      <Text
        x={size * 0.10}
        y={size * 0.16}
        width={size * 0.38}
        text="~"
        fontSize={symbolSize}
        fontFamily="Arial"
        fontStyle="bold"
        align="center"
        fill={outlineColor}
      />

      {/* ==========================================
          DC "+"
          Right / lower region
         ========================================== */}
      <Text
        x={size * 0.55}
        y={size * 0.50}
        width={size * 0.30}
        text="+"
        fontSize={symbolSize * 0.85}
        fontFamily="Arial"
        fontStyle="bold"
        align="center"
        fill={outlineColor}
      />

      {/* ==========================================
          PCS label
         ========================================== */}
      {/* <Text
        x={0}
        y={size + size * 0.12}
        width={size}
        text={label}
        fontSize={labelSize}
        fontFamily="Arial"
        fontStyle="bold"
        align="center"
        fill={Stroke}
      /> */}

      {/* ==========================================
          DC connection - bottom
         ========================================== */}
      <Line
        points={[
          center,
          size,
          center,
          size + size * 0.40,
        ]}
        stroke={Stroke}
        strokeWidth={Math.max(1, size * 0.018)}
      />
    </Group>
  );
}
