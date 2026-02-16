import React from "react";
import { Box, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/layout";

function StatCard({ label, value }: { label: string; value: string }) {
  const softBg     = useColorModeValue("#f3f4f6", "#1C2121"); // inner tile bg
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const textMuted  = useColorModeValue("#64748b", "#A6B0B0");
  const textStrong = useColorModeValue("#111827", "#E8ECEC");

  return (
    <Box
      bg={softBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      h="84px"
      p="12px"
      flex="1"
    >
      <VStack align="start" spacing="6px">
        <Text fontSize="xs" color={textMuted}>
          {label}
        </Text>
        <Text fontSize="md" fontWeight="700" color={textStrong}>
          {value}
        </Text>
      </VStack>
    </Box>
  );
}

export default function POIMeter(props: BoxProps) {
  // Outer card colors (dark = #161B1B bg, #202525 border)
  const cardBg     = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const titleColor = useColorModeValue("black", "white");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      fontWeight={700}
      w="362px"
      h="260px"
      p="16px"
      overflow="hidden"
      {...props}
    >
      <VStack align="stretch" spacing="16px" h="full">
        {/* Title */}
        <Text fontSize="sm" color={titleColor}>
          POI Meter
        </Text>

        {/* Row 1 */}
        <HStack spacing="16px">
          <StatCard label="Power"     value="63.27 kW" />
          <StatCard label="Frequency" value="50.37 Hz" />
        </HStack>

        {/* Row 2 */}
        <HStack spacing="16px">
          <StatCard label="Voltage" value="10994.24 kV" />
          <StatCard label="Current" value="83.90 A" />
        </HStack>
      </VStack>
    </Box>
  );
}
