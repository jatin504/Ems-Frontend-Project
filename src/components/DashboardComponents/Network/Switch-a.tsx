import { Group, Rect, Circle } from "react-konva";

/* ================= COMMON SWITCH BODY ================= */
const SwitchBody = () => {
  const ports = 4;
  const portGap = 28;

  return (
    <>
      {/* SWITCH BODY */}
      <Rect
        x={0}
        y={0}
        width={140}
        height={40}
        fill="#7b8ce3"
        stroke="#4b5bb3"
        cornerRadius={4}
      />

      {/* FRONT PANEL */}
      <Rect
        x={10}
        y={10}
        width={120}
        height={20}
        fill="#2f2f2f"
        cornerRadius={2}
      />

      {/* PORTS */}
      {Array.from({ length: ports }).map((_, i) => (
        <Rect
          key={i}
          x={14 + i * portGap}
          y={13}
          width={10}
          height={14}
          fill="#d9d9d9"
          stroke="#555"
        />
      ))}

      {/* STATUS LED */}
      <Circle x={10} y={6} radius={3} fill="#00ff66" />
    </>
  );
};

/* ================= REUSABLE SWITCH ================= */

interface SwitchProps {
  x: number;
  y: number;
  name: string;
}

const Switch = ({ x, y, name }: SwitchProps) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) =>
        console.log(`${name} position:`, {
          x: e.target.x(),
          y: e.target.y(),
        })
      }
    >
      <SwitchBody />
    </Group>
  );
};

export default Switch;
