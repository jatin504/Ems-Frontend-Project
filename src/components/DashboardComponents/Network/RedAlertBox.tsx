import { Group, Rect, Text, Line } from "react-konva";

interface Props {
  x: number;
  y: number;
}

/* ================= RED ALERT BOX ================= */

const RedAlertBox = ({ x, y }: Props) => {
  const boxW = 58;
  const boxH = 68;

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) =>
        console.log("RedAlertBox:", {
          x: e.target.x(),
          y: e.target.y(),
        })
      }
    >
      {/* Outer red box */}
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        fill="#ff1a1a"
        stroke="black"
      />

      {/* Divider line */}
      <Line points={[0, 30, boxW, 30]} stroke="black" strokeWidth={1} />

      {/* Top text */}
      <Text
        text="Ethernet"
        x={0}
        y={8}
        width={boxW}
        align="center"
        fontSize={9}
        fill="black"
        fontStyle="bold"
      />

      {/* Bottom text */}
      <Text
        text="Micro\nSSD"
        x={0}
        y={36}
        width={boxW}
        align="center"
        fontSize={9}
        fill="black"
        lineHeight={1.1}
      />
    </Group>
  );
};

export default RedAlertBox;

/* ================= GREEN ALERT BOX ================= */

export const GreenAlertBox = () => {
  const boxW = 58;
  const boxH = 68;

  // Locked position at x: 474, y: 499
  return (
    <Group x={474} y={499}>
      {/* Outer green box */}
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        fill="#39ff14"
        stroke="black"
      />

      {/* Divider line */}
      <Line points={[0, 30, boxW, 30]} stroke="black" strokeWidth={1} />

      {/* Top text */}
      <Text
        text="Ethernet"
        x={0}
        y={8}
        width={boxW}
        align="center"
        fontSize={9}
        fill="black"
        fontStyle="bold"
      />

      {/* Bottom text */}
      <Text
        text="Micro\nSSD"
        x={0}
        y={36}
        width={boxW}
        align="center"
        fontSize={9}
        fill="black"
        lineHeight={1.1}
      />
    </Group>
  );
};
