import { Group, Rect } from "react-konva";
import { RED, BLUE } from "../electrical/constants";
import { Wire } from "./Wire";
import { Dot } from "./Dot";
import { Txt } from "./Txt";
import { ProtectionCircle } from "./ProtectionCircle";


export const TransformerCTPanel = ({
  x,
  y,
  title,
  core1,
  core2,
}: {
  x: number;
  y: number;
  title: string;
  core1: string;
  core2: string;
}) => {
  return (
    <Group>
      {/* Primary CT circuit */}
      <Wire points={[x - 22, y, x + 132, y]} strokeWidth={2.5} />



    </Group>
  );
};
