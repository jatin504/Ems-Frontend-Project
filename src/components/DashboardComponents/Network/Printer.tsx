import { Group, Rect, Text, Line } from "react-konva";

interface PrinterProps {
  x: number;
  y: number;
}

const Printer = ({ x, y }: PrinterProps) => {
  return (
    <Group x={x} y={y}>
      {/* ================= PRINTER TOP (BLACK BODY) ================= */}
      <Rect
        x={0}
        y={0}
        width={120}
        height={45}
        fill="#2b2b2b"
        cornerRadius={4}
      />

      {/* ================= PAPER COMING OUT ================= */}
      <Rect
        x={30}
        y={35}
        width={60}
        height={35}
        fill="#ffffff"
        stroke="#b7b7b7"
      />

      {/* Paper lines */}
      <Line points={[35, 45, 85, 45]} stroke="#c0c0c0" />
      <Line points={[35, 52, 85, 52]} stroke="#c0c0c0" />
      <Line points={[35, 59, 85, 59]} stroke="#c0c0c0" />

      {/* ================= PRINTER BASE ================= */}
      <Rect
        x={15}
        y={30}
        width={90}
        height={20}
        fill="#1f1f1f"
        cornerRadius={3}
      />

      {/* ================= LABEL ================= */}
      <Text
        text="Printer"
        x={0}
        y={75}
        width={120}
        align="center"
        fontSize={12}
        fill="#000"
      />
    </Group>
  );
};

export default Printer;
