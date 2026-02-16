import { 
  Box,
  Text,
  Badge,
  VStack,
  HStack,
  Circle,
  Flex,
} from "@chakra-ui/react";
import {
  Stage,
  Layer,
  Group,
  Rect,
  Line,
  Circle as KonvaCircle,
  Text as KonvaText,
} from "react-konva";
import { useState } from "react";

export default function BessOverview() {
  // ---- pcs_1 .. pcs_8 fixed positions ----
  const [pcsPositions] = useState<{ x: number; y: number }[]>([
    { x: 31, y: 107 }, // pcs_1
    { x: 30, y: 146 }, // pcs_2
    { x: 31, y: 186 }, // pcs_3
    { x: 33, y: 231 }, // pcs_4
    { x: 382, y: 106 }, // pcs_5
    { x: 382, y: 148 }, // pcs_6
    { x: 384, y: 190 }, // pcs_7
    { x: 385, y: 233 }, // pcs_8
  ]);

  // Lines
  const [lines] = useState([
    { id: "h0",     points: [0, 0, 180, 0], x: 59,  y: 121, label: "1/10" },
    { id: "h1",     points: [0, 0, 180, 0], x: 58,  y: 164, label: "2/10" },
    { id: "h2",     points: [0, 0, 180, 0], x: 61,  y: 201, label: "3/10" },
    { id: "h3",     points: [0, 0, 180, 0], x: 60,  y: 245, label: "4/10" },
    { id: "h4",     points: [0, 0, 180, 0], x: 408, y: 119, label: "5/10" },
    { id: "h5",     points: [0, 0, 180, 0], x: 408, y: 162, label: "6/10" },
    { id: "h6",     points: [0, 0, 180, 0], x: 409, y: 203, label: "7/10" },
    { id: "h7",     points: [0, 0, 180, 0], x: 411, y: 246, label: "8/10" },
    { id: "short1", points: [0, 0,  60, 0], x: 239, y: 185 },
    { id: "short2", points: [0, 0,  60, 0], x: 589, y: 183 },
    { id: "v1",     points: [0, 0,   0,128], x: 238, y: 121 },
    { id: "v2",     points: [0, 0,   0,128], x: 588, y: 119 },
  ]);

  // POIs
  const [pois] = useState([
    { id: "POI-1", x: 324, y: 188 },
    { id: "POI-2", x: 674, y: 185 },
  ]);

  // ---- Corner status dots: fixed positions (no dragging) ----
  // Order mapped 1..8 per your log:
  // 1:(30,108) 2:(28,147) 3:(29,186) 4:(32,233) 5:(380,106) 6:(381,149) 7:(385,193) 8:(384,233)
  const statusDots = [
    { x: 30,  y: 108, color: "green" }, // Dot 1
    { x: 28,  y: 147, color: "red"   }, // Dot 2
    { x: 29,  y: 186, color: "gray"  }, // Dot 3
    { x: 32,  y: 233, color: "green" }, // Dot 4
    { x: 380, y: 106, color: "red"   }, // Dot 5
    { x: 381, y: 149, color: "gray"  }, // Dot 6
    { x: 385, y: 193, color: "green" }, // Dot 7
    { x: 384, y: 233, color: "gray"  }, // Dot 8
  ];

  return (
    <Box bg="gray.900" color="white" borderRadius="md" p={6} boxShadow="md" height="100%" width="100%" overflow="hidden" position="relative">
      <Flex justify="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Text fontSize="xl" fontWeight="bold">System Overview</Text>
          <Text fontSize="xs">Timestamp</Text>
          <Text fontSize="xs">4/8/2024, 12:45 PM | Time Sync OK</Text>
        </Box>
        <VStack align="end" spacing={2}>
          <Box textAlign="right">
            <Text>Site 1</Text>
            <Badge colorScheme="blue">IDLE</Badge>
          </Box>
        </VStack>
      </Flex>

      {/* Legend */}
      <Box position="absolute" bottom="16px" right="24px" zIndex={20}>
        <HStack spacing={6}>
          <HStack spacing={2}><Circle size="8px" bg="green.400" /><Text fontSize="xs">Charging</Text></HStack>
          <HStack spacing={2}><Circle size="8px" bg="red" /><Text fontSize="xs">Discharging</Text></HStack>
          <HStack spacing={2}><Circle size="8px" bg="gray.400" /><Text fontSize="xs">IDLE</Text></HStack>
        </HStack>
      </Box>

      <Box position="absolute" top="0" left="0" width="100%" height="100%" zIndex={10}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            {/* Active Alarms Group (still draggable) */}
            <Group
              x={45}
              y={334}
              draggable
              onDragEnd={(e) =>
                console.log("Active Alarms Group moved to:", e.target.x(), e.target.y())
              }
            >
              <KonvaText text="Active Alarms" fontSize={16} fill="white" fontStyle="bold" y={-25} />
              <Group x={0} y={0}>
                <KonvaCircle radius={4} fill="red" x={0} y={6} draggable />
                <KonvaText text="Overtemperature" fontSize={12} fill="white" x={10} y={0} />
              </Group>
              <Group x={130} y={0}>
                <KonvaCircle radius={4} fill="red" x={0} y={6} draggable />
                <KonvaText text="High SOC Limit" fontSize={12} fill="white" x={10} y={0} />
              </Group>
              <Group x={260} y={0}>
                <KonvaCircle radius={4} fill="red" x={0} y={6} draggable />
                <KonvaText text="Isolation Fault" fontSize={12} fill="white" x={10} y={0} />
              </Group>
            </Group>

            {/* Fixed corner dots (dragging disabled) */}
            {statusDots.map((dot, i) => (
              <KonvaCircle
                key={i}
                x={dot.x}
                y={dot.y}
                radius={3}
                fill={dot.color}
                shadowColor={dot.color}
                shadowBlur={5}
                shadowOpacity={0.7}
                draggable={false}     // <- drag off
              />
            ))}

            {/* PCS groups (locked) */}
            {pcsPositions.map((pos, i) => {
              const label = `pcs_${i + 1}`;
              return (
                <Group key={`pcs-${i}`} x={pos.x} y={pos.y} draggable={false}>
                  <Rect width={24} height={24} stroke="white" strokeWidth={1} />
                  <Line points={[0, 24, 24, 0]} stroke="white" strokeWidth={1} />
                  <Line points={[5, 7, 6.5, 6, 8, 7, 9.5, 6]} stroke="white" strokeWidth={1} tension={0.5} bezier />
                  <Line points={[16, 16, 21, 16]} stroke="white" strokeWidth={1} />
                  <Line points={[16, 19, 21, 19]} stroke="white" strokeWidth={1} />
                  <KonvaText
                    text={label}
                    fontSize={12}
                    fill="#00e5ff"
                    x={-2}
                    y={28}
                    shadowColor="black"
                    shadowBlur={4}
                    shadowOpacity={0.6}
                  />
                </Group>
              );
            })}

            {/* POIs (locked) */}
            {pois.map((poi) => (
              <Group key={poi.id} x={poi.x} y={poi.y} draggable={false}>
                <KonvaCircle radius={24} stroke="white" strokeWidth={2} />
                <KonvaCircle radius={20} fill="white" />
                <KonvaText text={poi.id} fill="black" fontSize={12} width={40} align="center" offsetX={20} offsetY={8} />
              </Group>
            ))}

            {/* Lines */}
            {lines.map((bar) => {
              const isHorizontal = bar.id.startsWith("h");
              const lineLength = bar.points[2];
              return (
                <Group key={bar.id} x={bar.x} y={bar.y} draggable={false}>
                  <Line points={bar.id.startsWith("v") ? [0, 0, 0, bar.points[3]] : bar.points} stroke="red" strokeWidth={2} />
                  {bar.label && <KonvaText text={bar.label} x={0} y={-12} fontSize={10} fill="white" />}
                  {isHorizontal && (
                    <KonvaText text="I01TouP" x={(lineLength ?? 0) / 2 - 20} y={-18} fontSize={10} fill="#00e0ff" />
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </Box>
    </Box>
  );
}
