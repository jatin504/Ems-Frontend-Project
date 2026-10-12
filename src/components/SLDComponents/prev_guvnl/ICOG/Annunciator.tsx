import React from "react";
import {
  Group,
  Rect,
  Line,
  Text,
} from "react-konva";

import BlueText from "./BlueText";
import { Blue } from "../electrical/constants";

interface AnnunciatorProps {
  x: number;
  y: number;
}

const Annunciator: React.FC<
  AnnunciatorProps
> = ({ x, y }) => {
  const numbers = [
    "8",
    "7",
    "6",
    "5",
    "1",
    "2",
    "3",
    "4",
  ];

  return (
    <Group x={x} y={y}>
      <BlueText
        x={0}
        y={-25}
        text="RS 485"
      />

      <Rect
        width={80}
        height={40}
        stroke="#222"
        fill="#fff"
      />

      {numbers.map((n, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        return (
          <Group key={n}>
            <Text
              x={col * 20 + 6}
              y={row * 20 + 2}
              text={n}
              fontSize={13}
              fill={Blue}
            />

            {col > 0 && (
              <Line
                points={[
                  col * 20,
                  row * 20,
                  col * 20,
                  row * 20 + 20,
                ]}
                stroke="#222"
              />
            )}
          </Group>
        );
      })}

      <Line
        points={[0, 20, 80, 20]}
        stroke="#222"
      />

      <BlueText
        x={0}
        y={48}
        text="ANNUNCIATOR"
        fontSize={12}
      />

      <BlueText
        x={0}
        y={65}
        text="8 WINDOW"
        fontSize={12}
      />
    </Group>
  );
};

export default Annunciator;
