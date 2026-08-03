import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  CheckCircleIcon,
  WarningIcon,
} from "@chakra-ui/icons";

const anomalyData = [
  {
    title: "Cell Voltage Imbalance",
    severity: "Low",
    severityColor: "#66CC33",
    status: "Normal",
    statusColor: "#66CC33",
    icon: CheckCircleIcon,
  },
  {
    title: "Internal Resistance Outlier",
    severity: "Medium",
    severityColor: "#F4B400",
    status: "Warning",
    statusColor: "#F4B400",
    icon: WarningIcon,
  },
  {
    title: "Temperature Gradient",
    severity: "High",
    severityColor: "#FF3B30",
    status: "Warning",
    statusColor: "#F4B400",
    icon: WarningIcon,
  },
  {
    title: "Abnormal Capacity Drop",
    severity: "Low",
    severityColor: "#66CC33",
    status: "Normal",
    statusColor: "#66CC33",
    icon: CheckCircleIcon,
  },
];

const AnomalyDetection = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");
  const headingColor = useColorModeValue("#1A202C", "#FFFFFF");
  const textColor = useColorModeValue("#4B5563", "#CBD5E1");
  const dividerColor = useColorModeValue("#E5E7EB", "#173040");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="10px"
      px={4}
      py={3}
      h="100%"
    >
      <Text
        fontSize="16px"
        fontWeight="700"
        color={headingColor}
        mb={4}
      >
        Anomaly Detection
      </Text>

      <VStack
        spacing={0}
        align="stretch"
      >
                {anomalyData.map((item, index) => (
          <React.Fragment key={item.title}>
            <Flex
              align="center"
              justify="space-between"
              py={3}
            >
              {/* Left */}
              <Text
                flex="1"
                fontSize="14px"
                color={textColor}
              >
                {item.title}
              </Text>

              {/* Severity */}
              <Text
                w="70px"
                textAlign="center"
                fontSize="14px"
                fontWeight="600"
                color={item.severityColor}
              >
                {item.severity}
              </Text>

              {/* Status */}
              <HStack
                w="85px"
                justify="flex-end"
                spacing={1}
              >
                <Icon
                  as={item.icon}
                  color={item.statusColor}
                  boxSize={4}
                />

                <Text
                  fontSize="12px"
                  fontWeight="600"
                  color={item.statusColor}
                >
                  {item.status}
                </Text>
              </HStack>
            </Flex>

            {index !== anomalyData.length - 1 && (
              <Box
                h="1px"
                bg={dividerColor}
                opacity={0.6}
              />
            )}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default AnomalyDetection;
      