import { Line } from "react-konva";

interface Props {
  x: number;
  y: number;
}

const HorizontalDashedLines = ({ x, y }: Props) => {
  return (
    <>
      {/* ===== OLD HORIZONTAL LINES (green, locked) ===== */}
      <Line x={913} y={168} points={[0, 0, 300, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={1455} y={204} points={[0, 0, 20, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={1456} y={148} points={[0, 0, 20, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={1456} y={89} points={[0, 0, 20, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={1423} y={148} points={[0, 0, 40, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={1278} y={142} points={[0, 0, 60, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />

      {/* ===== OLD VERTICAL LINE (green, locked) ===== */}
      <Line x={1452} y={88} points={[0, 0, 0, 120]} stroke="green" strokeWidth={1} dash={[6, 4]} />

      {/* ===== GREEN LINES (existing draggable + locked) ===== */}
      <Line x={413} y={317} points={[0, 0, 300, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={811} y={168} points={[0, 0, 60, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />

      <Line
        x={217}
        y={394}
        points={[0, 0, 220, 0]}
        stroke="green"
        strokeWidth={1}
        dash={[6, 4]}
        draggable
        hitStrokeWidth={12}
        onDragEnd={(e) =>
          console.log("Green Horizontal 1:", { x: e.target.x(), y: e.target.y() })
        }
      />

      <Line
        x={180}
        y={383}
        points={[0, 0, 210, 0]}
        stroke="green"
        strokeWidth={1}
        dash={[6, 4]}
        draggable
        hitStrokeWidth={12}
        onDragEnd={(e) =>
          console.log("Green Horizontal 2:", { x: e.target.x(), y: e.target.y() })
        }
      />

      <Line x={438} y={344} points={[0, 0, 370, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />

      <Line x={412} y={318} points={[0, 0, 0, 80]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={709} y={191} points={[0, 0, 0, 130]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={387} y={168} points={[0, 0, 0, 220]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={123} y={344} points={[0, 0, 0, 90]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={157} y={346} points={[0, 0, 0, 90]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={808} y={168} points={[0, 0, 0, 180]} stroke="green" strokeWidth={1} dash={[6, 4]} />

      <Line
        x={209}
        y={407}
        points={[0, 0, 232, 0]}
        stroke="green"
        strokeWidth={1}
        dash={[6, 4]}
        draggable
        hitStrokeWidth={12}
        onDragEnd={(e) =>
          console.log("Green Horizontal Extra:", { x: e.target.x(), y: e.target.y() })
        }
      />

      <Line x={438} y={346} points={[0, 0, 0, 60]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={181} y={388} points={[0, 0, 0, 50]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={194} y={396} points={[0, 0, 0, 50]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={195} y={395} points={[0, 0, 220, 0]} stroke="green" strokeWidth={1} dash={[6, 4]} />
      <Line x={210} y={407} points={[0, 0, 0, 50]} stroke="green" strokeWidth={1} dash={[6, 4]} />

      {/* =====================================================
         🔴 RED DASHED LINES (ALL SEPARATE & DRAGGABLE)
         ===================================================== */}

      {/* ---- RED HORIZONTAL (4) ---- */}
      <Line x={164} y={413} points={[0, 0, 430, 0]} stroke="red" strokeWidth={1} dash={[6, 4]} />
      <Line x={174} y={422} points={[0, 0, 410, 0]} stroke="red" strokeWidth={1} dash={[6, 4]} />
      <Line x={260} y={504} points={[0, 0, 400, 0]} stroke="red" strokeWidth={1} dash={[6, 4]} draggable hitStrokeWidth={12}
        onDragEnd={(e) => console.log("RED H3:", { x: e.target.x(), y: e.target.y() })} />
      <Line x={260} y={526} points={[0, 0, 400, 0]} stroke="red" strokeWidth={1} dash={[6, 4]} draggable hitStrokeWidth={12}
        onDragEnd={(e) => console.log("RED H4:", { x: e.target.x(), y: e.target.y() })} />

      {/* ---- RED SMALL VERTICAL (6) ---- */}
      <Line x={174} y={425} points={[0, 0, 0, 10]} stroke="red" strokeWidth={1} dash={[6, 4]} />
      <Line x={580} y={426} points={[0, 0, 0, 10]} stroke="red" strokeWidth={1} dash={[6, 4]} />
      <Line x={163} y={411} points={[0, 0, 0, 23]} stroke="red" strokeWidth={1} dash={[6, 4]} />
      <Line x={591} y={416} points={[0, 0, 0, 23]} stroke="red" strokeWidth={1} dash={[6, 4]} />
      <Line x={332} y={440} points={[0, 0, 0, 35]} stroke="red" strokeWidth={1} dash={[6, 4]} draggable hitStrokeWidth={12}
        onDragEnd={(e) => console.log("RED V5:", { x: e.target.x(), y: e.target.y() })} />
      <Line x={350} y={440} points={[0, 0, 0, 35]} stroke="red" strokeWidth={1} dash={[6, 4]} draggable hitStrokeWidth={12}
        onDragEnd={(e) => console.log("RED V6:", { x: e.target.x(), y: e.target.y() })} />
    </>
  );
};

export default HorizontalDashedLines;
