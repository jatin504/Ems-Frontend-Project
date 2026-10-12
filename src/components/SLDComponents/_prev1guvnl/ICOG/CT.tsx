import React from "react";
import {
  Group,
  Circle,
  Line,
} from "react-konva";

import Wire from "./Wire";

interface CTProps {
  x: number;
  y: number;
}

const CT: React.FC<CTProps> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    {/* CT circles */}
    <Circle
      x={0}
      y={0}
      radius={5}
      stroke="#222"
    />

    {/* <Circle
      x={7}
      y={0}
      radius={5}
      stroke="#222"
    /> */}

    {/* core / earth indication */}


    <Wire
      points={[4, 0, 55, 0]}
    />
  </Group>
);

export default CT;
