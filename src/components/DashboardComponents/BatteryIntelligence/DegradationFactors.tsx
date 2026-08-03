import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";

const factors = [
  {
    label: "High Temperature Exposure",
    value: 72,
    color: "orange",
    status: "High",
    statusColor: "#EF4444",
  },
  {
    label: "High Charge Current",
    value: 64,
    color: "orange",
    status: "Medium",
    statusColor: "#F59E0B",
  },
  {
    label: "Deep Discharge Events",
    value: 55,
    color: "yellow",
    status: "Medium",
    statusColor: "#F59E0B",
  },
  {
    label: "Calendar Aging",
    value: 45,
    color: "yellow",
    status: "Low",
    statusColor: "#84CC16",
  },
  {
    label: "High C-rate Discharge",
    value: 38,
    color: "green",
    status: "Low",
    statusColor: "#84CC16",
  },
];

const DegradationFactors = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#E2E8F0", "#1E3345");
  const headingColor = useColorModeValue("#1A202C", "#FFFFFF");
  const textColor = useColorModeValue("#4A5568", "#CBD5E1");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="12px"
      px={4}
      py={3}
      h="280px"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={headingColor}
        mb={3}
      >
        Degradation Factors (Impact)
      </Text>

      <VStack
        spacing={2}
        align="stretch"
        flex="1"
      >
        {factors.map((item) => (
          <HStack
            key={item.label}
            spacing={3}
            align="center"
          >
            <Text
              w="165px"
              fontSize="13px"
              color={textColor}
            >
              {item.label}
            </Text>

            <Progress
              flex={1}
              value={item.value}
              colorScheme={item.color}
              borderRadius="full"
              size="xs"
              bg={useColorModeValue("#EDF2F7", "#374151")}
            />

            <Text
              minW="55px"
              textAlign="right"
              fontSize="13px"
              fontWeight="600"
              color={item.statusColor}
            >
              {item.status}
            </Text>
          </HStack>
        ))}
              </VStack>

      <Box
        mt={3}
        pt={3}
        borderTop="1px solid"
        borderColor={borderColor}
      >
        <Text
          fontSize="13px"
          fontWeight="700"
          color={headingColor}
          mb={1}
        >
          Recommendation
        </Text>

        <Text
          fontSize="12px"
          color={textColor}
          lineHeight="18px"
        >
          Optimize cooling strategy and reduce charge current during peak
          temperature periods to slow down degradation.
        </Text>
      </Box>
    </Box>
  );
};

export default DegradationFactors;