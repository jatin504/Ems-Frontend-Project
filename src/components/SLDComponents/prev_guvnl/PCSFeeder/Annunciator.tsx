import React from "react";
import {
  Group,
  Rect,
  Text,
} from "react-konva";

import Wire from "./Wire";
import { BLUE } from "../electrical/constants";

interface AnnunciatorProps {
  x: number;
  y: number;
}

const Annunciator: React.FC<
  AnnunciatorProps
> = ({ x, y }) => {
  const numbers = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16,
    17, 18, 19, 20,
    21, 22, 23, 24,
  ];

  const cols = 4;
  const cellWidth = 23;
  const cellHeight = 25;

  return (
    <Group x={x} y={y}>

      {/* Grid */}
      <Rect
        width={cols * cellWidth}
        height={6 * cellHeight}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      {numbers.map((num, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        return (
          <Group key={num}>
            {/* vertical lines */}
            {col > 0 && (
              <Wire
                points={[
                  col * cellWidth,
                  0,
                  col * cellWidth,
                  6 * cellHeight,
                ]}
                color={BLUE}
              />
            )}

            {/* horizontal lines */}
            {row > 0 && (
              <Wire
                points={[
                  0,
                  row * cellHeight,
                  cols * cellWidth,
                  row * cellHeight,
                ]}
                color={BLUE}
              />
            )}

            <Text
              x={col * cellWidth}
              y={row * cellHeight + 4}
              width={cellWidth}
              text={String(num)}
              fontSize={12}
              fontFamily="Arial"
              align="center"
              fill={BLUE}
            />
          </Group>
        );
      })}

      {/* Label */}
      <Text
        x={-5}
        y={6 * cellHeight + 7}
        width={100}
        text="ANNUNCIATOR 24"
        fontSize={13}
        fontFamily="Arial"
        fill={BLUE}
      />

      <Text
        x={-5}
        y={6 * cellHeight + 22}
        width={100}
        text="WINDOW"
        fontSize={13}
        fontFamily="Arial"
        fill={BLUE}
      />

      {/* RS485 */}
      <Text
        x={100}
        y={95}
        text="RS 485"
        fontSize={13}
        fontFamily="Arial"
        fill={BLUE}
      />
    </Group>
  );
};

export default Annunciator;
