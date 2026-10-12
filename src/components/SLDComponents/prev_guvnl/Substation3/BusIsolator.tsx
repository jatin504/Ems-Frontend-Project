import React from "react";
import { Group, Line, Circle, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface Props {
  x: number;
  y: number;
}

export default function BusIsolator({ x, y }: Props) {
  return (
    <Group>
      <Text
        x={x - 260}
        y={y}
        text="602-BUS ISO WO ES"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 22}
        text="66 kV, 1250 A,"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 43}
        text="31.5 kA FOR 3 SEC"
        fontSize={15}
        fill={BLUE}
      />

      {/* bus isolator */}
      <Line
        points={[x, y, x + 35, y]}
        stroke={RED}
        strokeWidth={3}
      />

      <Line
        points={[x + 35, y, x + 10, y + 28]}
        stroke={RED}
        strokeWidth={3}
      />

      <Line
        points={[x + 10, y + 28, x + 10, y + 45]}
        stroke={RED}
        strokeWidth={2}
      />

      {/* motor */}
      <Circle
        x={x + 42}
        y={y + 45}
        radius={12}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 35}
        y={y + 38}
        text="M"
        fontSize={13}
        fill={RED}
      />

      {/* ES */}
      <Circle
        x={x + 125}
        y={y + 35}
        radius={13}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 117}
        y={y + 28}
        text="EI"
        fontSize={11}
        fill={RED}
      />
    </Group>
  );
}
