import React from "react";
import { Group, Rect, Text } from "react-konva";
import { BUS_GREEN, FONT } from "../electrical/constants";

interface TransformerData {
  [key: string]: string | number;
}

interface DataValueTableProps {
  title: string;
  value: TransformerData;
  x?: number;
  y?: number;
  scale?: number;
  width?: number;
}

const DataValueTable: React.FC<DataValueTableProps> = ({
  title,
  value,
  x = 0,
  y = 0,
  scale = 1,
  width = 150,
}) => {
  const rows = Object.entries(value);

  const titleHeight = 22;
  const rowHeight = 22;
  const padding = 6;

  const height =
    titleHeight +
    rows.length * rowHeight +
    padding;

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >
      {/* MAIN ROUNDED CONTAINER */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        // fill="#ffffff"
        stroke="#999"
        strokeWidth={1}
        cornerRadius={6}
      />

      {/* TITLE */}
      <Text
        x={padding}
        y={5}
        width={width - padding * 2}
        text={title}
        fontSize={12}
        fontStyle="bold"
        fill="#222"
        align="center"
      />

      {/* DATA */}
      {rows.map(([key, val], index) => {
        const rowY =
          titleHeight +
          index * rowHeight;

        return (
          <Group key={key} y={-10}>
            {/* KEY */}
            <Text
              x={padding}
              y={rowY + 4}
              width={width * 0.45}
              text={key}
              fontSize={28}
              fill="#333"
              fontStyle="bold"
              fontFamily={FONT}
            />

            {/* VALUE */}
            <Text
              x={width * 0.45}
              y={rowY + 4}
              width={width * 0.55 - padding}
              text={String(val)}
              fontSize={28}
              fill={BUS_GREEN}
              align="right"
              fontStyle="bold"
              fontFamily={FONT}
            />
          </Group>
        );
      })}
    </Group>
  );
};

export default DataValueTable;
