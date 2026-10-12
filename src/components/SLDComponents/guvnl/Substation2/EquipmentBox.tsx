import React from "react";
import { Group, Rect, Text } from "react-konva";
import { RED } from "../electrical/constants";

interface Props {
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
}

const EquipmentBox: React.FC<Props> = ({
  x,
  y,
  width = 25,
  height = 10,
  text,
}) => (
  <Group x={x} y={y}>
    <Rect
      width={width}
      height={height}
      fill="#fff"
      stroke={RED}
      strokeWidth={2}
    />

    {text && (
      <Text
        x={2}
        y={1}
        text={text}
        fontSize={7}
        fill="#0000ff"
        fontFamily="Arial"
      />
    )}
  </Group>
);

export default EquipmentBox;
