import { Group, Rect } from "react-konva";
import { Wire } from "../Substation1/Wire";

export const BusIsolator = ({
  x,
  y,
  label,
  connected = true,
}: {
  x: number;
  y: number;
  label?: string;
  connected?: boolean;
}) => {
  return (
    <Group>
      {/* White background only when connected */}
      {/* {connected && (
        <Rect
          x={x - 10}
          y={y - 35}
          width={55}
          height={75}
          fill="white"
        />
      )} */}
      <Group
        y={-20}
      >
        {/* <Wire points={[x, y, x, y + 16]} strokeWidth={3} /> */}

        <Wire
          points={[x - 7, y + 62, x + 9, y + 10]}
          strokeWidth={5}
        />

        <Wire points={[x, y + 22, x, y + 48]} strokeWidth={5} />
      </Group>
      {/* <Wire points={[x, y, x + 42, y]} strokeWidth={3} /> */}
    </Group>
  );
};
