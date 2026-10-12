import React from "react";
import { Group, Line, Circle, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface Props {
  x: number;
  y: number;
}

export default function LineIsolator({ x, y }: Props) {
  return (
    <Group>
      {/* <Text
        x={x - 260}
        y={y - 20}
        text="602-LINE ISO WI ES"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 2}
        text="66 kV, 1250 A,"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 23}
        text="31.5 kA FOR 3 SEC"
        fontSize={15}
        fill={BLUE}
      /> */}

      {/* main conductor */}
      <Line
        points={[x, y, x + 45, y]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* isolator blade */}
      <Line
        points={[x + 45, y, x + 20, y + 28]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* fixed contact */}
      <Line
        points={[x + 45, y, x + 65, y]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* ES connection */}
      <Line
        points={[x + 20, y + 28, x + 20, y + 48]}
        stroke={RED}
        strokeWidth={2}
      />

      <Circle
        x={x + 125}
        y={y + 10}
        radius={13}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 116}
        y={y + 3}
        text="EI"
        fontSize={11}
        fill={RED}
      />
    </Group>
  );
}
