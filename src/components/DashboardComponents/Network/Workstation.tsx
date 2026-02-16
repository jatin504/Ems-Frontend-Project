import { Group, Rect, Text, Circle } from "react-konva";

interface WorkstationProps {
  x: number;
  y: number;
}

const Workstation = ({ x, y }: WorkstationProps) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        console.log("Workstation new position:", { x: newX, y: newY });
      }}
    >
      {/* ================= CPU (LEFT SIDE) ================= */}
      <Rect
        x={-45}
        y={10}
        width={35}
        height={60}
        fill="#c9daf8"
        stroke="black"
        cornerRadius={3}
      />

      {/* Power button */}
      <Circle x={-27} y={55} radius={3} fill="green" />

      {/* ================= MONITOR ================= */}
      <Rect
        x={0}
        y={0}
        width={130}
        height={65}
        fill="#1f1f1f"
        cornerRadius={4}
      />

      {/* Screen inner area */}
      <Rect
        x={5}
        y={5}
        width={120}
        height={45}
        fill="#ddebf7"
        cornerRadius={2}
      />

      {/* Screen label */}
      <Text
        text="SCADA Operator"
        x={5}
        y={18}
        width={120}
        align="center"
        fontSize={11}
        fill="#000"
        fontStyle="bold"
      />

      {/* ================= MONITOR STAND ================= */}
      <Rect x={55} y={65} width={20} height={10} fill="#666" />

      <Rect
        x={35}
        y={75}
        width={60}
        height={6}
        fill="#888"
        cornerRadius={2}
      />

      {/* ================= LABEL ================= */}
      <Text
        text="Workstation"
        x={-45}
        y={90}
        width={180}
        align="center"
        fontSize={11}
        fill="#000"
      />
    </Group>
  );
};

export default Workstation;
