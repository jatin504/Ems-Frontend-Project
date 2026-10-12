import React from "react";
import { Group, Circle, Line, Text } from "react-konva";
import { RED, BLUE } from "./ElectricalSymbol";

interface CTCore {
  name: string;
  className: string;
  rating: string;
  spare?: boolean;
}

interface Props {
  x: number;
  y: number;
  cores: CTCore[];
}

export default function CT({ x, y, cores }: Props) {
  return (
    <Group>
      <Text
        x={x - 260}
        y={y - 15}
        text="602-CT - 66 kV, 600/1-1-1-1 A"
        fontSize={15}
        fill={BLUE}
      />

      {cores.map((core, index) => {
        const cy = y + index * 48;

        return (
          <Group key={core.name}>
            {/* CT ring */}
            <Circle
              x={x}
              y={cy}
              radius={8}
              stroke={RED}
              strokeWidth={2}
            />

            <Line
              points={[x + 8, cy, x + 30, cy]}
              stroke={RED}
              strokeWidth={2}
            />

            {core.spare ? (
              <Text
                x={x + 35}
                y={cy - 9}
                text="SPARE"
                fontSize={14}
                fill={BLUE}
              />
            ) : (
              <Text
                x={x - 260}
                y={cy - 10}
                text={`${core.name} - ${core.className}, ${core.rating}`}
                fontSize={14}
                fill={BLUE}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
}
