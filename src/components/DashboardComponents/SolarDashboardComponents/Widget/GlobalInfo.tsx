import React from "react";
import { Box, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/layout";

const Row = ({ l, v }: { l: string; v: string }) => {
  const textMuted   = useColorModeValue("gray.600", "#A6B0B0");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");

  return (
    <HStack
      w="300px"
      h="24px"
      spacing="4px"
      justify="space-between"
      overflow="hidden"
      sx={{ transform: "rotate(0deg)", opacity: 1 }}
    >
      <Text fontSize="xs" color={textMuted} noOfLines={1} flex="1">
        {l}
      </Text>
      <Text
        fontSize="sm"
        color={textPrimary}
        fontWeight="bold"
        textAlign="right"
        noOfLines={1}
        flexShrink={0}
        minW="28px"
      >
        {v}
      </Text>
    </HStack>
  );
};

export default function GlobalInfo(props: BoxProps) {
  const labels = [
    "Stop",
    "Grid connected",
    "Power limit",
    "Running",
    "Power limit stop",
    "Fault",
    "Derating",
    "Comm. error",
  ];
  const values = ["10", "40", "0", "30", "0", "1", "0", "0"];

  const cardBg     = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const heading    = useColorModeValue("gray.800", "#E8ECEC");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="332px"
      h="260px"
      p="16px"
      overflow="hidden"
      {...props}
    >
      <VStack align="stretch" spacing="10px" h="full">
        <Text
          w="152px"
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
          Global Information
        </Text>

        {/* Font box area: exactly 300×194, gap 1px */}
        <VStack
          w="300px"
          h="194px"
          spacing="1px"     
          align="stretch"
          overflow="hidden"
          sx={{ transform: "rotate(0deg)", opacity: 1 }}
        >
          {labels.map((l, i) => (
            <Row key={l} l={l} v={values[i]} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}
