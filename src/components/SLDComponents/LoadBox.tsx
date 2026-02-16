import React from "react";
import { Group, Rect, Text } from "react-konva";

interface LoadBoxProps {
  label: string;
  textColor?: string;
}

const LoadBox: React.FC<LoadBoxProps> = ({ label, textColor = "white" }) => {
  const width = 60;
  const height = 25;

  return (
    <Group>
      <Rect
        width={width}
        height={height}
        stroke={textColor}
        strokeWidth={1}
        cornerRadius={3}
      />
      <Text
        text={label}
        fill={textColor}
        fontSize={12}
        align="center"
        width={width}
        height={height}
        verticalAlign="middle"
      />
    </Group>
  );
};

export default LoadBox;
