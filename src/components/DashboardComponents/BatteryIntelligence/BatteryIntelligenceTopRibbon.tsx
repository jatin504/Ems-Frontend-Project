import React from "react";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiHeart,
  FiClock,
  FiTrendingUp,
  FiRefreshCw,
  FiDatabase,
  FiCalendar,
  FiShield,
} from "react-icons/fi";

const cards = [
  {
    icon: FiHeart,
    title: "AI Health Score",
    value: "91",
    unit: "/ 100",
    footer: "Good",
    color: "#4ADE80",
  },
  {
    icon: FiClock,
    title: "Remaining Useful Life",
    value: "8.6",
    unit: " Years",
    footer: "~ 68 % Life Left",
    color: "#38BDF8",
  },
  {
    icon: FiTrendingUp,
    title: "Degradation Rate",
    value: "1.25",
    unit: " % / Year",
    footer: "Low",
    color: "#22C55E",
  },
  {
    icon: FiRefreshCw,
    title: "Cycle Life Used",
    value: "862",
    unit: " cycles",
    footer: "34 % of 2500",
    color: "#38BDF8",
  },
  {
    icon: FiDatabase,
    title: "Energy Throughput (Life)",
    value: "2569.12",
    unit: " MWh",
    footer: "Total",
    color: "#C084FC",
  },
  {
    icon: FiCalendar,
    title: "Predicted EOL",
    value: "Jun 2035",
    unit: "",
    footer: "± 8 Months",
    color: "#60A5FA",
  },
  {
    icon: FiShield,
    title: "Warranty Status",
    value: "Valid",
    unit: "",
    footer: "Until Feb 2030",
    color: "#84CC16",
  },
];

const BatteryIntelligenceTopRibbon = () => {
  const bg = useColorModeValue("#F8FAFC", "#071827");
  const border = useColorModeValue("#E2E8F0", "#1E3345");
  const titleColor = useColorModeValue("#475569", "#C8D2DC");
  const valueColor = useColorModeValue("#0F172A", "white");
  const unitColor = useColorModeValue("#6B7280", "#9CA3AF");
  const cardBg = useColorModeValue("white", "#0F172A");
  const cardBorder = useColorModeValue("rgba(15,23,42,0.08)", "rgba(255,255,255,0.08)");

  return (
    <Box
      w="100%"
      maxW="1920px"
      mx="auto"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px={2}
      py={2}
      overflowX="auto"
    >
      <Flex minW="1450px">
        {cards.map((item, index) => (
          <Flex
            key={index}
            flex="1"
            minW="200px"
            px={5}
            py={2}
            align="center"
            bg={cardBg}
            borderRight={
              index !== cards.length - 1
                ? `1px solid ${cardBorder}`
                : "none"
            }
          >
            <Box
              w="38px"
              h="38px"
              borderRadius="full"
              border="1px solid"
              borderColor={item.color}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={4}
            >
              <Icon as={item.icon} color={item.color} boxSize={5} />
            </Box>

            <VStack align="start" spacing={0}>
              <Text
                fontSize="12px"
                color={titleColor}
                fontWeight="500"
              >
                {item.title}
              </Text>

              <HStack spacing={1}>
                <Text
                  color={valueColor}
                  fontWeight="700"
                  fontSize="22px"
                  lineHeight="28px"
                >
                  {item.value}
                </Text>

                <Text
                  color={unitColor}
                  fontSize="14px"
                  mt="10px"
                >
                  {item.unit}
                </Text>
              </HStack>

              <Text
                fontSize="13px"
                color={item.color}
                fontWeight="600"
              >
                {item.footer}
              </Text>
            </VStack>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default BatteryIntelligenceTopRibbon;