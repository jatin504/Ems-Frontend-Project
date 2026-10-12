import { Circle } from "react-konva";
import { RED } from "../electrical/constants";
import type { Point } from "./types";

interface DotProps extends Point {
  r?: number;
}

export const Dot = ({ x, y, r = 3 }: DotProps) => (
  <Circle x={x} y={y} radius={r} fill={RED} />
);
