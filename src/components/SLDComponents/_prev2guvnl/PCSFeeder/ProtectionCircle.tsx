import React from "react";
import {
  Group,
  Circle,
  Text,
} from "react-konva";

import { BLACK, BLUE } from "../electrical/constants";

interface ProtectionCircleProps {
  x: number;
  y: number;
  text: string;
  radius?: number;
  scale? : number;
}

const ProtectionCircle: React.FC<
  ProtectionCircleProps
> = ({
  x,
  y,
  text,
  radius = 14,
  scale=1,
}) => {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      <Circle
        radius={radius}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={-radius}
        y={-6}
        width={radius * 2}
        text={text}
        fontSize={11}
        fontFamily="Arial"
        align="center"
        fill={BLUE}
      />
    </Group>
  );
};

export default ProtectionCircle;
