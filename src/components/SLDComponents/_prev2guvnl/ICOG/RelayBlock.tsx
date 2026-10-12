import React from "react";
import {
  Group,
  Rect,
  Line,
  Text,
} from "react-konva";

interface RelayBlockProps {
  x: number;
  y: number;
}

const RelayBlock: React.FC<
  RelayBlockProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      x={0}
      y={0}
      width={60}
      height={36}
      stroke="#222"
      strokeWidth={1}
      fill="#fff"
    />

    <Line
      points={[30, 0, 30, 36]}
      stroke="#222"
    />

    <Text
      x={5}
      y={7}
      text="50"
      fontSize={14}
      fill="#222"
    />

    <Text
      x={35}
      y={7}
      text="50N"
      fontSize={14}
      fill="#222"
    />

    <Text
      x={5}
      y={22}
      text="51"
      fontSize={14}
      fill="#222"
    />

    <Text
      x={35}
      y={22}
      text="51N"
      fontSize={14}
      fill="#222"
    />
  </Group>
);

export default RelayBlock;
