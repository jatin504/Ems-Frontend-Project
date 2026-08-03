import React from "react";
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiBatteryCharging,
  FiRefreshCcw,
  FiRotateCcw,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

import { TbChargingPile } from "react-icons/tb";
import { MdOutlineSpeed } from "react-icons/md";

const analytics = [
  {
    title: "Total Charge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: FiBatteryCharging,
    color: "#84CC16",
  },
  {
    title: "Total Discharge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: TbChargingPile,
    color: "#F59E0B",
  },
  {
    title: "Equivalent Full Cycles",
    value: "862",
    unit: "Cycles",
    icon: FiRefreshCcw,
    color: "#D946EF",
  },
  {
    title: "Calendar Age",
    value: "14.2",
    unit: "Months",
    icon: FiCalendar,
    color: "#38BDF8",
  },
  {
    title: "Cycle Age",
    value: "10.8",
    unit: "Months",
    icon: FiClock,
    color: "#38BDF8",
  },
  {
    title: "Avg. C-rate (Charge)",
    value: "0.46",
    unit: "C",
    icon: MdOutlineSpeed,
    color: "#22C55E",
  },
  {
    title: "Avg. C-rate (Discharge)",
    value: "0.52",
    unit: "C",
    icon: MdOutlineSpeed,
    color: "#06B6D4",
  },
  {
    title: "Idle Time",
    value: "18.6",
    unit: "%",
    icon: FiRotateCcw,
    color: "#EAB308",
  },
];

const LifetimeAnalytics = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");
  const titleColor = useColorModeValue("#1F2937", "#FFFFFF");
  const textColor = useColorModeValue("#4B5563", "#CBD5E1");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="10px"
      px={4}
      py={3}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Text
        fontSize="16px"
        fontWeight="700"
        color={titleColor}
        mb={3}
      >
        Lifetime Analytics
      </Text>

      <Grid
        templateColumns="repeat(4,1fr)"
        templateRows="repeat(2,1fr)"
        flex="1"
        borderTop="1px solid"
        borderLeft="1px solid"
        borderColor={borderColor}
      >
                {analytics.map((item, index) => (
          <GridItem
            key={item.title}
            borderRight="1px solid"
            borderBottom="1px solid"
            borderColor={borderColor}
            px={2}
            py={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <VStack
              align="center"
              justify="center"
              spacing={1}
              h="100%"
              textAlign="center"
            >
              <Icon
                as={item.icon}
                boxSize={5}
                color={item.color}
              />

              <Text
                fontSize="10px"
                lineHeight="14px"
                color={textColor}
                textAlign="center"
              >
                {item.title}
              </Text>

              <Text
                fontSize="18px"
                textAlign="center"
                fontWeight="700"
                lineHeight="20px"
                color={titleColor}
              >
                {item.value}
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                textAlign="center"
              >
                {item.unit}
              </Text>
            </VStack>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default LifetimeAnalytics;
     