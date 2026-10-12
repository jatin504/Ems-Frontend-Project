import React from "react";
import { Circle, Line, Rect, Text, Group } from "react-konva";
import { Blue, Red } from "../electrical/constants";

export interface Point {
  x: number;
  y: number;
}

export const RED = Red;
export const BLUE = Blue;

export function ConnectionPoint({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label?: string;
}) {
  return (
    <Group>
      <Circle x={x} y={y} radius={5} fill={RED} />
      {label && (
        <Text
          x={x + 12}
          y={y - 8}
          text={label}
          fontSize={14}
          fill={BLUE}
        />
      )}
    </Group>
  );
}

export function HorizontalWire({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <Line
      points={[x1, y1, x2, y2]}
      stroke={RED}
      strokeWidth={3}
    />
  );
}

export function VerticalWire({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <Line
      points={[x1, y1, x2, y2]}
      stroke={RED}
      strokeWidth={3}
    />
  );
}

export function DeviceLabel({
  x,
  y,
  text,
  width = 250,
}: {
  x: number;
  y: number;
  text: string;
  width?: number;
}) {
  return (
    <Text
      x={x}
      y={y}
      text={text}
      width={width}
      fontSize={15}
      fill={BLUE}
      lineHeight={1.35}
    />
  );
}

export function TerminalBox({
  x,
  y,
  width = 22,
  height = 12,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke={RED}
      strokeWidth={2}
    />
  );
}
