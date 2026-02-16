import { Group, Circle, Text } from "react-konva";

interface InternetCloudProps {
  x: number;
  y: number;
}

const InternetCloud = ({ x, y }: InternetCloudProps) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        console.log("InternetCloud new position:", { x: newX, y: newY });
      }}
    >
      {/* Cloud shape (multiple circles) */}
      <Circle x={30} y={25} radius={22} fill="#d9d9d9" />
      <Circle x={55} y={18} radius={26} fill="#d9d9d9" />
      <Circle x={85} y={25} radius={22} fill="#d9d9d9" />
      <Circle x={55} y={35} radius={28} fill="#d9d9d9" />

      {/* Label */}
      <Text
        text="Internet"
        x={0}
        y={65}
        width={110}
        align="center"
        fontSize={12}
        fill="#000"
      />
    </Group>
  );
};

export default InternetCloud;
