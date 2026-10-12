import React from "react";
import {
  Group,
  Line,
  Circle,
  Rect,
  Text,
} from "react-konva";
import { Stroke } from "../electrical/constants";


interface BatteryContainerProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  racks?: number;
  scale?: number;
}

export default function BatteryContainer({
  x,
  y,
  width = 180,
  height = 145,
  racks = 3,
  scale = 1,
}: BatteryContainerProps) {
  const rackWidth = 48;
  const rackHeight = 95;

  // Calculate rack positions
  const rackGap =
    (width - racks * rackWidth) / (racks + 1);

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >
      {/* Connection from PCS */}
      <Line
        points={[
          width / 2,
          -30,
          width / 2,
          0,
        ]}
        stroke={Stroke}
        strokeWidth={1.2}
      />

      {/* Battery container */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke={Stroke}
        strokeWidth={1.5}
        fill="white"
      />

      {/* Battery racks */}
      {Array.from({ length: racks }).map(
        (_, rackIndex) => {
          const rackX =
            rackGap +
            rackIndex *
              (rackWidth + rackGap);

          return (
            <Group
              key={rackIndex}
              x={rackX}
              y={15}
            >
              {/* Rack */}
              <Rect
                x={0}
                y={0}
                width={rackWidth}
                height={rackHeight}
                stroke={Stroke}
                strokeWidth={1.2}
                fill="#f8f8f8"
              />

              {/* Battery modules */}
              {[0, 1, 2].map((module) => (
                <Group
                  key={module}
                  x={5}
                  y={5 + module * 27}
                >
                  <Rect
                    width={rackWidth - 10}
                    height={22}
                    stroke={Stroke}
                    strokeWidth={1}
                    fill="white"
                  />

                  {/* Battery symbol */}
                  <Line
                    points={[
                      14,
                      6,
                      14,
                      16,
                    ]}
                    stroke={Stroke}
                    strokeWidth={1.5}
                  />

                  <Line
                    points={[
                      20,
                      4,
                      20,
                      18,
                    ]}
                    stroke={Stroke}
                    strokeWidth={1.5}
                  />

                  {/* + */}
                  <Text
                    x={25}
                    y={3}
                    text="+"
                    fontSize={9}
                    fill={Stroke}
                  />

                  {/* - */}
                  <Text
                    x={25}
                    y={11}
                    text="−"
                    fontSize={9}
                    fill={Stroke}
                  />
                </Group>
              ))}

              {/* Dots at bottom */}
              <Circle
                x={rackWidth / 2 - 5}
                y={rackHeight + 5}
                radius={2.5}
                fill={Stroke}
              />

              <Circle
                x={rackWidth / 2 - 5}
                y={rackHeight + 13}
                radius={2.5}
                fill={Stroke}
              />

              <Circle
                x={rackWidth / 2 - 5}
                y={rackHeight + 21}
                radius={2.5}
                fill={Stroke}
              />

              {/* Rack label */}
              <Text
                x={-2}
                y={rackHeight + 28}
                width={rackWidth + 4}
                text={`RACK ${rackIndex + 1}`}
                fontSize={8}
                align="center"
                fill={Stroke}
              />
            </Group>
          );
        }
      )}

      {/* Container label */}
      <Text
        x={0}
        y={height - 13}
        width={width}
        text="BATTERY CONTAINER"
        fontSize={9}
        fontFamily="Arial"
        align="center"
        fill={Stroke}
      />
    </Group>
  );
}
