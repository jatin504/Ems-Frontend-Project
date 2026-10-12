import React from "react";
import {
  Group,
  Rect,
  Text,
} from "react-konva";

import { BLUE } from "../electrical/constants";

interface AnnunciatorProps {
  x: number;
  y: number;
  scale?: number;
}

const Annunciator: React.FC<AnnunciatorProps> = ({
  x,
  y,
  scale = 1,
}) => {
  // =========================
  // TABLE CONFIGURATION
  // =========================

  const rows = 2;
  const cols = 4;

  const cellWidth = 28;
  const cellHeight = 27;

  // Space between individual windows
  const cellGap = 3;

  // Outer padding
  const padding = 5;

  const boxWidth =
    cols * cellWidth +
    (cols - 1) * cellGap +
    padding * 2;

  const boxHeight =
    rows * cellHeight +
    (rows - 1) * cellGap +
    padding * 2;

  // =========================
  // WINDOW COLORS
  // =========================

  const windowColors = [
    "#4CAF50", // 1
    "#4CAF50", // 2
    "#FF9800", // 3
    "#F44336", // 4

    "#4CAF50", // 5
    "#F44336", // 6
    "#FF9800", // 7
    "#4CAF50", // 8
  ];

  const numbers = Array.from(
    { length: 8 },
    (_, i) => i + 1
  );

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >
      {/* =========================
          MAIN ANNUNCIATOR BOX
          ========================= */}

      {/* Optional outer box */}
      {/* 
      <Rect
        x={0}
        y={0}
        width={boxWidth}
        height={boxHeight}
        cornerRadius={7}
        stroke={BLUE}
        strokeWidth={1.5}
        fill="#F8FAFC"
      />
      */}

      {/* =========================
          WINDOWS 1 - 8
          2 ROWS × 4 COLUMNS
          ========================= */}

      {numbers.map((num, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const cellX =
          padding +
          col * (cellWidth + cellGap);

        const cellY =
          padding +
          row * (cellHeight + cellGap);

        const color = windowColors[index];

        return (
          <Group key={num}>
            {/* Window */}
            <Rect
              x={cellX}
              y={cellY}
              width={cellWidth}
              height={cellHeight}
              cornerRadius={4}
              fill={color}
              stroke={BLUE}
              strokeWidth={0.8}
              shadowColor="#000000"
              shadowBlur={2}
              shadowOffset={{
                x: 0,
                y: 1,
              }}
              shadowOpacity={0.2}
            />

            {/* Number */}
            <Text
              x={cellX}
              y={cellY + 7}
              width={cellWidth}
              text={String(num)}
              fontSize={11}
              fontFamily="Arial"
              fontStyle="bold"
              align="center"
              fill="#FFFFFF"
            />
          </Group>
        );
      })}
    </Group>
  );
};

export default Annunciator;
