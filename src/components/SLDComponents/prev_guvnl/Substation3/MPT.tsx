import React from "react";
import { Group, Circle, Line, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface Props {
  x: number;
  y: number;
}

export default function MPT({ x, y }: Props) {
  return (
    <Group>
      <Text
        x={x - 260}
        y={y - 15}
        text="602- MPT"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 7}
        text="ON R-PHASE"
        fontSize={15}
        fill={BLUE}
      />

      {/* branch */}
      <Line
        points={[x, y, x + 28, y]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* transformer symbol */}
      <Circle
        x={x + 18}
        y={y}
        radius={6}
        stroke={RED}
        strokeWidth={2}
      />

      <Circle
        x={x + 30}
        y={y}
        radius={6}
        stroke={RED}
        strokeWidth={2}
      />

      <Line
        points={[x + 36, y, x + 55, y]}
        stroke={RED}
        strokeWidth={2}
      />
    </Group>
  );
}
