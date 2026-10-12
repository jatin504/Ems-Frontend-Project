import React from "react";
import { Group, Line } from "react-konva";
import { RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
}

const Breaker: React.FC<Props> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <Line
      points={[0, -25, 0, -8]}
      stroke={RED}
      strokeWidth={3}
    />

    <Line
      points={[0, 8, 0, 25]}
      stroke={RED}
      strokeWidth={3}
    />

    <Line
      points={[-8, -7, 8, 7]}
      stroke={RED}
      strokeWidth={3}
    />
  </Group>
);

export default Breaker;
