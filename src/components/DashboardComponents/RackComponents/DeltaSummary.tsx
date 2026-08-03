import React from "react";
import {
  Box,
  Divider,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const Row = ({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) => (
  <HStack justify="space-between" align="flex-start" py="8px">
    <Text fontSize="12px" color="gray.500">
      {label}
    </Text>

    <VStack spacing={0} align="flex-end">
      <Text
        fontSize="20px"
        fontWeight="700"
        color={color}
        lineHeight="18px"
      >
        {value}
      </Text>

      {sub && (
        <Text
          fontSize="10px"
          color="gray.500"
        >
          {sub}
        </Text>
      )}
    </VStack>
  </HStack>
);

export default function DeltaSummary() {
  const bg = useColorModeValue("#ffffff", "#0F172A");
  const border = useColorModeValue("#E2E8F0", "#243447");
  const title = useColorModeValue("#1E293B", "white");
  const label = useColorModeValue("#64748B", "#94A3B8");

  return (
    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
    >
      {/* Header */}
      <Box
        px="16px"
        py="12px"
        borderBottom="1px solid"
        borderColor={border}
      >
        <Text
          fontSize="14px"
          fontWeight="700"
          color={title}
        >
          Delta Summary
        </Text>
      </Box>

      {/* Top Summary */}
      <HStack
        px="16px"
        py="14px"
        spacing={8}
        align="flex-start"
      >
        <Box flex={1}>
          <Text
            fontSize="10px"
            color={label}
            mb="6px"
          >
            Cell Voltage Delta{" "}
            <Text as="span" fontSize="9px">
              (Max-Min)
            </Text>
          </Text>

          <HStack spacing={2}>
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
            >
              18
            </Text>

            <Text
              fontSize="18px"
              fontWeight="600"
              color={title}
            >
              mV
            </Text>
          </HStack>

          <Text
            color="#22C55E"
            fontSize="12px"
            fontWeight="600"
          >
            Excellent
          </Text>
        </Box>

        <Box flex={1}>
          <Text
            fontSize="10px"
            color={label}
            mb="6px"
          >
            Temperature Delta{" "}
            <Text as="span" fontSize="9px">
              (Max-Min)
            </Text>
          </Text>

          <HStack spacing={2}>
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
            >
              2.4
            </Text>

            <Text
              fontSize="18px"
              fontWeight="600"
              color={title}
            >
              °C
            </Text>
          </HStack>

          <Text
            color="#22C55E"
            fontSize="12px"
            fontWeight="600"
          >
            Excellent
          </Text>
        </Box>
      </HStack>

      <Divider borderColor={border} />

      {/* Temperatures */}
      <Box px="16px" py="14px">
        <Text
          fontSize="13px"
          fontWeight="700"
          color={title}
          mb="10px"
        >
          Temperatures
        </Text>

        <Row
          label="Max. Cell Temp"
          value="44.83 °C"
          color="#EF4444"
          sub="BMU-04 Cell 23"
        />

        <Divider borderColor={border} />

        <Row
          label="Min. Cell Temp"
          value="36.87 °C"
          color="#60A5FA"
          sub="BMU-08 Cell 12"
        />

        <Divider borderColor={border} />

        <Row
          label="Avg. Cell Temp"
          value="40.85 °C"
          color="#C084FC"
        />
      </Box>
    </Box>
  );
}