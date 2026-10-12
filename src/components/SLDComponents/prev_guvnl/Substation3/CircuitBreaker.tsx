import React from "react";
import { Group, Line, Circle, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface Props {
  x: number;
  y: number;
}

export default function CircuitBreaker({ x, y }: Props) {
  return (
    <Group>
      <Text
        x={x - 260}
        y={y - 10}
        text="602-CB"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 12}
        text="72.5 kV, 1600 A,"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 33}
        text="31.5 kA FOR 3 SEC"
        fontSize={15}
        fill={BLUE}
      />

      {/* conductor */}
      <Line
        points={[x, y, x, y + 25]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* breaker contacts */}
      <Line
        points={[x - 8, y + 25, x + 8, y + 25]}
        stroke={RED}
        strokeWidth={3}
      />

      <Line
        points={[x, y + 25, x + 18, y + 48]}
        stroke={RED}
        strokeWidth={3}
      />

      <Line
        points={[x + 18, y + 48, x + 18, y + 75]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* operating mechanism */}
      <Circle
        x={x + 42}
        y={y + 75}
        radius={12}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 34}
        y={y + 68}
        text="M"
        fontSize={13}
        fill={RED}
      />
    </Group>
  );
}
