import React from "react";
import { Line } from "react-konva";
import { Stroke } from "../electrical/constants";

interface WireProps
  extends Omit<any, "points"> {
  points: number[];
  stroke?: string;
  strokeWidth?: number;
}

const Wire: React.FC<WireProps> = ({
  points,
  stroke = Stroke,
  strokeWidth = 1.5,
  ...props
}) => (
  <Line
    points={points}
    stroke={stroke}
    strokeWidth={strokeWidth}
    lineCap="round"
    lineJoin="round"
    {...props}
  />
);

export default Wire;
