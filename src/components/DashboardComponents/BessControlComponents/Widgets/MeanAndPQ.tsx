import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import WidgetTitle from "../../../Common/WidgetTitle";

const PhaseRow = ({
  phase,
  p,
  q,
  kva,
  hz,
  amps,
  voltage,
  pf,
}: {
  phase: string;
  p: string;
  q: string;
  kva: string;
  hz: string;
  amps: string;
  voltage: string;
  pf: string;
}) => {
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");

  const cell = (value: string) => (
    <Text
      fontSize="9px"
      color={textPrimary}
      fontWeight="600"
      textAlign="right"
      w="43px"
      flexShrink={0}
    >
      {value}
    </Text>
  );

  return (
    <HStack w="full" spacing="3px">
      <Text
        fontSize="9px"
        color={textMuted}
        fontWeight="600"
        w="28px"
        flexShrink={0}
      >
        {phase}
      </Text>

      {cell(p)}
      {cell(q)}
      {cell(kva)}
      {cell(hz)}
      {cell(amps)}
      {cell(voltage)}
      {cell(pf)}
    </HStack>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");

  return (
    <HStack justify="space-between" w="full">
      <Text fontSize="9px" color={textMuted}>
        {label}
      </Text>

      <Text
        fontSize="10px"
        color={textPrimary}
        fontWeight="600"
      >
        {value}
      </Text>
    </HStack>
  );
};

export default function MeanAndPQ() {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const titleColor = useColorModeValue("#000000", "#FFFFFF");
  const headColor = useColorModeValue("gray.500", "#A6B0B0");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="402px"
      h="260px"
      p="14px"
      overflow="hidden"
      ml={"-80px"}
    >
      <VStack align="stretch" spacing="5px">

        {/* ================= LINE METER ================= */}
        <Box>
          <WidgetTitle color={titleColor} fontFamily="Poppins, sans-serif" mb="5px">
            Line Meter
          </WidgetTitle>

          {/* Header */}
          <HStack
            w="full"
            spacing="3px"
            pb="4px"
            borderBottom="1px solid"
            borderColor={cardBorder}
          >
            <Text
              fontSize="9px"
              color={headColor}
              w="28px"
            >
              Phase
            </Text>

            {[
              "P",
              "Q",
              "KVA",
              "Hz",
              "Amps",
              "V",
              "PF",
            ].map((item) => (
              <Text
                key={item}
                fontSize="8px"
                color={headColor}
                textAlign="right"
                w="43px"
                flexShrink={0}
              >
                {item}
              </Text>
            ))}
          </HStack>

          <VStack
            align="stretch"
            spacing="3px"
            mt="5px"
          >
            <PhaseRow
              phase="L1"
              p="98.4"
              q="12.6"
              kva="99.2"
              hz="50.01"
              amps="142.8"
              voltage="398.6"
              pf="0.99"
            />

            <PhaseRow
              phase="L2"
              p="97.8"
              q="12.1"
              kva="98.5"
              hz="49.99"
              amps="141.9"
              voltage="399.1"
              pf="0.99"
            />

            <PhaseRow
              phase="L3"
              p="98.1"
              q="12.4"
              kva="98.9"
              hz="50.00"
              amps="142.3"
              voltage="398.8"
              pf="0.99"
            />
          </VStack>
        </Box>

        {/* Divider */}
        <Box h="1px" bg={cardBorder} />

        {/* ================= BATTERY + SOC ================= */}
        <HStack align="stretch" spacing="6px" w="full">
          {/* BATTERY CAPABILITY */}
          <Box flex="1" minW={0}>
            <WidgetTitle color={titleColor} fontFamily="Poppins, sans-serif" fontSize="14px" mb="4px">
              Battery Capability
            </WidgetTitle>
            <VStack align="stretch" spacing="2px">
              <InfoRow label="Minimum SOC" value="10%" />
              <InfoRow label="Maximum SOC" value="95%" />
              <InfoRow label="Available charge energy" value="156 MWh" />
              <InfoRow label="Available discharge energy" value="43 MWh" />
              <InfoRow label="Charge power capability" value="98 MW" />
              <InfoRow label="Discharge power capability" value="100 MW" />
            </VStack>
          </Box>

          {/* VERTICAL DIVIDER */}
          <Box w="1px" bg={cardBorder} flexShrink={0} />

          {/* SOC HEADROOM */}
          <Box flex="0 0 125px">
            <WidgetTitle color={titleColor} fontFamily="Poppins, sans-serif" fontSize="14px" mb="4px">
              SOC Headroom
            </WidgetTitle>
            <VStack align="stretch" spacing="2px">
              <InfoRow label="Charge headroom" value="78.3%" />
              <InfoRow label="Discharge headroom" value="11.7%" />
            </VStack>
          </Box>
        </HStack>

      </VStack>
    </Box>
  );
}