import { Group, Rect, Text } from "react-konva";

interface Props {
  x?: number;
  y?: number;
}

/* =========================================================
   1️⃣ EXISTING MAIN STACK (LOCKED – AS IT IS)
   ========================================================= */

const LOCKED_X = 25;
const LOCKED_Y = 588;

const StatusIndicatorStack = ({ x = LOCKED_X, y = LOCKED_Y }: Props) => {
  const items = [
    { label: "Twin 16P1 - Relay", color: "#e53935" },
    { label: "Twin 16P2 - BCU", color: "#43a047" },
    { label: "Twin 16P3 - Relay", color: "#e53935" },
    { label: "Twin 16P4 - Relay", color: "#e53935" },
    { label: "Twin 16P5 - BCU", color: "#43a047" },
  ];

  return (
    <Group x={x} y={y}>
      {items.map((item, index) => (
        <Group key={index} y={index * 22}>
          <Rect width={120} height={18} fill={item.color} cornerRadius={3} />
          <Text
            text={item.label}
            fontSize={10}
            fill="white"
            x={6}
            y={4}
            fontStyle="bold"
            width={120}
          />
        </Group>
      ))}
    </Group>
  );
};

export default StatusIndicatorStack;

/* =========================================================
   2️⃣ RED STACK – 2 BOXES (LOCKED)
   ========================================================= */

export const StatusIndicatorStack_RED2 = () => {
  const items = [
    { label: "Battery Charger", color: "#e53935" },
    { label: "UPS", color: "#e53935" },
  ];

  const WIDTH = 90;
  const LOCKED_X = 310;
  const LOCKED_Y = 625;

  return (
    <Group x={LOCKED_X} y={LOCKED_Y}>
      {items.map((item, index) => (
        <Group key={index} y={index * 22}>
          <Rect width={WIDTH} height={18} fill={item.color} cornerRadius={3} />
          <Text
            text={item.label}
            fontSize={9}
            fill="white"
            x={4}
            y={4}
            fontStyle="bold"
            width={WIDTH}
          />
        </Group>
      ))}
    </Group>
  );
};

/* =========================================================
   3️⃣ GREEN STACK – 3 BOXES (LOCKED)
   ========================================================= */

export const StatusIndicatorStack_GREEN3 = () => {
  const items = [
    { label: "Twin 16P1 - MFM", color: "#43a047" },
    { label: "Twin 16P2 - MFM", color: "#43a047" },
    { label: "Twin 16P3 - MFM", color: "#43a047" },
  ];

  const WIDTH = 90;
  const LOCKED_X = 366;
  const LOCKED_Y = 690;

  return (
    <Group x={LOCKED_X} y={LOCKED_Y}>
      {items.map((item, index) => (
        <Group key={index} y={index * 22}>
          <Rect width={WIDTH} height={18} fill={item.color} cornerRadius={3} />
          <Text
            text={item.label}
            fontSize={9}
            fill="black"
            x={4}
            y={4}
            fontStyle="bold"
            width={WIDTH}
          />
        </Group>
      ))}
    </Group>
  );
};

/* =========================================================
   4️⃣ SMB GRID – DRAGGABLE (2 COLUMNS × 8 ROWS)
   ========================================================= */

export const StatusIndicatorSMBGrid = () => {
  const boxW = 72;
  const boxH = 18;
  const colGap = 6;
  const rowGap = 4;

  const leftColumn = Array.from({ length: 8 }).map(
    (_, i) => `Inv 1 SMB ${i + 1}`
  );
  const rightColumn = Array.from({ length: 8 }).map(
    (_, i) => `Inv 2 SMB ${i + 1}`
  );

  const renderBox = (
    label: string,
    offsetX: number,
    offsetY: number
  ) => (
    <Group x={offsetX} y={offsetY}>
      <Rect
        width={boxW}
        height={boxH}
        fill="#39ff14"
        stroke="black"
        cornerRadius={2}
      />
      <Text
        text={label}
        fontSize={9}
        fill="black"
        align="center"
        width={boxW}
        y={3}
        fontStyle="bold"
      />
    </Group>
  );

  // Locked position at x: 485, y: 596
  return (
    <Group x={485} y={596}>
      {leftColumn.map((label, i) =>
        renderBox(label, 0, i * (boxH + rowGap))
      )}
      {rightColumn.map((label, i) =>
        renderBox(
          label,
          boxW + colGap,
          i * (boxH + rowGap)
        )
      )}
    </Group>
  );
};
