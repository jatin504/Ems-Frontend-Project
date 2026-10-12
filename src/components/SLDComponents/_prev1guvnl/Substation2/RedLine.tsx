import React from "react";
import { Line } from "react-konva";
import { RED } from "../electrical/constants";

interface RedLineProps {
  points: number[];
  strokeWidth?: number;
  dash?: number[];
}

const RedLine: React.FC<RedLineProps> = ({
  points,
  strokeWidth = 2,
  dash,
}) => (
  <Line
    points={points}
    stroke={RED}
    strokeWidth={strokeWidth}
    dash={dash}
    lineCap="round"
    lineJoin="round"
  />
);

export default RedLine;
