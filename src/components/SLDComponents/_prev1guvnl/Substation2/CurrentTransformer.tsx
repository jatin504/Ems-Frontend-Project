import React from "react";
import { Group, Circle } from "react-konva";
import { RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
}

const CurrentTransformer: React.FC<Props> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <Circle
      radius={8}
      stroke={RED}
      strokeWidth={2}
      fill="#fff"
    />

    <Circle
      radius={4}
      stroke={RED}
      strokeWidth={1}
    />
  </Group>
);

export default CurrentTransformer;
