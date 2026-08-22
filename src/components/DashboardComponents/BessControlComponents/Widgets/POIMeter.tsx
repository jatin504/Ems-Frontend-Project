import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/layout";

function StatCard({
  title,
  value,
  status,
  direction,
  nominal,
  limit1,
  limit2,
}: {
  title: string;
  value: string;
  status?: string;
  direction?: string;
  nominal?: string;
  limit1?: string;
  limit2?: string;
}) {
  const softBg = useColorModeValue("#f3f4f6", "#1C2121");
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const textMuted = useColorModeValue("#64748b", "#A6B0B0");
  const textStrong = useColorModeValue("#111827", "#E8ECEC");

  return (
    <Box
      bg={softBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      h="155px"
      minH="78px"
      p="12px"
      flex="1"
      w="full"
      minW={0}
    >
      <VStack align="stretch" spacing="6px">
        <Text fontSize="xs" color={textMuted}>
          {title}
        </Text>

        <Text
          fontSize="md"
          fontWeight="700"
          color={textStrong}
        >
          {value}
        </Text>

        {direction && (
          <Text
            fontSize="10px"
            fontWeight="700"
            color={textStrong}
            mt="2px"
          >
            {direction}
          </Text>
        )}

        <Text
          fontSize="10px"
          fontWeight="600"
          color="#16A34A"
          mt="2px"
        >
          {status ?? "🟢 Normal"}
        </Text>

        <Box h="1px" bg={cardBorder} />

        {nominal && (
          <HStack justify="space-between">
            <Text fontSize="9px" color={textMuted}>
              Nominal:
            </Text>
            <Text fontSize="9px" color={textStrong} fontWeight="600">
              {nominal}
            </Text>
          </HStack>
        )}

        {limit1 && (
          <HStack justify="space-between">
            <Text fontSize="9px" color={textMuted}>
              {limit1.split(":")[0]}:
            </Text>
            <Text fontSize="9px" color={textStrong} fontWeight="600">
              {limit1.split(":").slice(1).join(":").trim()}
            </Text>
          </HStack>
        )}

        {limit2 && (
          <HStack justify="space-between">
            <Text fontSize="9px" color={textMuted}>
              {limit2.split(":")[0]}:
            </Text>
            <Text fontSize="9px" color={textStrong} fontWeight="600">
              {limit2.split(":").slice(1).join(":").trim()}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

export default function POIMeter(props: BoxProps) {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const titleColor = useColorModeValue("black", "white");
  const softBg = useColorModeValue("#f3f4f6", "#1C2121");
  const textMuted = useColorModeValue("#64748b", "#A6B0B0");
  const textStrong = useColorModeValue("#111827", "#E8ECEC");

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
      <VStack align="stretch" spacing="6px" h="full">

        {/* Title */}
        <Text fontSize="sm" color={titleColor}>
          POI Meter
        </Text>

        <VStack align="stretch" spacing="4px">
          {/* TOP: Frequency + POI Voltage */}
          <HStack spacing="10px" align="stretch" h="155px">
            <StatCard
              title="Frequency"
              value="50.37 Hz"
              nominal="50 Hz"
              limit1="UF limit: 49.0 Hz"
              limit2="OF limit: 51.0 Hz"
            />
            <StatCard
              title="POI Voltage"
              value="10.994 kV"
              nominal="11 kV"
              limit1="UV limit: 10.45 kV"
              limit2="OV limit: 11.55 kV"
            />
          </HStack>

          {/* BOTTOM: POI Active Power */}
          <Box
            bg={softBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="12px"
            h="52px"
            w="full"
            p="8px 12px"
          >
            <HStack w="full" h="full" justify="space-between" align="center">
              <VStack align="start" spacing="0">
                <Text fontSize="9px" color={textMuted}>
                  POI Active Power
                </Text>
                <Text fontSize="15px" fontWeight="700" color={textStrong}>
                  +63.27 MW
                </Text>
              </VStack>
              <VStack align="end" spacing="1px">
                <Text fontSize="8px" fontWeight="700" color={textStrong}>
                  DISCHARGING → GRID
                </Text>
                <Text fontSize="8px" fontWeight="600" color="#16A34A">
                  🟢 Normal
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
}