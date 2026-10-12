import { Group, Circle } from "react-konva";
import { RED } from "../electrical/constants";
import { Txt } from "./Txt";


export const CTCore = ({
  x,
  y,
  number,
}: {
  x: number;
  y: number;
  number?: string;
}) => {
  return (
    <Group>
      <Circle
        x={x}
        y={y}
        radius={10}
        stroke={RED}
        strokeWidth={2}
      />

      <Circle
        x={x}
        y={y}
        radius={5}
        stroke={RED}
        strokeWidth={1}
      />

      {number && (
        <Txt
          x={x - 7}
          y={y - 4}
          text={number}
          fontSize={7}
          fill={RED}
          width={14}
          align="center"
        />
      )}
    </Group>
  );
};
