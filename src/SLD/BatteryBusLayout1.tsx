import React from "react";
import { Group, Line, Text } from "react-konva";

interface BatteryBusLayoutProps {
  flipHorizontal?: boolean;
  data? : any;
  textColor?: string;
}

const BatteryBusLayout: React.FC<BatteryBusLayoutProps> = ({
  flipHorizontal = false,
  data,
  textColor = "white"
}) => {
  const batteryCount = 10;

  const topY = 70;
  const midY = 105;
  const batteryY = 140;
  const bottomY = 210;
  const startX = 70;
  const gap = 60;
  const symbolGap = 7;

  const pos = { x: 0, y: 369 };

  return (
    <Group x={pos.x} y={pos.y}>
      <Text
        text="Bank 01"
        x={startX - 15}
        y={topY - 50}
        fontSize={16}
        fill={textColor}
      />

      <Line
        points={[startX - 15, topY, startX + gap * (batteryCount - 1) + 15, topY]}
        stroke="red"
        strokeWidth={3.2}
      />

      <Line
        points={[startX - 15, bottomY, startX + gap * (batteryCount - 1) + 15, bottomY]}
        stroke="blue"
        strokeWidth={3.2}
      />

      {Array.from({ length: batteryCount }).map((_, i) => {
        const index = flipHorizontal ? batteryCount - 1 - i : i;
        const x = startX + index * gap;
        const symbolTop = batteryY;

        return (
          <Group key={i}>
            <Line points={[x, topY, x, midY]} stroke="red" strokeWidth={2.8} />
            {/* <Line points={[x - 8, midY, x + 8, midY]} stroke="red" strokeWidth={2.8} /> */}
            <Line points={[x, midY, x, symbolTop - 9]} stroke="red" strokeWidth={2.8} />
            <Line points={[x - 10, symbolTop, x + 10, symbolTop]} stroke="red" strokeWidth={3.5} />
            <Line points={[x - 5, symbolTop + symbolGap, x + 5, symbolTop + symbolGap]} stroke="blue" strokeWidth={1.8} />
            <Line points={[x - 10, symbolTop + symbolGap * 2, x + 10, symbolTop + symbolGap * 2]} stroke="red" strokeWidth={3.5} />
            <Line points={[x - 5, symbolTop + symbolGap * 3, x + 5, symbolTop + symbolGap * 3]} stroke="blue" strokeWidth={1.8} />
            <Line points={[x, symbolTop + symbolGap * 3, x, bottomY]} stroke="blue" strokeWidth={2.8} />

            <Text text="SW1" x={x + 10} y={midY - 12} fontSize={10} fill={textColor} />
            <Text text="BAT01" x={x + 10} y={symbolTop + symbolGap * 3 + 6} fontSize={10} fill={textColor} />
            <Text text="STR01" x={x - 18} y={bottomY + 6} fontSize={10} fill={textColor} />
            <Text
  text={(data ? data.Container_status_2?.value : 0) + " %"}
  x={x - 18}
  y={bottomY + 20}
  fontSize={10}
  fill="orange"
/>

<Text
  text={(data ? data.Battery_cabin_temperature_1?.value : 0) + " kW"}
  x={x - 18}
  y={bottomY + 34}
  fontSize={10}
  fill="orange"
/>

          </Group>
        );
      })}
    </Group>
  );
};

export default BatteryBusLayout;
