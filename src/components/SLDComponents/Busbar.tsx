import React, { useState } from "react";
import { Group, Line } from "react-konva";

interface BusbarProps {
  points: number[];
  gap?: number;
}

const Busbar: React.FC<BusbarProps> = ({ points, gap = 6 }) => {
  const [position1, setPosition1] = useState({ x: 0, y: 0 });
  const [verticalPos, setVerticalPos] = useState({ x: 195, y: -49 });
  const fixedLine2 = { x: -562, y: 230 };
  const fixedLine3 = { x: -560, y: -48 };

  // Shrink Line 1 from both sides (90px each side)
  const shrinkAmount = 90;
  const shortenedPoints = [...points];
  if (shortenedPoints.length === 4) {
    shortenedPoints[0] += shrinkAmount;
    shortenedPoints[2] -= shrinkAmount;
  }

  const extendedPoints2 = [...points];
  if (extendedPoints2.length === 4) {
    extendedPoints2[2] += 190;
  }

  const extendedPoints3 = [...points];
  if (extendedPoints3.length === 4) {
    extendedPoints3[2] += 255;
  }

  const handleDragEnd1 = (e: any) => {
    const newX = Math.round(e.target.x());
    const newY = Math.round(e.target.y());
    setPosition1({ x: newX, y: newY });
    console.log("Busbar Line 1 dragged to:", { x: newX, y: newY });
  };

  const handleVerticalDragEnd = (e: any) => {
    const newX = Math.round(e.target.x());
    const newY = Math.round(e.target.y());
    setVerticalPos({ x: newX, y: newY });
    console.log("Vertical line dragged to:", { x: newX, y: newY });
  };

  return (
    <>
      {/* Line 1 — Draggable */}
      <Group
        x={position1.x}
        y={position1.y}
        draggable
        onDragEnd={handleDragEnd1}
      >
        <Line
          points={shortenedPoints}
          stroke="red"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      </Group>

      {/* Line 2 — Fixed */}
      <Group x={fixedLine2.x} y={fixedLine2.y}>
        <Line
          points={extendedPoints2}
          stroke="red"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      </Group>

      {/* Line 3 — Fixed */}
      <Group x={fixedLine3.x} y={fixedLine3.y}>
        <Line
          points={extendedPoints3}
          stroke="red"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      </Group>

      {/* New draggable vertical line */}
      {/* New draggable vertical line */}
<Group
  x={verticalPos.x}
  y={verticalPos.y}
  draggable
  onDragEnd={handleVerticalDragEnd}
>
  <Line points={[0, 0, 0, 50]} stroke="red" strokeWidth={2} />
</Group>

    </>
  );
};

export default Busbar;
