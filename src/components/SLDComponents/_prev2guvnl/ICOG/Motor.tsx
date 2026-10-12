import React from "react";
import {
  Group,
  Circle,
  Text,
} from "react-konva";
import { Blue } from "../electrical/constants";

interface MotorProps {
  x: number;
  y: number;
}

const Motor: React.FC<MotorProps> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <Circle
      radius={12}
      stroke="#222"
    />

    <Text
      x={-5}
      y={-6}
      text="M"
      fontSize={13}
      fill="#222"
    />

    <Circle
      x={30}
      y={0}
      radius={10}
      stroke="#222"
    />

    <Text
      x={23}
      y={-6}
      text="95"
      fontSize={11}
      fill={Blue}
    />

    <Circle
      x={52}
      y={0}
      radius={10}
      stroke="#222"
    />

    <Text
      x={45}
      y={-6}
      text="94"
      fontSize={11}
      fill={Blue}
    />

    <Circle
      x={74}
      y={0}
      radius={10}
      stroke="#222"
    />

    <Text
      x={67}
      y={-6}
      text="86"
      fontSize={11}
      fill={Blue}
    />
  </Group>
);

export default Motor;
