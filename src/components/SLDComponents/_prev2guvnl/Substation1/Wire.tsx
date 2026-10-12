import { Line } from "react-konva";
import { RED } from "../electrical/constants";
import type { LineProps } from "./types";

export const Wire = ({
  points,
  stroke = RED,
  strokeWidth = 2.5,
  dash,
}: LineProps) => (
  <Line
    points={points}
    stroke={stroke}
    strokeWidth={strokeWidth}
    dash={dash}
    lineCap="square"
    lineJoin="miter"
  />
);
