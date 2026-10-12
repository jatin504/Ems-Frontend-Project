import React from "react";
import { Line } from "react-konva";
import { Stroke } from "./constants";

interface WireProps {
  points: number[];
  width?: number;
  color? : string | null;
}

/* Vertical connection */
export default function Wire({
  points,
  width = 4.8,
  color=null,
}: WireProps) {
  return (
    <Line
      points={points}
      stroke={color ?? Stroke}
      strokeWidth={width}
      lineCap="square"
      lineJoin="miter"
    />
  );
}

