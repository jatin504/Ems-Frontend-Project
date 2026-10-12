import { Group, Circle } from "react-konva";
import { RED } from "../electrical/constants";
import { Wire } from "./Wire";
import { Txt } from "./Txt";
import type { Point } from "./types";



export const PowerTransformer = ({ x, y }: Point) => {
  return (
    <Group>
      {/* Main vertical conductor through transformer */}
      <Wire points={[x, y - 75, x, y - 28]} strokeWidth={3} />
      <Wire points={[x, y + 28, x, y + 75]} strokeWidth={3} />

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
        y={y + 16}
        radius={14}
        stroke={RED}
        strokeWidth={2.5}
        fill="#fff"
      />

      {/* Winding / transformer connection marks */}
      <Wire
        points={[x - 10, y - 23, x + 5, y - 10, x - 5, y - 3]}
        strokeWidth={2}
      />

      <Wire
        points={[x - 10, y + 9, x + 5, y + 22, x - 5, y + 29]}
        strokeWidth={2}
      />

      {/* Connection to protection CT circuits */}
      <Wire points={[x + 14, y - 16, x + 30, y - 16]} strokeWidth={2} />
      <Wire points={[x + 14, y + 16, x + 30, y + 16]} strokeWidth={2} />

      {/* Transformer tag */}
      <Txt
        x={x - 7}
        y={y - 20}
        text="Y"
        fontSize={9}
        fill={RED}
        bold
      />

      <Txt
        x={x - 7}
        y={y + 12}
        text="Y"
        fontSize={9}
        fill={RED}
        bold
      />
    </Group>
  );
};