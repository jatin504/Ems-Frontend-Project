import { useState } from "react";
import { Group, Rect, Circle, Line } from "react-konva";

interface Props {
  x: number;
  y: number;
}

/* ================= LOCKED VERTICAL USER MONITOR ================= */

const VerticalUserMonitor = ({ x, y }: Props) => {
  const gap = 55;

  const UserMonitor = ({ yOffset }: { yOffset: number }) => (
    <Group y={yOffset} scaleX={0.9} scaleY={0.9}>
      <Rect x={0} y={10} width={42} height={28} fill="#1f2d3d" cornerRadius={4} />
      <Rect x={4} y={14} width={34} height={20} fill="#ffffff" cornerRadius={2} />
      <Circle x={21} y={12} radius={6} fill="#2fa4ff" />
      <Rect x={12} y={18} width={18} height={12} fill="#2fa4ff" cornerRadius={8} />
      <Rect x={19} y={38} width={4} height={6} fill="#1f2d3d" />
      <Rect x={14} y={44} width={14} height={3} fill="#1f2d3d" />
    </Group>
  );

  return (
    <Group x={x} y={y}>
      <UserMonitor yOffset={0} />
      <UserMonitor yOffset={gap} />
      <UserMonitor yOffset={gap * 2} />
    </Group>
  );
};

/* ================= LOCKED PURPLE VERTICAL LINES ================= */

const initialPurpleLines = [
  { x: 610, y: 564, height: 35 },  // Purple Line 1
  { x: 666, y: 565, height: 35 },  // Purple Line 2
  { x: 739, y: 566, height: 35 },  // Purple Line 3
  { x: 542, y: 564, height: 35 },  // Purple Line 4
  { x: 808, y: 565, height: 35 },  // Purple Line 5
  { x: 875, y: 566, height: 35 },  // Purple Line 6
];

export const LockedPurpleVerticalLines = () => (
  <>
    {initialPurpleLines.map((line, idx) => (
      <Line
        key={idx}
        points={[0, 0, 0, line.height]}
        x={line.x}
        y={line.y}
        stroke="#8000ff"
        strokeWidth={1}
      />
    ))}
  </>
);

/* ================= EXPORT ================= */

export default () => (
  <Group>
    {/* 🔒 LOCKED USER MONITOR */}
    <VerticalUserMonitor x={1475} y={71} />

    {/* 🟣 LOCKED PURPLE LINES */}
    <LockedPurpleVerticalLines />
  </Group>
);
