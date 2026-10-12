import React from "react";
import { Group, Circle, Text } from "react-konva";
import { Blue, RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
  text: string;
  radius?: number;
}

const RelayCircle: React.FC<Props> = ({
  x,
  y,
  text,
  radius = 14,
}) => (
  <Group x={x} y={y}>
    <Circle
      radius={radius}
      fill="#fff"
      stroke={RED}
      strokeWidth={1.5}
    />

    <Text
      x={-radius}
      y={-6}
      width={radius * 2}
      text={text}
      align="center"
      fontSize={11}
      fill={Blue}
      fontFamily="Arial"
    />
  </Group>
);

export default RelayCircle;
