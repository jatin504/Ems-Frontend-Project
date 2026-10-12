import React from "react";
import { Group, Circle, Line, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface Props {
  x: number;
  y: number;
}

export default function LightningArrester({ x, y }: Props) {
  return (
    <Group>
      <Text
        x={x - 260}
        y={y - 18}
        text="602-LA"
        fontSize={15}
        fill={BLUE}
      />

      <Text
        x={x - 260}
        y={y + 3}
        text="60 kV, 10 kA STATION CLASS III"
        fontSize={15}
        fill={BLUE}
      />

      {/* connection */}
      <Line
        points={[x, y, x + 35, y]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* LA symbol */}
      <RectLike x={x + 15} y={y - 6} />

      <Line
        points={[x + 35, y, x + 50, y]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* arrow */}
      <Line
        points={[
          x + 50,
          y,
          x + 43,
          y - 5,
          x + 43,
          y + 5,
          x + 50,
          y,
        ]}
        stroke={RED}
        strokeWidth={2}
      />
    </Group>
  );
}

function RectLike({ x, y }: { x: number; y: number }) {
  return (
    <Line
      points={[
        x,
        y,
        x + 18,
        y,
        x + 18,
        y + 12,
        x,
        y + 12,
        x,
        y,
      ]}
      stroke={RED}
      strokeWidth={2}
      closed
    />
  );
}
