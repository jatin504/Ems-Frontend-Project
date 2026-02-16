import { Group, Rect, Text, Circle } from "react-konva";

interface Props {
  x: number;
  y: number;
  label: string;
}

const PLC = ({ x, y, label }: Props) => {
  return (
    <Group x={x} y={y}>
      {/* ================= PLC OUTER BODY (height reduced) ================= */}
      <Rect
        x={0}
        y={0}
        width={110}
        height={120}
        fill="#efefef"
        stroke="black"
        cornerRadius={2}
      />

      {/* ================= TOP MODULE ================= */}
      <Rect x={5} y={5} width={100} height={22} fill="#ffffff" stroke="#aaa" />
      <Text text="CPU" x={10} y={12} fontSize={10} fill="#000" />

      {/* ================= I/O MODULE ================= */}
      <Rect x={5} y={30} width={100} height={22} fill="#f5f5f5" stroke="#aaa" />
      <Text text="I/O" x={10} y={37} fontSize={10} fill="#000" />

      {/* ================= STATUS LED ================= */}
      <Circle x={55} y={60} radius={5} fill="green" />
      <Text
        text="RUN"
        x={40}
        y={67}
        width={30}
        align="center"
        fontSize={9}
      />

      {/* ================= POWER SECTION ================= */}
      <Rect
        x={5}
        y={80}
        width={100}
        height={22}
        fill="#dddddd"
        stroke="#aaa"
      />

      {/* Power switch */}
      <Rect x={15} y={85} width={15} height={10} fill="#b00000" />
      <Text text="PWR" x={40} y={87} fontSize={9} />

      {/* ================= LABEL (outside box) ================= */}
      <Text
        text={label}
        x={0}
        y={125} // below the box
        width={110}
        align="center"
        fontSize={12}
        fill="#000"
      />
    </Group>
  );
};

export default PLC;
