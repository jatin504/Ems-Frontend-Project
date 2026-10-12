import React from "react";
import {
  Group,
  Rect,
  Circle,
  Text,
} from "react-konva";

interface ProtectionFunctionsProps {
  x: number;
  y: number;
}

const ProtectionFunctions: React.FC<
  ProtectionFunctionsProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      width={50}
      height={30}
      cornerRadius={15}
      stroke="#222"
      fill="#fff"
    />

    <Circle
      x={13}
      y={15}
      radius={10}
      stroke="#222"
      fill="#fff"
    />

    <Circle
      x={37}
      y={15}
      radius={10}
      stroke="#222"
      fill="#fff"
    />

    <Text
      x={5}
      y={8}
      text="27"
      fontSize={12}
      fill="#0000ff"
    />

    <Text
      x={29}
      y={8}
      text="59"
      fontSize={12}
      fill="#0000ff"
    />
  </Group>
);

export default ProtectionFunctions;
