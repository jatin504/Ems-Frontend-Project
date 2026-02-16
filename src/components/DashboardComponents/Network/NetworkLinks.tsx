import { Line, Group } from "react-konva";

/* ================= LOCKED VERTICAL LINES ================= */
const lockedVerticalLines = [
  { x: 100, y: 478, length: 110 },
  { x: 153, y: 477, length: 140 },
  { x: 161, y: 479, length: 160 },
  { x: 168, y: 479, length: 180 },
  { x: 176, y: 479, length: 200 },
  { x: 184, y: 479, length: 230 },
];

/* ================= LOCKED HORIZONTAL LINES ================= */
const lockedHorizontalLines = [
  { x: 148, y: 618, length: 5 },
  { x: 146, y: 639, length: 15 },
  { x: 147, y: 660, length: 21 },
  { x: 147, y: 679, length: 29 },
  { x: 64,  y: 709, length: 120 },
];

/* ================= LOCKED EXTRA VERTICAL LINES ================= */
// 1 Green + 2 Purple (FINAL POSITIONS)
const lockedExtraVerticals = [
  { x: 64,  y: 710, length: 30,  color: "#39ff14" }, // 🟢 Green
  { x: 354, y: 567, length: 90,  color: "#8e44ad" }, // 🟣 Purple
  { x: 416, y: 566, length: 180, color: "#8e44ad" }, // 🟣 Purple
];

const NetworkLinks = () => {
  return (
    <Group>
      {/* ================= LOCKED GREEN VERTICAL LINES ================= */}
      {lockedVerticalLines.map((line, idx) => (
        <Line
          key={`locked-vert-${idx}`}
          points={[0, 0, 0, line.length]}
          x={line.x}
          y={line.y}
          stroke="#39ff14"
          strokeWidth={1}
        />
      ))}

      {/* ================= LOCKED GREEN HORIZONTAL LINES ================= */}
      {lockedHorizontalLines.map((line, idx) => (
        <Line
          key={`locked-horiz-${idx}`}
          points={[0, 0, line.length, 0]}
          x={line.x}
          y={line.y}
          stroke="#39ff14"
          strokeWidth={1}
        />
      ))}

      {/* ================= LOCKED EXTRA VERTICAL LINES ================= */}
      {lockedExtraVerticals.map((line, idx) => (
        <Line
          key={`locked-extra-vert-${idx}`}
          points={[0, 0, 0, line.length]}
          x={line.x}
          y={line.y}
          stroke={line.color}
          strokeWidth={1}
        />
      ))}
    </Group>
  );
};

export default NetworkLinks;
