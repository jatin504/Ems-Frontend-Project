import React from "react";
import {
  Group,
  Rect,
  Text,
  Line,
} from "react-konva";
import { BUS_GREEN, RED } from "../electrical/constants";


interface Breaker52Props {
  x: number;
  y: number;
  scale? : number;
}

const Breaker52: React.FC<
  Breaker52Props
> = ({ x, y, scale=1 }) => {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      {/* breaker box */}
      <Rect
        x={-10}
        y={-10}
        width={20}
        height={20}
        stroke={BUS_GREEN}
        strokeWidth={1}
        fill={BUS_GREEN}
      />

      <Text
        x={-10}
        y={-4}
        width={20}
        text="52"
        fontSize={10}
        fontFamily="Arial"
        align="center"
        fill={"white"}
      />

      {/* arrows */}
      <Line
        points={[-4, -15, 0, -21, 4, -15]}
        stroke={RED}
        strokeWidth={2}
      />

      <Line
        points={[-4, 15, 0, 21, 4, 15]}
        stroke={RED}
        strokeWidth={2}
      />
    </Group>
  );
};

export default Breaker52;
