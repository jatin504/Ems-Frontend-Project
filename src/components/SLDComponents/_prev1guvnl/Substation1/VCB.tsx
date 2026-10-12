import { Group, Rect } from "react-konva";
import { RED } from "../electrical/constants";
import { Wire } from "./Wire";
import type { Point } from "./types";

export const VCB = ({ x, y }: Point) => (
  <Group>
    <Wire points={[x, y, x + 18, y]} strokeWidth={3} />

    <Rect
      x={x + 18}
      y={y - 6}
      width={22}
      height={12}
      stroke={RED}
      strokeWidth={2}
    />

    <Wire points={[x + 22, y, x + 36, y]} strokeWidth={2} />
    <Wire points={[x + 40, y, x + 75, y]} strokeWidth={3} />
  </Group>
);
