import { Group, Rect } from "react-konva";
import { Wire } from "./Wire";
import { RED } from "../electrical/constants";

export const SmallTable = ({
  x,
  y,
  width,
  height,
  rows,
  cols,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
}) => {
  const rowH = height / rows;
  const colW = width / cols;

  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={RED}
        strokeWidth={2}
      />

      {Array.from({ length: rows - 1 }).map((_, i) => (
        <Wire
          key={`r-${i}`}
          points={[
            x,
            y + rowH * (i + 1),
            x + width,
            y + rowH * (i + 1),
          ]}
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Wire
          key={`c-${i}`}
          points={[
            x + colW * (i + 1),
            y,
            x + colW * (i + 1),
            y + height,
          ]}
          strokeWidth={1}
        />
      ))}
    </Group>
  );
};
