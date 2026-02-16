import { Group, Rect, Text, Line } from "react-konva";

interface Props {
  x: number;
  y: number;
}

/* =========================================================
   COMMON SPD BOX
   ========================================================= */

const SPDBox = ({ offsetX }: { offsetX: number }) => {
  const boxW = 58;
  const boxH = 48;
  const baseH = 20;

  return (
    <Group x={offsetX}>
      {/* TOP GREEN SPD */}
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        fill="#39ff14"
        stroke="black"
      />

      {/* Diagonal line */}
      <Line
        points={[2, boxH - 2, boxW - 2, 2]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Text */}
      <Text
        text={"Upper\nnα\nnS\n4kA"}
        x={2}
        y={4}
        width={boxW - 4}
        align="center"
        fontSize={9}
        fill="black"
        lineHeight={1.05}
      />

      {/* Bottom base */}
      <Rect
        x={0}
        y={boxH}
        width={boxW}
        height={baseH}
        fill="#bfbfbf"
        stroke="black"
      />

      <Text
        text="SPD"
        x={0}
        y={boxH + 4}
        width={boxW}
        align="center"
        fontSize={10}
        fill="black"
        fontStyle="bold"
      />
    </Group>
  );
};

/* =========================================================
   1️⃣ SPD TRIPLET (3 BOXES) – DEFAULT EXPORT
   ========================================================= */

const SPDTriplet = ({ x, y }: Props) => {
  const boxW = 58;
  const gap = 4;

  return (
    <Group x={x} y={y}>
      <SPDBox offsetX={0} />
      <SPDBox offsetX={boxW + gap} />
      <SPDBox offsetX={(boxW + gap) * 2} />
    </Group>
  );
};

export default SPDTriplet;

/* =========================================================
   2️⃣ SPD SIX (6 BOXES) – NAMED EXPORT
   ========================================================= */

export const SPDSixExact = ({ x, y }: Props) => {
  const boxW = 58;
  const gap = 4;

  // Lock position at x: 549, y: 497
  return (
    <Group x={535} y={497}>
      <SPDBox offsetX={0 * (boxW + gap)} />
      <SPDBox offsetX={1 * (boxW + gap)} />
      <SPDBox offsetX={2 * (boxW + gap)} />
      <SPDBox offsetX={3 * (boxW + gap)} />
      <SPDBox offsetX={4 * (boxW + gap)} />
      <SPDBox offsetX={5 * (boxW + gap)} />
    </Group>
  );
};
