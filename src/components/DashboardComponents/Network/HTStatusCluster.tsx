import { Group, Rect, Text } from "react-konva";

interface Props {
  x?: number;
  y?: number;
}

/* =========================================================
   HT STATUS CLUSTER (IMAGE-LIKE LAYOUT)
   ========================================================= */

const HTStatusCluster = () => {
  const boxW = 60;
  const boxH = 48;
  const gap = 6;

  const GreenBox = ({
    label,
    offsetX,
    offsetY,
  }: {
    label: string;
    offsetX: number;
    offsetY: number;
  }) => (
    <Group x={offsetX} y={offsetY}>
      <Rect
        width={boxW}
        height={boxH}
        fill="#39ff14"
        stroke="black"
        cornerRadius={3}
      />
      <Text
        text={label}
        width={boxW}
        height={boxH}
        align="center"
        verticalAlign="middle"
        fontSize={9}
        fill="black"
        fontStyle="bold"
        lineHeight={1.1}
        y={6}
      />
    </Group>
  );

  // Locked position at x: 777, y: 597
  return (
    <Group x={777} y={597}>
      {/* LEFT COLUMN */}
      <GreenBox label={"Aux\nMFM"} offsetX={0} offsetY={0} />
      <GreenBox label={"UPS"} offsetX={0} offsetY={boxH + gap} />

      {/* RIGHT COLUMN */}
      <GreenBox label={"HT\nMFM"} offsetX={boxW + gap} offsetY={0} />
      <GreenBox label={"HT\nRelay"} offsetX={boxW + gap} offsetY={boxH + gap} />
      <GreenBox label={"HT\nAnnun."} offsetX={boxW + gap} offsetY={(boxH + gap) * 2} />
    </Group>
  );
};

export default HTStatusCluster;
