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
  scale?: number;
}

const CircuitBreaker: React.FC<
  CircuitBreakerProps
> = ({ x, y, scale=1, }) => (
  <Group x={x} y={y} scaleX={scale} scaleY={scale}>
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
      strokeWidth={2}
    />

    <Line
      points={[-4, 15, 0, 21, 4, 15]}
      stroke={RED}
      strokeWidth={2}
    />
  </Group>
);

export default CircuitBreaker;
