import React from "react";
import { Box, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/layout";

type SoCWithChargeCardProps = BoxProps & {
  soc?: string;
  soh?: string;
  mainVolt?: string;
  volt?: string;
  curr?: string;
  slicePct?: number;
  startDeg?: number;
};

export default function SoCWithChargeCard({
  soc = "21.668%",
  soh = "13.686%",
  mainVolt = "63.68 V",
  volt = "63.68 V",
  curr = "8.386 A",
  slicePct = 25,
  startDeg = 0,
  ...props
}: SoCWithChargeCardProps) {
  const ORANGE = "#FFA36C";
  const CYAN = "#39C1FF";
  const size = 95;
  const innerR = size / 2 - 20;

  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const divider = cardBorder;

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="327px"
      h="260px"
      p="16px"
      {...props}
    >
      {/* inner width = 327 - 32 = 295; layout = 126 (left) + 1 (divider) + 168 (right) */}
      <HStack align="stretch" spacing="0px" h="full">
        {/* LEFT: Donut + SoC/SoH */}
        <VStack align="start" spacing={3} w="126px">
          <Box
            w={`${size}px`}
            h={`${size}px`}
            borderRadius="full"
            position="relative"
            sx={{
              transform: "rotate(0deg)",
              background: `conic-gradient(from ${startDeg}deg, ${CYAN} 0 ${slicePct}%, ${ORANGE} ${slicePct}% 100%)`,
              mask: `radial-gradient(circle at center, transparent ${innerR}px, #000 ${innerR + 1}px)`,
              WebkitMask: `radial-gradient(circle at center, transparent ${innerR}px, #000 ${innerR + 1}px)`,
            }}
          />
          <VStack align="stretch" spacing={3} w="full">
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color={textMuted}>State of Charge</Text>
              <Text fontSize="sm" color={textPrimary} fontWeight="semibold">{soc}</Text>
            </VStack>
            <Box h="1px" bg={divider} />
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color={textMuted}>State of Health</Text>
              <Text fontSize="sm" color={textPrimary} fontWeight="semibold">{soh}</Text>
            </VStack>
          </VStack>
        </VStack>

        {/* Vertical divider with top/bottom gap */}
        <Box w="1px" h="calc(100% - 40px)" bg={divider} alignSelf="center" />

        {/* RIGHT: Power + metrics */}
        <Box w="168px" h="228px" py="10px" overflow="hidden">
          <VStack align="stretch" spacing={0} h="full">
            {/* Charge/Discharge Power (indent 8px) */}
            <VStack align="start" spacing={0} pl={2}>
              <Text
                fontFamily="'Poppins', sans-serif"
                fontWeight={400}
                fontSize="12px"
                lineHeight="1"
                color={textMuted}
              >
                Charge/Discharge Power
              </Text>
              <Box h="12px" />
              <Text fontSize="sm" color={textPrimary} fontWeight="semibold" lineHeight="1">
                {mainVolt}
              </Text>
            </VStack>
            {/* Divider: left/right gap + top/bottom cushion */}
            <Box h="1px" bg={divider} ml={2} mr={2} my={2} />

            {/* Voltage (indent 8px) */}
            <VStack align="start" spacing={0} pl={2}>
              <Text fontSize="xs" color={textMuted}>Voltage</Text>
              <Box h="12px" />
              <Text fontSize="sm" color={textPrimary} fontWeight="semibold">{volt}</Text>
            </VStack>
            <Box h="1px" bg={divider} ml={2} mr={2} my={2} />

            {/* Current (indent 8px) */}
            <VStack align="start" spacing={0} pl={2}>
              <Text fontSize="xs" color={textMuted}>Current</Text>
              <Box h="12px" />
              <Text fontSize="sm" color={textPrimary} fontWeight="semibold">{curr}</Text>
            </VStack>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
}
