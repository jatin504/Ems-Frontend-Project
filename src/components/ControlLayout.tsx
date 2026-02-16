import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Circle,
  SimpleGrid
} from "@chakra-ui/react";
import { useState } from "react";

// Circle indicating status
const StatusCircle = ({ active }: { active?: boolean }) => (
  <Circle size="16px" bg={active ? "green.400" : "red.500"} />
);

// Reusable label-value component
const LabelValue = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
  <Flex justify="space-between" w="100%">
    <Text>{label}</Text>
    <Text fontWeight="bold">
      {value} {unit}
    </Text>
  </Flex>
);

export default function ControlLayout() {
  const [mode, setMode] = useState<"LOCAL" | "REMOTE">("LOCAL");

  return (
    <Box bg="gray.900" color="white" p={4} fontSize="14px">
      <Flex gap={4} wrap="wrap" justify="space-between">
        {/* LEFT PANEL */}
        <VStack align="start" spacing={4} w="22%">
          {/* Local/Remote Toggle */}
          <Box w="100%">
            <Text fontWeight="bold" color="blue.600">LOCAL / REMOTE</Text>
            <Box
              mt={2}
              px={6}
              py={2}
              bg={mode === "LOCAL" ? "red.500" : "blue.500"}
              color="white"
              border="2px solid black"
              fontWeight="bold"
              textAlign="center"
              cursor="pointer"
              onClick={() => setMode(mode === "LOCAL" ? "REMOTE" : "LOCAL")}
            >
              {mode}
            </Box>
          </Box>

          {/* PCS Controls */}
          <Box>
            <Text fontWeight="bold" color="blue.600">PCS CONTROLS</Text>
            <SimpleGrid columns={2} spacingX={6} spacingY={2} mt={2}>
              {[
                { label: "FIXED W", active: false },
                { label: "WATT-PF", active: false },
                { label: "FIXED VAr", active: true },
                { label: "VOLT-WATT", active: true },
                { label: "FIXED PF", active: false },
                { label: "SCHEDULED", active: false },
                { label: "VOLT VAr", active: false },
                { label: "LVRT", active: false },
                { label: "LVRT", active: false },
                { label: "HVRT", active: false },
                { label: "FREQ-WATT-PARAM", active: true },
                { label: "FREQ-WATT-CURVE", active: false },
                { label: "DYN-REACTIVE CURRENT", active: false },
              ].map(({ label, active }) => (
                <HStack key={label} justify="start">
                  <StatusCircle active={active} />
                  <Text fontSize="sm">{label}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>

        {/* CENTER PANEL */}
        <VStack w="35%" align="center" spacing={4}>
          <Box w="100%">
            <Text fontWeight="bold" color="blue.600">BMS MONITORING</Text>
            <VStack align="start" spacing={1} mt={2}>
              <LabelValue label="SOC %" value="29.33" unit="%" />
              <LabelValue label="VAVG" value="762.78" unit="V" />
              <LabelValue label="TMAX" value="98.08" unit="°C" />
            </VStack>
          </Box>

          <Box w="100%">
            <Text fontWeight="bold" color="blue.600">SETPOINTS</Text>
            <VStack align="start" spacing={1} mt={2}>
              <LabelValue label="ACTIVE POWER SP" value="1744" unit="kW" />
              <LabelValue label="REACTIVE POWER SP" value="1732" unit="kVAR" />
            </VStack>
          </Box>

          <Box>
            <Text fontWeight="bold" color="blue.600">MODE</Text>
            <Text fontWeight="bold" fontSize="lg" color="green.500">CHARGING</Text>
          </Box>

          {/* Battery Image Placeholder */}
          <Box boxSize="100px" border="4px solid black" borderRadius="md" mt={2} />
        </VStack>

        {/* RIGHT PANEL */}
        <Box w="35%">
          <Text fontWeight="bold" color="blue.600">PCS MONITORING</Text>
          <VStack align="start" spacing={1} mt={2}>
            <LabelValue label="DC VOLTS" value="591.47" unit="V" />
            <LabelValue label="DC AMPS" value="385.47" unit="A" />
            <LabelValue label="DC POWER" value="-228.3" unit="kW" />

            {/* Spacer */}
            <Box h={4} />

            <LabelValue label="ACTIVE POWER" value="224.87" unit="kW" />
            <LabelValue label="REACTIVE POWER" value="47.47" unit="kVAR" />
            <LabelValue label="PF" value="0.82" />
            <LabelValue label="PHASE VOLTAGE" value="231.24" unit="V" />
            <LabelValue label="PHASE CURRENT" value="329.64" unit="A" />
            <LabelValue label="FREQUENCY" value="49.97" unit="Hz" />
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
