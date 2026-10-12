import React from "react";
import {
  Group,
  Circle,
  Line,
  Arc,
} from "react-konva";

import Wire from "./Wire";

interface TransformerProps {
  x: number;
  y: number;
}

const Transformer: React.FC<
  TransformerProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Circle
      x={0}
      y={0}
      radius={17}
      stroke="#222"
    />

    <Circle
      x={27}
      y={0}
      radius={17}
      stroke="#222"
    />

    {/* winding indications */}
    <Arc
      x={0}
      y={0}
      innerRadius={6}
      outerRadius={13}
      angle={180}
      rotation={-90}
      stroke="#222"
    />

    <Arc
      x={27}
      y={0}
      innerRadius={6}
      outerRadius={13}
      angle={180}
      rotation={90}
      stroke="#222"
    />

    {/* top connection */}
    <Wire
      points={[13, -17, 13, -28, 75, -28]}
    />

    {/* bottom connection */}
    <Wire
      points={[
        40,
        17,
        40,
        40,
        90,
        40,
        90,
        180,
      ]}
    />

    {/* ground / terminal marks */}
    <Line
      points={[-7, -20, -7, -28]}
      stroke="#222"
    />

    <Line
      points={[-12, -28, -2, -28]}
      stroke="#222"
    />

    <Line
      points={[47, 20, 47, 28]}
      stroke="#222"
    />

    <Line
      points={[42, 28, 52, 28]}
      stroke="#222"
    />
  </Group>
);

export default Transformer;
