import { Group, Circle } from "react-konva";
import { RED } from "../electrical/constants";
import { Txt } from "./Txt";


export const Relay = ({
  x,
  y,
  text,
  radius = 10,
}: {
  x: number;
  y: number;
  text: string;
  radius?: number;
}) => (
  <Group>
    <Circle
      x={x}
      y={y}
      radius={radius}
      stroke={RED}
      strokeWidth={1.8}
    />

    <Txt
      x={x - radius}
      y={y - 4}
      width={radius * 2}
      text={text}
      fontSize={7}
      fill={RED}
      align="center"
      bold
    />
  </Group>
);
