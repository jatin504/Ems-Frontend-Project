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

  const rows = 3;
  const cols = 8;

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

  const cornerRadius = 7;

  // =========================
  // WINDOW COLORS
  // =========================

  const windowColors = [
    "#4CAF50", // 1  Green
    "#4CAF50", // 2  Green
    "#FF9800", // 3  Orange
    "#F44336", // 4  Red
    "#4CAF50", // 5  Green
    "#FF9800", // 6  Orange
    "#4CAF50", // 7  Green
    "#F44336", // 8  Red

    "#4CAF50", // 9  Green
    "#F44336", // 10 Red
    "#FF9800", // 11 Orange
    "#4CAF50", // 12 Green
    "#4CAF50", // 13 Green
    "#F44336", // 14 Red
    "#FF9800", // 15 Orange
    "#4CAF50", // 16 Green

    "#F44336", // 17 Red
    "#4CAF50", // 18 Green
    "#FF9800", // 19 Orange
    "#4CAF50", // 20 Green
    "#F44336", // 21 Red
    "#4CAF50", // 22 Green
    "#FF9800", // 23 Orange
    "#4CAF50", // 24 Green
  ];

  const numbers = Array.from(
    { length: 24 },
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

      {/* <Rect
        x={0}
        y={0}
        width={boxWidth}
        height={boxHeight}
        cornerRadius={cornerRadius}
        stroke={BLUE}
        strokeWidth={1.5}
        fill="#F8FAFC"
        shadowColor="#000000"
        shadowBlur={5}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.15}
      /> */}

      {/* =========================
          WINDOWS 1 - 24
          3 ROWS × 8 COLUMNS
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

        const color =
          windowColors[index];

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
