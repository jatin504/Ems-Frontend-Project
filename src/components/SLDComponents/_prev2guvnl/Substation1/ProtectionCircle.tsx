import { Group, Circle } from "react-konva";
import { RED } from "../electrical/constants";
import { Txt } from "./Txt";

interface Props {
  x: number;
  y: number;
  text: string;
}

export const ProtectionCircle = ({ x, y, text }: Props) => (
  <Group>
    <Circle
      x={x}
      y={y}
      radius={11}
      stroke={RED}
      strokeWidth={1.8}
      fill="#fff"
    />

    <Txt
      x={x - 11}
      y={y - 4}
      width={22}
      text={text}
      fontSize={7}
      fill={RED}
      align="center"
      bold
    />
  </Group>
);
