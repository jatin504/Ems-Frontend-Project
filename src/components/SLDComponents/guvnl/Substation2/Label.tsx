import React from "react";
import { Text } from "react-konva";

interface LabelProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fill?: string;
  width?: number;
  align?: "left" | "center" | "right";
  fontStyle?: string;
}

const Label: React.FC<LabelProps> = ({
  x,
  y,
  text,
  fontSize = 13,
  fill = "#111",
  width,
  align = "left",
  fontStyle,
}) => (
  <Text
    x={x}
    y={y}
    text={text}
    fontSize={fontSize}
    fill={fill}
    width={width}
    align={align}
    fontStyle={fontStyle}
    fontFamily="Arial"
  />
);

export default Label;
