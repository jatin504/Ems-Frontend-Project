import React from "react";
import { Line } from "react-konva";
import { Stroke } from "./constants";

interface WireProps {
  points: number[];
  width?: number;
}

/* Vertical connection */
export default function Wire({
  points,
  width = 1.2,
}: WireProps) {
  return (
    <Line
      points={points}
      stroke={Stroke}
      strokeWidth={width}
      lineCap="square"
      lineJoin="miter"
    />
  );
}

