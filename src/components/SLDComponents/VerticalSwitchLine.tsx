import React from "react";
import { Group, Line, Circle, Text } from "react-konva";

interface VerticalSwitchLineProps {
  x: number;
  y: number;
  length?: number;
  horizontalLength?: number;
  textColor?: string;
}

const VerticalSwitchLine: React.FC<VerticalSwitchLineProps> = ({
  x,
  y,
  length = 180,
  horizontalLength = 30,
  textColor = "white"
}) => {
  const halfHorizontal = horizontalLength / 2;

  const crossOffset = 25;
  const crossGap = 10;
  const dotOffset = crossOffset + 20; 
  const arrowOffset = 150;
  const arrowGap = 10;

  const upperLineEnd = crossOffset - crossGap / 2;
  const middleLineStart = crossOffset + crossGap / 2;
  const middleLineEnd = arrowOffset - arrowGap / 2;

  return (
    <Group x={x} y={y}>
      {/* Top T bar */}
      <Line points={[-halfHorizontal, 0, halfHorizontal, 0]} stroke="red" strokeWidth={2} />

      {/* Line from T to X */}
      <Line points={[0, 0, 0, upperLineEnd]} stroke="red" strokeWidth={2} />

      {/* Cross (X) */}
      <Line points={[-6, crossOffset - 6, 6, crossOffset + 6]} stroke="red" strokeWidth={2} />
      <Line points={[-6, crossOffset + 6, 6, crossOffset - 6]} stroke="red" strokeWidth={2} />

      {/* Line from X to arrowhead */}
      <Line points={[0, middleLineStart, 0, middleLineEnd]} stroke="red" strokeWidth={2} />

      {/* Dot slightly below cross */}
      <Circle x={0} y={dotOffset} radius={3} fill="red" />

      {/*Label QA1 to the right of cross/dot */}
      <Text x={10} y={crossOffset} text="QA1" fontSize={14} fill={textColor} />

      {/* Arrowhead */}
      <Line
        points={[0, arrowOffset, -5, arrowOffset - 10, 5, arrowOffset - 10, 0, arrowOffset]}
        closed
        fill="red"
      />
    </Group>
  );
};

export default VerticalSwitchLine;
