import { Group, Rect, Text, Line } from "react-konva";

interface Props {
  x?: number;
  y?: number;
}

const LOCKED_X = 21;
const LOCKED_Y = 742;

const GreenInfoQuad = ({ x = LOCKED_X, y = LOCKED_Y }: Props) => {
  const items = [
    { line1: "40 MVA", line2: "132KV", line3: "MFM" },
    { line1: "40 MVA", line2: "33KV",  line3: "MFM" },
    { line1: "25 MVA", line2: "132KV", line3: "MFM" },
    { line1: "25 MVA", line2: "33KV",  line3: "MFM" },
  ];

  const boxWidth = 64;
  const boxHeight = 42;
  const gap = 6;
  const totalWidth = items.length * boxWidth + (items.length - 1) * gap;

  return (
    <Group x={x} y={y}>
      {/* ===== SINGLE HORIZONTAL CONNECTING LINE ===== */}
      <Line
        points={[
          boxWidth / 2,
          boxHeight / 2,
          totalWidth - boxWidth / 2,
          boxHeight / 2,
        ]}
        stroke="#1b5e20"
        strokeWidth={2}
      />

      {/* ===== GREEN BOXES ===== */}
      {items.map((item, index) => (
        <Group key={index} x={index * (boxWidth + gap)}>
          <Rect
            width={boxWidth}
            height={boxHeight}
            fill="#39b54a"
            cornerRadius={4}
          />

          <Text
            text={item.line1}
            fontSize={10}
            fill="black"
            fontStyle="bold"
            x={6}
            y={4}
          />

          <Text
            text={item.line2}
            fontSize={9}
            fill="black"
            x={6}
            y={18}
          />

          <Text
            text={item.line3}
            fontSize={9}
            fill="black"
            x={6}
            y={30}
          />
        </Group>
      ))}
    </Group>
  );
};

export default GreenInfoQuad;
