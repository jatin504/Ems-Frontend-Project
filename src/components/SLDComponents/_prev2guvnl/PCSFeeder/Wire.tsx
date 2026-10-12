import React from "react";
import { Line } from "react-konva";
import { BLACK } from "../electrical/constants";

interface WireProps
  extends Omit<any, "points" | "stroke" | "strokeWidth"> {
  points: number[];
  color?: string;
  width?: number;
}

const Wire: React.FC<WireProps> = ({
  points,
  color = BLACK,
  width = 1,
  ...props
}) => {
  return (
    <Line
      points={points}
      stroke={color}
      strokeWidth={width}
      lineCap="square"
      lineJoin="miter"
      {...props}
    />
  );
};

export default Wire;
