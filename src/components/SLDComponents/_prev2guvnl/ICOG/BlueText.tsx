import React from "react";
import { Text } from "react-konva";
import { Blue, FONT } from "../electrical/constants";

interface BlueTextProps
  extends Omit<any, "text"> {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
}

const BlueText: React.FC<BlueTextProps> = ({
  x,
  y,
  text,
  fontSize = 14,
  ...props
}) => (
  <Text
    x={x}
    y={y}
    text={text}
    fontSize={fontSize}
    fill={Blue}
    fontFamily={FONT}
    fontStyle="bold"
    {...props}
  />
);

export default BlueText;
