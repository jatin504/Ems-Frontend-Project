import { Group, Circle, Rect } from "react-konva";

import { RED, BLUE } from "../electrical/constants";
import { Wire } from "./Wire";
import { Txt } from "./Txt";
import type { Point } from "./types";


export const LinePT = ({ x, y }: Point) => {
  return (
    <Group>
      <Wire points={[x, y, x + 17, y]} strokeWidth={2} />

      <Circle
        x={x + 24}
        y={y + 20}
        radius={9}
        stroke={RED}
        strokeWidth={2}
      />

      <Circle
        x={x + 24}
        y={y + 20}
        radius={4}
        stroke={RED}
        strokeWidth={1}
      />

      <Wire
        points={[x + 33, y + 20, x + 73, y + 20]}
        strokeWidth={2}
      />

      <Wire
        points={[x + 33, y + 41, x + 73, y + 41]}
        strokeWidth={2}
      />

      <Rect
        x={x + 73}
        y={y + 15}
        width={7}
        height={10}
        stroke={RED}
        strokeWidth={1.5}
      />

      <Rect
        x={x + 73}
        y={y + 36}
        width={7}
        height={10}
        stroke={RED}
        strokeWidth={1.5}
      />

      <Txt x={x + 84} y={y + 7} text="TO" fontSize={12} fill={BLUE} />

      <Txt
        x={x + 84}
        y={y + 25}
        text="33kV CRP"
        fontSize={12}
        fill={BLUE}
      />
    </Group>
  );
};
