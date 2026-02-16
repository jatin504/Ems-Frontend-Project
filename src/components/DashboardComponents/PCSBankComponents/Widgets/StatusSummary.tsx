import React from "react";
import { Box, Flex, Stat, StatNumber, Text, Heading, useColorModeValue } from "@chakra-ui/react";

const GREEN = "#13BF74";
const RED = "#EE2828";

// Donut ring: green portion for value, red remainder for the rest (same for all cards)
const ring = (value: number, total: number) => {
  const pct = Math.min(100, Math.max(0, (value / Math.max(1, total)) * 100));
  const angle = (pct / 100) * 360;
  return `conic-gradient(${GREEN} 0deg ${angle}deg, ${RED} ${angle}deg 360deg)`;
};

const Dot: React.FC<{ ok?: boolean }> = ({ ok = true }) => (
  <Box w="10px" h="10px" borderRadius="full" bg={ok ? GREEN : RED} mr={2} />
);

const Row: React.FC<{ label: string; value: number; ok?: boolean }> = ({ label, value, ok = true }) => (
  <Flex align="center" justify="space-between" mt={2}>
    <Flex align="center">
      <Dot ok={ok} />
      <Text fontSize="sm" color="gray.400">
        {label}
      </Text>
    </Flex>
    <Text fontWeight="semibold" color={ok ? GREEN : RED}>
      {value}
    </Text>
  </Flex>
);

const StatusSummary: React.FC<{
  title: string;
  donutValue: number;
  donutTotal: number;
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
  // accent kept for compatibility but ignored so both rings stay the same colors
  accent?: "green" | "cyan";
}> = ({ title, donutValue, donutTotal, leftLabel, leftValue, rightLabel, rightValue }) => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#000000", "gray.300");

  const innerCircleBg = useColorModeValue("#ffffff", "#0b0f14");
  const innerCircleBorder = useColorModeValue(cardBorder, "#1c2635");
  const statColor = useColorModeValue("#0b0f14", "white");

  return (
    <Box bg={cardBg} borderRadius="12px" p="16px" border={`1px solid ${cardBorder}`} w="330px" h="147px">
      <Heading as="h3" size="sm" color={headingColor} mb="12px" display="flex" alignItems="center" justifyContent="space-between">
        <span>{title}</span>
      </Heading>

      <Flex align="center" gap="16px">
        <Box
          w="84px"
          h="84px"
          borderRadius="full"
          bg={ring(donutValue, donutTotal)}
          display="grid"
          placeItems="center"
        >
          <Box
            w="64px"
            h="64px"
            borderRadius="full"
            bg={innerCircleBg}
            display="grid"
            placeItems="center"
            border={`1px solid ${innerCircleBorder}`}
          >
            <Stat textAlign="center">
              <StatNumber fontSize="lg" color={statColor}>
                {donutValue}
              </StatNumber>
            </Stat>
          </Box>
        </Box>

        <Box flex="1">
          <Row label={leftLabel} value={leftValue} ok />
          <Row label={rightLabel} value={rightValue} ok={false} />
        </Box>
      </Flex>
    </Box>
  );
};

export default StatusSummary;
