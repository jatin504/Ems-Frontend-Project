import { Group } from "react-konva";
import { Wire } from "./Wire";
import { Dot } from "./Dot";
import { CTCore } from "./CTCore";
import type { Point } from "./types";


export const CTAssembly = ({ x, y }: Point) => {
  return (
    <Group>
      <Wire points={[x, y - 45, x, y + 105]} strokeWidth={3} />

      <CTCore x={x} y={y} number="1" />
      <CTCore x={x} y={y + 35} number="2" />
      <CTCore x={x} y={y + 70} number="3" />
      <CTCore x={x} y={y + 105} number="4" />

      <Dot x={x} y={y - 45} />
      <Dot x={x} y={y + 140} />
    </Group>
  );
};