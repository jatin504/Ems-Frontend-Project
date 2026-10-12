import { Group, Circle } from "react-konva";
import { RED } from "../electrical/constants";
import { Wire } from "./Wire";
import { Txt } from "./Txt";
import type { Point } from "./types";



export const PowerTransformer = ({ x, y, scale=1 }: Point) => {
  return (
    <Group
      scaleX={scale}
      scaleY={scale}
    >
      {/* Main vertical conductor through transformer */}
      <Wire points={[x, y - 75, x, y - 28]} strokeWidth={3} />
      <Wire points={[x, y + 24, x, y + 75]} strokeWidth={3} />

      {/* Upper winding */}
      <Circle
        x={x}
        y={y - 16}
        radius={14}
        stroke={RED}
        strokeWidth={2.5}
        fill="#fff"
      />

      {/* Lower winding */}
      <Circle
        x={x}
        y={y + 8}
        radius={14}
        stroke={RED}
        strokeWidth={2.5}
        fill="#fff"
      />

      {/* Connection to protection CT circuits */}
      <Wire points={[x + 14, y - 16, x + 30, y - 16]} strokeWidth={2} />
      <Wire points={[x + 14, y + 16, x + 30, y + 16]} strokeWidth={2} />

      {/* Transformer tag */}
      <Txt
        x={x - 4}
        y={y - 20}
        text="Y"
        fontSize={15}
        fill={RED}
        bold
      />

      <Txt
        x={x - 4}
        y={y + 4}
        text="Y"
        fontSize={15}
        fill={RED}
        bold
      />
    </Group>
  );
};