import { Group, Rect, Text, Line, Circle } from "react-konva";

interface ModemProps {
  x: number;
  y: number;
}

const Modem = ({ x, y }: ModemProps) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        console.log("Modem new position:", { x: newX, y: newY });
      }}
    >
      {/* Modem body */}
      <Rect
        x={0}
        y={20}
        width={90}
        height={30}
        fill="#1f1f1f"
        cornerRadius={3}
      />

      {/* Front LED */}
      <Circle x={15} y={35} radius={3} fill="green" />

      {/* Antenna */}
      <Line points={[70, 20, 70, 0]} stroke="black" strokeWidth={3} />

      {/* Label */}
      <Text
        text="Modem"
        x={0}
        y={60}
        width={90}
        align="center"
        fontSize={12}
        fill="#000"
      />
    </Group>
  );
};

export default Modem;
