import React from "react";
import { Group, Line } from "react-konva";
import { RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
  rotation?: number;
}

const DisconnectSwitch: React.FC<Props> = ({
  x,
  y,
  rotation = 0,
}) => (
  <Group
    x={x}
    y={y}
    rotation={rotation}
  >
    <Line
      points={[-10, -10, 10, 10]}
      stroke={RED}
      strokeWidth={2}
    />

    <Line
      points={[-10, 10, 10, -10]}
      stroke={RED}
      strokeWidth={2}
    />
  </Group>
);

export default DisconnectSwitch;
