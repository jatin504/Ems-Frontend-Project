import React from "react";
import {
  Box,
  Grid,
  HStack,
  Icon,
  Progress,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiMonitor,
  FiActivity,
  FiTarget,
  FiZap,
  FiDollarSign,
  FiDroplet,
} from "react-icons/fi";

const cards = [
  {
    title: "Current Total Load",
    value: "6.42",
    unit: "MW",
    sub: "64.2% of Capacity",
    progress: 64,
    color: "#4ADE80",
    icon: FiMonitor,
  },
  {
    title: "Forecasted Load (Next 1 Hr)",
    value: "7.15",
    unit: "MW",
    sub: "71.5% of Capacity",
    progress: 72,
    color: "#3B82F6",
    icon: FiActivity,
  },
  {
    title: "Peak Load Today",
    value: "8.71",
    unit: "MW",
    sub: "At 14:15 Hrs",
    progress: 0,
    color: "#A855F7",
    icon: FiTarget,
  },
  {
    title: "DSM Active Reduction",
    value: "1.35",
    unit: "MW",
    sub: "21.0% of Current Load",
    progress: 21,
    color: "#F59E0B",
    icon: FiZap,
  },
  {
    title: "Est. Savings Today",
    value: "₹ 43,250",
    unit: "",
    sub: "vs Without DSM",
    right: "▲ 25.8%",
    color: "#22C55E",
    icon: FiDollarSign,
  },
  {
    title: "CO₂ Avoided Today",
    value: "2.35",
    unit: "TCO₂",
    sub: "vs Without DSM",
    right: "▲ 12.4%",
    color: "#22D3EE",
    icon: FiDroplet,
  },
];

export default function LoadForecastTopRibbon() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const cardBg = useColorModeValue("#FFFFFF", "#0B1A2A");
  const border = useColorModeValue("#D8E2EC", "#1C3850");
  const title = useColorModeValue("#64748B", "#9CAFC3");
  const text = useColorModeValue("#0F172A", "#F8FAFC");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      w="100%"
    >
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(6, 1fr)" }}
        gap={3}
        overflow="hidden"
      >
        {cards.map((item) => (
          <Box
            key={item.title}
            bg={cardBg}
            border="1px solid"
            borderColor={border}
            borderRadius="10px"
            px={4}
            py={3}
            minH="104px"
          >
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <HStack spacing={2}>
                  <Box
                    p={2}
                    borderRadius="8px"
                    bg={`${item.color}20`}
                  >
                    <Icon
                      as={item.icon}
                      color={item.color}
                      boxSize={4}
                    />
                  </Box>

                  <Text
                    fontSize="12px"
                    color={title}
                    fontWeight="500"
                  >
                    {item.title}
                  </Text>
                </HStack>
              </HStack>

              <HStack spacing={1} align="baseline">
                <Text
                fontSize="24px"
                  color={item.color}
                >
                  {item.value}
                </Text>

                {item.unit && (
                  <Text
                    color={text}
                    fontWeight="600"
                    fontSize="14px"
                  >
                    {item.unit}
                  </Text>
                )}
              </HStack>

              <HStack justify="space-between">
                <Text
                  fontSize="12px"
                  color={title}
                >
                  {item.sub}
                </Text>

                {item.right && (
                  <Text
                    fontSize="12px"
                    color="#22C55E"
                    fontWeight="700"
                  >
                    {item.right}
                  </Text>
                )}
              </HStack>

              {item.progress > 0 && (
                <Progress
                  value={item.progress}
                  colorScheme="green"
                  bg={useColorModeValue("#EDF2F7", "#163047")}
                  sx={{
                    "> div": {
                      background: item.color,
                    },
                  }}
                  borderRadius="full"
                  h="5px"
                />
              )}
            </VStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}