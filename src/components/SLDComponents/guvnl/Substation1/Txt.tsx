import { Text } from "react-konva";
import { BLUE, FONT } from "../electrical/constants";

interface TxtProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fill?: string;
  width?: number;
  align?: "left" | "center" | "right";
  bold?: boolean;
  rotation?: number;
}

export const Txt = ({
  x,
  y,
  text,
  fontSize = 14,
  fill = BLUE,
  width,
  align = "left",
  bold = false,
  rotation = 0,
}: TxtProps) => (
  <Text
    x={x}
    y={y}
    text={text}
    width={width}
    fontSize={fontSize}
    fontFamily={FONT}
    fontStyle={bold ? "bold" : "normal"}
    fill={fill}
    align={align}
    rotation={rotation}
    lineHeight={1.05}
  />
);
