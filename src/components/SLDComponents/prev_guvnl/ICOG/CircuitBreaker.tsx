import React from "react";
import {
  Group,
  Line,
  Rect,
  Text,
} from "react-konva";
import { RED } from "../electrical/constants";

interface CircuitBreakerProps {
  x: number;
  y: number;
}

const CircuitBreaker: React.FC<
  CircuitBreakerProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Line
      points={[0, -18, 0, 18]}
      stroke={RED}
      strokeWidth={2}
    />

    <Line
      points={[6, -18, 6, 18]}
      stroke={RED}
      strokeWidth={2}
    />

    <Line
      points={[0, -8, 6, -14]}
      stroke={RED}
      strokeWidth={2}
    />

    <Rect
      x={-10}
      y={-7}
      width={16}
      height={18}
      stroke="#222"
      fill="#fff"
    />

    <Text
      x={-9}
      y={-5}
      text="52"
      fontSize={12}
      fill="#222"
    />
  </Group>
);

export default CircuitBreaker;
