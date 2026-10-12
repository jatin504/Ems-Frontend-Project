import React from "react";
import {
  Group,
  Circle,
  Line,
} from "react-konva";

import BlueText from "./BlueText";
import Wire from "./Wire";

interface SpareCTProps {
  x: number;
  y: number;
}

const SpareCT: React.FC<SpareCTProps> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <Circle
      x={0}
      y={0}
      radius={5}
      stroke="#222"
    />

    <Circle
      x={7}
      y={0}
      radius={5}
      stroke="#222"
    />

    <Line
      points={[0, -5, 0, -18]}
      stroke="#222"
    />

    <Line
      points={[-8, -18, 8, -18]}
      stroke="#222"
    />

    <Line
      points={[-5, -22, 5, -22]}
      stroke="#222"
    />

    <Wire
      points={[12, 0, 55, 0]}
    />

    <BlueText
      x={65}
      y={-7}
      text="SPARE"
    />
  </Group>
);

export default SpareCT;
