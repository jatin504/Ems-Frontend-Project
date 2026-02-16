import { Group, Rect, Text } from "react-konva";

interface DisplayProps {
  x: number;
  y: number;
}

const Display = ({ x, y }: DisplayProps) => {
  return (
    <Group x={x} y={y}>
      {/* Screen – HEIGHT more increased */}
      <Rect
        width={210}          // same width
        height={100}         // ⬅️ height aur badhayi (80 → 100)
        fill="black"
        cornerRadius={6}
      />

      {/* Text */}
      <Text
        text='55" Display'
        width={210}
        height={100}
        align="center"
        verticalAlign="middle"
        fill="white"
        fontSize={15}
      />

      {/* Stand (further down) */}
      <Rect
        x={95}
        y={100}
        width={20}
        height={18}
        fill="#555"
      />

      {/* Base */}
      <Rect
        x={65}
        y={120}
        width={80}
        height={9}
        fill="#777"
        cornerRadius={3}
      />
    </Group>
  );
};

export default Display;
