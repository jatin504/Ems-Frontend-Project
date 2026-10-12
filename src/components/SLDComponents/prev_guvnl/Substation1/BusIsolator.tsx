import { Group } from "react-konva";
import { Wire } from "./Wire";
import { Dot } from "./Dot";


export const BusIsolator = ({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label?: string;
}) => {
  return (
    <Group>
      <Wire points={[x, y, x + 42, y]} strokeWidth={3} />

      <Dot x={x + 3} y={y} r={3} />
      <Dot x={x + 12} y={y} r={3} />
      <Dot x={x + 21} y={y} r={3} />

      <Wire points={[x, y, x, y + 16]} strokeWidth={3} />

      <Wire
        points={[x - 7, y + 20, x + 9, y + 5]}
        strokeWidth={3}
      />

      <Dot x={x - 7} y={y + 20} r={2.5} />

      <Wire points={[x, y + 22, x, y + 48]} strokeWidth={3} />
    </Group>
  );
};