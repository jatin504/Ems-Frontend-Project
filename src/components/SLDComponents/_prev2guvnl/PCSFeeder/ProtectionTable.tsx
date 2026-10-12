import React from "react";
import {
  Group,
  Rect,
  Circle,
  Text,
} from "react-konva";

import { BLACK, FONT } from "../electrical/constants";

interface ProtectionTableProps {
  x: number;
  y: number;
  scale? : number;
}

const ProtectionTable: React.FC<ProtectionTableProps> = ({ x, y, scale=1.05 }) => {
  const width = 130;
  const rowHeight = 32;
  const padding = 10;
  const radius = 8;

  const statuses = [
    { label: "50", active: true },
    { label: "50N", active: true },
    { label: "27", active: false },
    { label: "51", active: true },
    { label: "51N", active: false },
    { label: "59", active: false },
  ];

  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      {/* Main rounded container */}
      <Rect
        width={width}
        height={statuses.length * rowHeight + padding * 2}
        cornerRadius={radius}
        fill="white"
        stroke={BLACK}
        strokeWidth={1}
        shadowColor="#000"
        shadowBlur={4}
        shadowOpacity={0.15}
        shadowOffset={{ x: 1, y: 2 }}
      />

      {statuses.map((status, index) => {
        const cy = padding + index * rowHeight + rowHeight / 2;

        return (
          <Group key={status.label}>
            {/* Status bubble shadow */}
            <Circle
              x={padding + 7}
              y={cy + 1}
              radius={10}
              fill="#000"
              opacity={0.15}
              shadowBlur={3}
              shadowOpacity={0.25}
            />

            {/* Status bubble */}
            <Circle
              x={padding + 7}
              y={cy}
              radius={10}
              fill={status.active ? "#4CAF50" : "#BDBDBD"}
            />

            {/* Status text */}
            <Text
              x={padding + 24}
              y={cy - 12}
              width={width - padding * 2 - 24}
              text={status.label}
              fontSize={32}
              fontFamily={FONT}
              fill={BLACK}
              fontStyle="bold"
            />
          </Group>
        );
      })}
    </Group>
  );
};

export default ProtectionTable;
