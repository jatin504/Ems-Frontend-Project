import React from "react";
import {
  Group,
  Rect,
  Circle,
  Line,
  Text,
} from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface ProtectionPanelProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

const protectionFunctions = [
  "50",
  "51",
  "50N",
  "51N",
  "27",
  "59",
  "67",
  "67N",
  "50 LBB",
];

export default function ProtectionPanel({
  x,
  y,
  width = 430,
  height = 300,
}: ProtectionPanelProps) {
  return (
    <Group>
      {/* panel */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={RED}
        strokeWidth={2}
      />

      {/* title */}
      <Text
        x={x + 90}
        y={y - 20}
        text="LINE BAY CRP-1"
        fontSize={14}
        fill={BLUE}
      />

      {/* annunciator */}
      <Text
        x={x + 230}
        y={y + 5}
        text="12W ANNUNCIATOR"
        fontSize={8}
        fill={BLUE}
      />

      <Rect
        x={x + 230}
        y={y + 15}
        width={80}
        height={35}
        stroke={RED}
        strokeWidth={2}
      />

      {[1, 2, 3].map((row) => (
        <Line
          key={`r-${row}`}
          points={[
            x + 230,
            y + 15 + row * 9,
            x + 310,
            y + 15 + row * 9,
          ]}
          stroke={RED}
          strokeWidth={1}
        />
      ))}

      {[1, 2].map((col) => (
        <Line
          key={`c-${col}`}
          points={[
            x + 230 + col * 26,
            y + 15,
            x + 230 + col * 26,
            y + 50,
          ]}
          stroke={RED}
          strokeWidth={1}
        />
      ))}

      {/* protection relay */}
      <Rect
        x={x + 20}
        y={y + 65}
        width={295}
        height={45}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 25}
        y={y + 58}
        text="DIRECTIONAL O/C & E/F PROTECTION RELAY"
        fontSize={11}
        fill={BLUE}
      />

      {protectionFunctions.map((fn, i) => {
        const cx = x + 42 + i * 30;

        return (
          <Group key={fn}>
            <Circle
              x={cx}
              y={y + 87}
              radius={14}
              stroke={RED}
              strokeWidth={1.5}
            />

            <Text
              x={cx - 11}
              y={y + 81}
              text={fn}
              fontSize={9}
              fill={BLUE}
              width={22}
              align="center"
            />
          </Group>
        );
      })}

      {/* FROM 66kV BUS PT */}
      <Line
        points={[
          x + width,
          y + 90,
          x + width - 80,
          y + 90,
        ]}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + width - 90}
        y={y + 77}
        text="FROM"
        fontSize={11}
        fill={BLUE}
      />

      <Text
        x={x + width - 90}
        y={y + 91}
        text="66 kV BUS PT"
        fontSize={11}
        fill={BLUE}
      />

      {/* TVM */}
      <Rect
        x={x + 20}
        y={y + 200}
        width={35}
        height={22}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 25}
        y={y + 205}
        text="TVM"
        fontSize={10}
        fill={BLUE}
      />

      {/* Ammeter */}
      <Circle
        x={x + 75}
        y={y + 211}
        radius={9}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 70}
        y={y + 206}
        text="A"
        fontSize={11}
        fill={BLUE}
      />

      {/* Voltmeter */}
      <Circle
        x={x + 112}
        y={y + 211}
        radius={9}
        stroke={RED}
        strokeWidth={2}
      />

      <Text
        x={x + 107}
        y={y + 206}
        text="V"
        fontSize={11}
        fill={BLUE}
      />

      {/* ASS / VSS */}
      <Text
        x={x + 63}
        y={y + 232}
        text="ASS"
        fontSize={10}
        fill={BLUE}
      />

      <Text
        x={x + 101}
        y={y + 232}
        text="VSS"
        fontSize={10}
        fill={BLUE}
      />

      {/* bottom protection functions */}
      {["86", "95-1", "95-2", "80A", "80B"].map(
        (fn, index) => {
          const positions = [
            [x + 225, y + 245],
            [x + 260, y + 245],
            [x + 295, y + 245],
            [x + 260, y + 278],
            [x + 295, y + 278],
          ];

          const [cx, cy] = positions[index];

          return (
            <Group key={fn}>
              <Circle
                x={cx}
                y={cy}
                radius={15}
                stroke={RED}
                strokeWidth={1.5}
              />

              <Text
                x={cx - 14}
                y={cy - 6}
                width={28}
                align="center"
                text={fn}
                fontSize={9}
                fill={BLUE}
              />
            </Group>
          );
        }
      )}
    </Group>
  );
}
