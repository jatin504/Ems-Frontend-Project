import { Group, Line, Text } from "react-konva";

const BatteryLine = () => {
    const topY = 70;
  const midY = 105;
  const bottomY = 210;
  const symbolGap = 7;
  const x = 8;
  const symbolTop = 10;
    return (
      <Group x={300} y={100} key={'1'}>
        <Line points={[x, topY, x, midY]} stroke="red" strokeWidth={2.8} />
        <Line
          points={[x - 8, midY, x + 8, midY]}
          stroke="red"
          strokeWidth={2.8}
        />
        <Line
          points={[x, midY, x, symbolTop - 9]}
          stroke="red"
          strokeWidth={2.8}
        />
        <Line
          points={[x - 10, symbolTop, x + 10, symbolTop]}
          stroke="red"
          strokeWidth={3.5}
        />
        <Line
          points={[x - 5, symbolTop + symbolGap, x + 5, symbolTop + symbolGap]}
          stroke="blue"
          strokeWidth={1.8}
        />
        <Line
          points={[
            x - 10,
            symbolTop + symbolGap * 2,
            x + 10,
            symbolTop + symbolGap * 2,
          ]}
          stroke="red"
          strokeWidth={3.5}
        />
        <Line
          points={[
            x - 5,
            symbolTop + symbolGap * 3,
            x + 5,
            symbolTop + symbolGap * 3,
          ]}
          stroke="blue"
          strokeWidth={1.8}
        />
        <Line
          points={[x, symbolTop + symbolGap * 3, x, bottomY]}
          stroke="blue"
          strokeWidth={2.8}
        />

        <Text text="SW1" x={x + 10} y={midY - 12} fontSize={10} fill="white" />
        <Text
          text="BAT01"
          x={x + 10}
          y={symbolTop + symbolGap * 3 + 6}
          fontSize={10}
          fill="white"
        />
        <Text
          text="STR01 ZAKIR"
          x={x - 18}
          y={bottomY + 6}
          fontSize={10}
          fill="#B3B3B3"
        />
        <Text
          text="645.10 V"
          x={x - 22}
          y={bottomY + 20}
          fontSize={10}
          fill="orange"
        />
        {/* <Text
          text={0 === 9 ? "10.00 A" : "0.00 A"}
          x={x - 22}
          y={bottomY + 34}
          fontSize={10}
          fill="orange"
        /> */}
      </Group>
    );
}


export default BatteryLine;