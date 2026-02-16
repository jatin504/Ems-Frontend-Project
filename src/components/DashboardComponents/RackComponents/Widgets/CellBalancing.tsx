import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

function Donut({
  size = 120,
  thickness = 16,
  orangePct = 78,
  purplePct = 22,
  centerText = "1400",
}: {
  size?: number;
  thickness?: number;
  orangePct?: number;
  purplePct?: number;
  centerText?: string | number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const oPct = clamp(orangePct);
  const pPct = clamp(purplePct);
  const oLen = (oPct / 100) * c;
  const pLen = (pPct / 100) * c;

  const trackColor = useColorModeValue("#f1f5f9", "#101826");
  const textColor = useColorModeValue("#0f172a", "#ffffff");

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        {/* orange arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F6A623"
          strokeWidth={thickness}
          strokeDasharray={`${oLen} ${c - oLen}`}
        />
        {/* purple arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#A78BFA"
          strokeWidth={thickness}
          strokeDasharray={`${pLen} ${c - pLen}`}
          strokeDashoffset={-oLen}
        />
      </svg>

      <Center position="absolute" inset={0}>
        <Text color={textColor} fontWeight="bold">
          {centerText}
        </Text>
      </Center>
    </Box>
  );
}


export default function CellBalancing() {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "gray.700");
  const headingColor = useColorModeValue("#0f172a", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("#0f172a", "gray.100");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      rounded="12px"
      w="330px"
      h="302px"
      p="16px"
      display="flex"
      flexDirection="column"
      gap="16px"
    >
      <Heading as="h3" size="sm" color={headingColor}>
        Cell Balancing
      </Heading>

      <Center flex="1">
        <Donut size={120} thickness={16} orangePct={78} purplePct={22} centerText="1400" />
      </Center>

      {/* Grid -> HStack/VStack (same 2 columns, 2 rows) */}
      <HStack spacing={8} align="start">
        {/* Left column: Active, Balanced (row gap = 2) */}
        <VStack align="start" spacing={2} flex="1">
          <VStack align="start" spacing={0}>
            <Text color={labelColor} fontSize="sm">Active</Text>
            <Text color={valueColor} fontWeight="semibold">10</Text>
          </VStack>
          <VStack align="start" spacing={0}>
            <Text color={labelColor} fontSize="sm">Balanced</Text>
            <Text color="#F6A623" fontWeight="semibold">1400</Text>
          </VStack>
        </VStack>

        {/* Right column: String ID, Cycle Count */}
        <VStack align="start" spacing={2} flex="1">
          <VStack align="start" spacing={0}>
            <Text color={labelColor} fontSize="sm">String ID</Text>
            <Text color={valueColor} fontWeight="semibold">10</Text>
          </VStack>
          <VStack align="start" spacing={0}>
            <Text color={labelColor} fontSize="sm">Cycle Count</Text>
            <Text color="#A78BFA" fontWeight="semibold">0</Text>
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
}
