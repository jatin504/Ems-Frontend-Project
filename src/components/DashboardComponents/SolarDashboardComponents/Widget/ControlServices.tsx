import { Box, VStack, HStack, Stack, Text, Button, Input, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";

type Dot = "green" | "red" | "gray";

const WRAP_W = 332; const WRAP_H = 578;
const FIELD_W = 160; const FIELD_H = 34; const FIELD_RADIUS = 8;
const FIELD_PADX = 10; const FIELD_PADY = 8; const FIELD_GAP = 10;

function StatusDot({ color = "green" as Dot }) {
  const map: Record<Dot, string> = { green: "#22c55e", red: "#ef4444", gray: "#9ca3af" };
  return <Box w="8px" h="8px" borderRadius="full" bg={map[color]} />;
}

// 160×34 Enter value | unit
function ValueUnitField({ unit, placeholder = "Enter value" }: { unit?: string; placeholder?: string; }) {
  const softBg = useColorModeValue("gray.100", "#1C2121");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const textMain = useColorModeValue("gray.800", "#E8ECEC");
  const unitColor = useColorModeValue("#00000080", textMuted);

  return (
    <HStack
      w={`${FIELD_W}px`}
      h={`${FIELD_H}px`}
      px={`${FIELD_PADX}px`}
      py={`${FIELD_PADY}px`}
      spacing={`${FIELD_GAP}px`}
      bg={softBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius={`${FIELD_RADIUS}px`}
      flex="0 0 auto"
      overflow="hidden"
    >
      <Input
        variant="unstyled"
        placeholder={placeholder}
        fontSize="sm"
        _placeholder={{ color: textMuted }}
        h="full"
        minW={0}
        color={useColorModeValue('#00000080', textMain)}
      />
      {unit && (
        <Box
          w="18px"
          h="0px"
          borderLeft="1px solid"
          borderColor={cardBorder}
          opacity={1}
          mx={1}
        />
      )}
      {unit ? <Text fontSize="xs" color={unit === "kWh" || unit === "kW/min" ? unitColor : textMuted} whiteSpace="nowrap">{unit}</Text> : null}
    </HStack>
  );
}

// Row wrapper WITH exact width + side padding
function Row({ h, children }: { h: number; children: React.ReactNode; }) {
  return (
    <HStack
      w={`${WRAP_W}px`}
      h={`${h}px`}
      px="16px"
      align="center"
      justify="space-between"
      sx={{ transform: "rotate(0deg)", opacity: 1 }}
    >
      {children}
    </HStack>
  );
}

function OneField({ label, subtext, unit, dot = "green", h = 46, modeSymbol }: {
  label: string; subtext: string; unit?: string; dot?: Dot; h?: number; modeSymbol?: string;
}) {
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  const textMuted = useColorModeValue("#000000", "#FFFFFF");

  return (
    <Row h={h}>
      <Stack direction="row" align="center" spacing={3} w="full">
        <VStack align="start" spacing={1} flex="1" minW={0}>
          <HStack spacing={2}>
            <Text fontSize="sm" color={textPrimary} fontWeight={700} noOfLines={1}>{label}</Text>
            <StatusDot color={dot} />
            {modeSymbol && (
              <Box
                as="span"
                fontWeight={700}
                fontSize="10px"
                color={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
                border="1px solid"
                borderColor={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
                borderRadius="3px"
                px={0.5}
                py={0}
                ml={0.5}
                minW="13px"
                textAlign="center"
                lineHeight={1}
                title={modeSymbol === "L" ? "Local Mode" : "Remote Mode"}
                display="inline-block"
              >
                {modeSymbol}
              </Box>
            )}
          </HStack>
          <Text fontSize="xs" color={textMuted} noOfLines={1}>{subtext}</Text>
        </VStack>
        <ValueUnitField unit={unit} />
      </Stack>
    </Row>
  );
}

function RampField({ modeSymbol }: { modeSymbol?: string }) {
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const rampValueColor = useColorModeValue("#000000", "#FFFFFF");

  return (
    <Row h={78}>
      <Stack direction="row" align="flex-start" spacing={3} w="full">
        <VStack align="start" spacing={1} flex="1" minW={0}>
          <HStack spacing={2} wrap="wrap">
            <Text fontSize="sm" color={textPrimary} fontWeight={700} noOfLines={1}>Ramp</Text>
            <Text fontSize="xs" color={textMuted} noOfLines={1}>rate/min</Text>
            <StatusDot color="red" />
            {modeSymbol && (
              <Box
                as="span"
                fontWeight={700}
                fontSize="13px"
                color={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
                border="1px solid"
                borderColor={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
                borderRadius="4px"
                px={1}
                py={0.5}
                ml={0.5}
                minW="18px"
                textAlign="center"
                lineHeight={1}
                title={modeSymbol === "L" ? "Local Mode" : "Remote Mode"}
              >
                {modeSymbol}
              </Box>
            )}
          </HStack>
          <Text fontSize="xs" color={rampValueColor} noOfLines={1}>827.27</Text>
        </VStack>

        <VStack align="stretch" spacing={2}>
          <ValueUnitField unit="kW/min" placeholder="Up value" />
          <ValueUnitField unit="kW/min" placeholder="Down value" />
        </VStack>
      </Stack>
    </Row>
  );
}
export default function ControlServices() {
  // Dark mode uses #161B1B palette
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const divider = cardBorder;
  const heading = useColorModeValue("gray.800", "#E8ECEC");

  // Local/Remote mode state (for demo, default to remote)
  const [mode, setMode] = useState<'local' | 'remote'>("remote");
  const modeSymbol = mode === "local" ? "L" : "R";

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w={`${WRAP_W}px`}
      h={`${WRAP_H}px`}
      p="0"
      opacity={1}
      // display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <VStack align="stretch" spacing={0} flex="1" minH={0} overflowY="auto">
        <HStack justify="space-between" gap={2} px="16px" py="12px">
          <HStack spacing={2}>
            <Text
              w="192px"
              h="24px"
              color={useColorModeValue("#000000", "#FFFFFF")}
              fontFamily="Poppins, sans-serif"
              fontWeight={700}
              fontStyle="normal"
              fontSize="16px"
              lineHeight="100%"
              letterSpacing="0"
              opacity={1}
            >
              Control Services
            </Text>
          </HStack>
          <HStack spacing={0}>
            <Button
              size="xs"
              w="49px"
              h="24px"
              px="8px"
              py="3px"
              borderRadius="6px"
              opacity={1}
              borderWidth="1px"
              bg="transparent"
              color="gray.400"
              borderColor={useColorModeValue("#000000", "#FFFFFF")}
              _hover={{ bg: useColorModeValue("#f3f4f6", "#232829") }}
              _active={{ bg: useColorModeValue("#e5e7eb", "#161B1B") }}
              mr="10px"
            >
              Clear
            </Button>
            <Button
              size="xs"
              w="51px"
              h="24px"
              px="8px"
              py="3px"
              borderRadius="6px"
              opacity={1}
              bg="#33D2D2"
              color={useColorModeValue("#FFFFFF", "#161B1B")}
              _hover={{ bg: "#33D2D2", opacity: 0.9 }}
              _active={{ bg: "#33D2D2", opacity: 0.8 }}
            >
              Apply
            </Button>
          </HStack>
        </HStack>

        <Box h="12px" />
        <Box h="1px" bg={divider} />
        <Box h="12px" />

        <VStack align="stretch" spacing={0} divider={
          <>
            <Box h="12px" />
            <Box h="1px" bg={divider} />
            <Box h="12px" />
          </>
        }>
          {/* P — 332×46, px 16 */}
          <OneField label="P" subtext="827267" unit="kWh" h={46} modeSymbol={modeSymbol} />

          {/* Ramp — 332×78, px 16 */}
          <RampField modeSymbol={modeSymbol} />

          {/* P(f) — 332×46, px 16 */}
          <OneField label="P(f)" subtext="49.97 Hz" unit="kWh" dot="red" h={46} modeSymbol={modeSymbol} />

          {/* Q — 332×46, px 16 */}
          <OneField label="Q" subtext="0 kVAr" unit="kVAr" h={46} modeSymbol={modeSymbol} />

          {/* cosphi — 332×46, px 16 */}
          <OneField label="cosphi" subtext="1" dot="red" h={46} modeSymbol={modeSymbol} />

          {/* Extra rows you already had; keep or remove as needed */}
          <OneField label="V Droop" subtext="4" h={46} modeSymbol={modeSymbol} />
          <OneField label="FRT" subtext="4" h={46} modeSymbol={modeSymbol} />
        </VStack>
      </VStack>
    </Box>
  );
}
