import React from "react";
import {
  Group,
  Rect,
  Text,
} from "react-konva";

import Wire from "./Wire";
import { BLACK } from "../electrical/constants";

interface ProtectionTableProps {
  x: number;
  y: number;
}

const ProtectionTable: React.FC<
  ProtectionTableProps
> = ({ x, y }) => {
  const cellWidth = 38;
  const cellHeight = 29;

  const data = [
    ["50", "50N", "27"],
    ["51", "51N", "59"],
  ];

  return (
    <Group x={x} y={y}>

      <Rect
        width={cellWidth * 3}
        height={cellHeight * 2}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* vertical */}
      <Wire
        points={[
          cellWidth,
          0,
          cellWidth,
          cellHeight * 2,
        ]}
      />

      <Wire
        points={[
          cellWidth * 2,
          0,
          cellWidth * 2,
          cellHeight * 2,
        ]}
      />

      {/* horizontal */}
      <Wire
        points={[
          0,
          cellHeight,
          cellWidth * 3,
          cellHeight,
        ]}
      />

      {data.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Text
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * cellWidth}
            y={rowIndex * cellHeight + 6}
            width={cellWidth}
            text={value}
            fontSize={16}
            fontFamily="Arial"
            align="center"
            fill={BLACK}
          />
        ))
      )}
    </Group>
  );
};

export default ProtectionTable;
