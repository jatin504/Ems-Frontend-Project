import React from "react";
import { Line } from "react-konva";
import { Stroke } from "../electrical/constants";

interface BusbarProps {
  x: number;
  y: number;
  width: number;
}

/* Horizontal busbar */
export default function Busbar({
  x,
  y,
  width,
}: BusbarProps) {
  return (
    <Line
      points={[x, y, x + width, y]}
      stroke={Stroke}
      strokeWidth={2}
    />
  );
}
