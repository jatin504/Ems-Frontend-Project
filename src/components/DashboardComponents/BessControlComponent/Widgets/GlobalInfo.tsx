import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/layout";
import WidgetTitle from "../../../Common/WidgetTitle";

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
    <HStack
      w="full"
      justify="space-between"
      spacing="8px"
    >
      <Text
        fontSize="10px"
        color={textMuted}
        noOfLines={1}
      >
        {label}
      </Text>

      <Text
        fontSize="10px"
        color={textPrimary}
        fontWeight="600"
        textAlign="right"
        whiteSpace="nowrap"
      >
        {value}
      </Text>
    </HStack>
  );
};

export default function GlobalInfo(props: BoxProps) {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const titleColor = useColorModeValue("#000000", "#FFFFFF");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="250px"
      h="260px"
      p="16px"
      overflow="hidden"
      {...props}
    >
      <VStack
        align="stretch"
        spacing="7px"
        h="full"
      >
        {/* Title */}
        <WidgetTitle
          w="auto"
          h="24px"
          color={titleColor}
          fontFamily="Poppins, sans-serif"
          fontStyle="normal"
          fontSize="16px"
          lineHeight="100%"
          letterSpacing="0"
          opacity={1}
        >
          BESS Health
        </WidgetTitle>

        {/* Health Information */}
        <VStack
          align="stretch"
          spacing="4px"
          w="full"
        >
          <InfoRow
            label="PCS Online"
            value="46/46"
          />

          <InfoRow
            label="BMS Online"
            value="46/46"
          />

          <InfoRow
            label="Containers Available"
            value="46/46"
          />

          <InfoRow
            label="Communication"
            value="100%"
          />

          <InfoRow
            label="Data Quality"
            value="99.98%"
          />
        </VStack>

        {/* Divider */}
        <Box
          w="full"
          h="1px"
          bg={cardBorder}
        />

        {/* Last Command */}
        <Box>
          <Text
            fontSize="12px"
            fontWeight="700"
            color={textPrimary}
            mb="4px"
          >
            Last Command
          </Text>

          <HStack
            justify="space-between"
            align="start"
          >
            <Box>
              <Text
                fontSize="10px"
                fontWeight="600"
                color={textPrimary}
              >
                P = +75 MW
              </Text>

              <Text
                fontSize="9px"
                color={textMuted}
                mt="2px"
              >
                11:42:15
              </Text>
            </Box>

            <Box textAlign="right">
              <Text
                fontSize="9px"
                color={textMuted}
              >
                Status:
              </Text>

              <Text
                fontSize="9px"
                fontWeight="600"
                color="green.500"
              >
                🟢 Executed
              </Text>
            </Box>
          </HStack>

          <VStack
            align="stretch"
            spacing="2px"
            mt="4px"
          >
            <InfoRow
              label="Command"
              value="75 MW"
            />

            <InfoRow
              label="POI"
              value="74.8 MW"
            />

            <InfoRow
              label="Tracking error"
              value="0.2 MW"
            />
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}