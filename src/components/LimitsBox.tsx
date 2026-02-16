// src/components/LimitsBox.tsx
import { Box, Text, Input, Flex, VStack } from "@chakra-ui/react";

interface LimitRowProps {
  label: string;
  value: string;
  unit: string;
  onChange?: (newValue: string) => void;
}

const LimitRow = ({ label, value, unit, onChange }: LimitRowProps) => (
  <Flex align="center" justify="space-between" w="100%">
    <Text fontSize="sm" w="50%">
      {label}
    </Text>
    <Input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      size="sm"
      width="100px"
      textAlign="right"
      bg="white"
      color="black"
    />
    <Text fontSize="sm" w="40px" ml={2}>
      {unit}
    </Text>
  </Flex>
);

interface LimitsBoxProps {
  limits?: {
    label: string;
    value: string;
    unit: string;
  }[];
}

export default function LimitsBox({ limits }: LimitsBoxProps) {
  const defaultLimits = [
    { label: "MAX CHARGE", value: "708.0", unit: "kW" },
    { label: "CHARGE RATE LIMIT", value: "100.0", unit: "% WChaMax/Sec" },
    { label: "DISCHARGE RATE LIMIT", value: "100.0", unit: "% WChaMax/Sec" },
    { label: "VAr LIMIT Q1", value: "1732", unit: "kVAr" },
    { label: "VAr LIMIT Q2", value: "1732", unit: "kVAr" },
    { label: "VAr LIMIT Q3", value: "1732", unit: "kVAr" },
    { label: "VAr LIMIT Q4", value: "1732", unit: "kVAr" },
    { label: "kVA LIMIT", value: "1732", unit: "kVA" },
  ];

  const limitsToRender = limits || defaultLimits;

  return (
    <Box
      bg="gray.900"
      color="white"
      p={4}
      borderRadius="md"
      w="320px"
      fontSize="14px"
    >
      <Text fontWeight="bold" color="blue.500" mb={4}>
        LIMITS
      </Text>
      <VStack align="start" spacing={3}>
        {limitsToRender.map((limit) => (
          <LimitRow
            key={limit.label}
            label={limit.label}
            value={limit.value}
            unit={limit.unit}
          />
        ))}
      </VStack>
    </Box>
  );
}
