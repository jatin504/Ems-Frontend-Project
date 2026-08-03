import React from "react";
import {
  Box,
  Divider,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  RepeatIcon,
  DownloadIcon,
  ArrowForwardIcon,
  TimeIcon,
  CalendarIcon,
} from "@chakra-ui/icons";

const cards = [
  {
    title: "Equivalent Full Cycles",
    value: "862",
    unit: "",
    icon: RepeatIcon,
    color: "#A855F7",
  },
  {
    title: "Total Charge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: DownloadIcon,
    color: "#22C55E",
  },
  {
    title: "Total Discharge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: ArrowForwardIcon,
    color: "#3B82F6",
  },
  {
    title: "Lifetime Throughput",
    value: "2569.12",
    unit: "MWh",
    icon: TimeIcon,
    color: "#84CC16",
  },
  {
    title: "Calendar Age",
    value: "14.2",
    unit: "Months",
    icon: CalendarIcon,
    color: "#A855F7",
  },
  {
    title: "Cycle Age",
    value: "10.8",
    unit: "Months",
    icon: TimeIcon,
    color: "#38BDF8",
  },
];

export default function LifetimeThroughput() {
  const bg = useColorModeValue("#FFFFFF", "#0F1B26");
  const border = useColorModeValue("#D8E2EE", "#263849");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#64748B", "#94A3B8");

  return (
    <Box
      w="620px"
      h="300px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="8px"
      overflow="hidden"
    >
      <Box
        px={4}
        py={2}
        borderBottom="1px solid"
        borderColor={border}
      >
        <Text
          fontSize="15px"
          fontWeight="700"
          color={title}
        >
          Lifetime & Throughput
        </Text>
      </Box>

      <Box px={3} py={2}>
        {/* Top Row */}
        <Grid templateColumns="repeat(4,1fr)" gap={0}>
          {cards.slice(0, 4).map((item, index) => (
            <Box
              key={item.title}
              px={3}
              py={2}
              borderRight={index !== 3 ? "1px solid" : "none"}
              borderColor={border}
            >
              <HStack spacing={2} align="flex-start">
                <Box
                  mt="2px"
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  border="1px solid"
                  borderColor={item.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon
                    as={item.icon}
                    boxSize={3.5}
                    color={item.color}
                  />
                </Box>

                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="9px"
                    color={text}
                    lineHeight="11px"
                  >
                    {item.title}
                  </Text>

                  <Text
                    fontSize="27px"
                    fontWeight="700"
                    lineHeight="28px"
                    color={title}
                  >
                    {item.value}
                  </Text>

                  {item.unit && (
                    <Text
                      fontSize="13px"
                      color={text}
                      lineHeight="14px"
                    >
                      {item.unit}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </Box>
          ))}
        </Grid>

        <Divider borderColor={border} my={3} />

        {/* Bottom Row */}
        <Grid templateColumns="repeat(2,1fr)" gap={0}>
          {cards.slice(4).map((item, index) => (
            <Box
              key={item.title}
              px={3}
              py={3}
              borderRight={index !== 1 ? "1px solid" : "none"}
              borderColor={border}
            >
              <HStack spacing={2} align="flex-start">
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  border="1px solid"
                  borderColor={item.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon
                    as={item.icon}
                    boxSize={3.5}
                    color={item.color}
                  />
                </Box>

                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="9px"
                    color={text}
                  >
                    {item.title}
                  </Text>

                  <HStack spacing={1}>
                    <Text
                      fontSize="27px"
                      fontWeight="700"
                      lineHeight="28px"
                      color={title}
                    >
                      {item.value}
                    </Text>

                    <Text
                      fontSize="13px"
                      color={text}
                    >
                      {item.unit}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
    