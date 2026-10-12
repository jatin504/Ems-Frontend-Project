import React from "react";
import { Group, Circle, Text, Line } from "react-konva";
import { Blue, RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
}

const MotorIsolator: React.FC<Props> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <Circle
      radius={11}
      stroke={RED}
      strokeWidth={2}
    />

    <Text
      x={-7}
      y={-6}
      text="M"
      fontSize={12}
      fill={Blue}
      fontFamily="Arial"
    />

    <Line
      points={[-20, 0, -10, 0]}
      stroke={RED}
      strokeWidth={2}
    />

    <Line
      points={[10, 0, 20, 0]}
      stroke={RED}
      strokeWidth={2}
    />
  </Group>
);

export default MotorIsolator;
