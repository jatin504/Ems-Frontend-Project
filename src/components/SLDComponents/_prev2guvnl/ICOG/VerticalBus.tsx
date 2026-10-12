import React from "react";
import { Line } from "react-konva";
import { Stroke } from "../electrical/constants";

interface VerticalBusProps {
  x?: number;
  height?: number;
}

const VerticalBus: React.FC<VerticalBusProps> = ({
  x = 188,
  height = 690,
}) => (
  <Line
    points={[x, 0, x, height]}
    stroke={Stroke}
    strokeWidth={2}
  />
);

export default VerticalBus;
