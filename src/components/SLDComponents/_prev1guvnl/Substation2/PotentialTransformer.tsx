import React from "react";
import { Group, Circle, Text } from "react-konva";
import { Blue, RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
}

const PotentialTransformer: React.FC<Props> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <Circle
      radius={7}
      stroke={RED}
      strokeWidth={2}
      fill="#fff"
    />

    <Text
      x={-5}
      y={-5}
      text="V"
      fontSize={9}
      fill={Blue}
    />
  </Group>
);

export default PotentialTransformer;
