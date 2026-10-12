import React from "react";
import {
  Group,
  Circle,
  Text,
} from "react-konva";

import { BLACK, BLUE } from "../electrical/constants";

interface MotorSymbolProps {
  x: number;
  y: number;
  scale?: number;
}

const MotorSymbol: React.FC<
  MotorSymbolProps
> = ({ x, y, scale=1, }) => {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      <Circle
        radius={14}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={-14}
        y={-6}
        width={28}
        text="M"
        fontSize={11}
        align="center"
        fill={BLUE}
      />
    </Group>
  );
};

export default MotorSymbol;
