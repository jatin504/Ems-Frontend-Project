import React from "react";
import {
  Group,
  Circle,
  Line,
} from "react-konva";

import BlueText from "./BlueText";
import { Magenta } from "../electrical/constants";

interface SurgeArresterProps {
  x: number;
  y: number;
}

const SurgeArrester: React.FC<
  SurgeArresterProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Circle
      radius={4}
      stroke={Magenta}
      strokeWidth={1}
    />

    <Line
      points={[0, 4, 0, 16]}
      stroke={Magenta}
      strokeWidth={1}
    />

    <Line
      points={[-5, 8, 5, 8]}
      stroke={Magenta}
      strokeWidth={1}
    />

    <Line
      points={[-3, 16, 3, 16]}
      stroke={Magenta}
      strokeWidth={1}
    />

    <BlueText
      x={-9}
      y={-16}
      text="TNC"
      fontSize={9}
    />
  </Group>
);

export default SurgeArrester;
