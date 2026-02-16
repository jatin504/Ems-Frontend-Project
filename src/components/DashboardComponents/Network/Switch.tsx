import { Group, Rect, Text } from "react-konva";

const Switch = ({ x, y }: { x: number; y: number }) => (
  <Group x={x} y={y}>
    <Rect width={80} height={40} fill="#b6d7a8" stroke="black" />
    <Text text="Switch" width={80} align="center" y={12} fontSize={12} />
  </Group>
);

export default Switch;
