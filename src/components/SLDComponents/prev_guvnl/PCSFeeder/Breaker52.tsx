import React from "react";
import {
  Group,
  Rect,
  Text,
  Line,
} from "react-konva";
import { RED } from "../electrical/constants";


interface Breaker52Props {
  x: number;
  y: number;
}

const Breaker52: React.FC<
  Breaker52Props
> = ({ x, y }) => {
  return (
    <Group x={x} y={y}>
      {/* breaker box */}
      <Rect
        x={-10}
        y={-10}
        width={20}
        height={20}
        stroke={RED}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={-10}
        y={-7}
        width={20}
        text="52"
        fontSize={10}
        fontFamily="Arial"
        align="center"
        fill={RED}
      />

      {/* arrows */}
      <Line
        points={[-4, -15, 0, -21, 4, -15]}
        stroke={RED}
        strokeWidth={1}
      />

      <Line
        points={[-4, 15, 0, 21, 4, 15]}
        stroke={RED}
        strokeWidth={1}
      />
    </Group>
  );
};

export default Breaker52;
