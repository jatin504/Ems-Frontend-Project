import { Group, Rect, Text, Circle } from "react-konva";

interface ServerProps {
  x: number;
  y: number;
}

const Server = ({ x, y }: ServerProps) => {
  return (
    <Group x={x} y={y}>
      {/* ================= CPU / SERVER TOWER (LEFT SIDE) ================= */}
      <Rect
        x={0}
        y={5}
        width={40}
        height={70}
        fill="#cfe2f3"
        stroke="black"
        cornerRadius={3}
      />
      {/* Status LEDs */}
      <Circle x={20} y={55} radius={3} fill="green" />
      <Circle x={20} y={63} radius={3} fill="orange" />

      {/* ================= MONITOR / FRONT PANEL ================= */}
      <Rect
        x={45}
        y={0}
        width={130}
        height={65}
        fill="#1f1f1f"
        cornerRadius={4}
      />

      {/* Inner panel */}
      <Rect
        x={50}
        y={5}
        width={120}
        height={45}
        fill="#cfe2f3"
        cornerRadius={2}
      />

      {/* Panel text */}
      <Text
        text="Server"
        x={50}
        y={18}
        width={120}
        align="center"
        fontSize={12}
        fill="#000"
        fontStyle="bold"
      />

      {/* ================= STAND ================= */}
      <Rect x={100} y={65} width={20} height={10} fill="#666" />

      <Rect
        x={80}
        y={75}
        width={60}
        height={6}
        fill="#888"
        cornerRadius={2}
      />

      {/* ================= LABEL ================= */}
      <Text
        text="Server"
        x={0}
        y={90}
        width={175}
        align="center"
        fontSize={11}
        fill="#000"
      />
    </Group>
  );
};

export default Server;
