import React from "react";
import { Circle } from "react-konva";
import type { Point } from "./types";
import { RED } from "../electrical/constants";

const ConnectionPoint: React.FC<Point> = ({ x, y }) => (
  <Circle
    x={x}
    y={y}
    radius={4}
    fill={RED}
  />
);

export default ConnectionPoint;
