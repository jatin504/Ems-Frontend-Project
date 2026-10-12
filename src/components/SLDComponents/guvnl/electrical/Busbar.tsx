import React from "react";
import { Line } from "react-konva";
import { Stroke } from "./constants";

interface BusbarProps {
  x: number;
  y: number;
  width: number;
  color? : string | null;
}

/* Horizontal busbar */
export default function Busbar({
  x,
  y,
  width,
  color=null,
}: BusbarProps) {
  return (
    <Line
      points={[x, y, x + width, y]}
      stroke={color ?? Stroke}
      strokeWidth={4}
    />
  );
}
