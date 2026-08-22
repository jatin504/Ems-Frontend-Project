import React from "react";
import {
  Box,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiRefreshCw,
  FiBatteryCharging,
  FiZap,
  FiTrendingUp,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { MdOutlineElectricBolt } from "react-icons/md";
import WidgetTitle from "../../Common/WidgetTitle";

const stats = [
  {
    title: "Equivalent Full Cycles",
    value: "862",
    unit: "cycles",
    icon: FiRefreshCw,
    color: "#F4B400",
  },
  {
    title: "Total Charge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: FiBatteryCharging,
    color: "#34A853",
  },
  {
    title: "Total Discharge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: MdOutlineElectricBolt,
    color: "#4285F4",
  },
  {
    title: "Lifetime Throughput",
    value: "2569.12",
    unit: "MWh",
    icon: FiTrendingUp,
    color: "#8AB4F8",
  },
  {
    title: "Calendar Age",
    value: "14.2",
    unit: "Months",
    icon: FiCalendar,
    color: "#BB86FC",
  },
  {
    title: "Cycle Age",
    value: "10.8",
    unit: "Months",
    icon: FiClock,
    color: "#00BCD4",
  },
  {
    title: "Avg. C-rate (Charge)",
    value: "0.46",
    unit: "C",
    icon: FiZap,
    color: "#4FC3F7",
  },
  {
    title: "Avg. C-rate (Discharge)",
    value: "0.52",
    unit: "C",
    icon: FiZap,
    color: "#29B6F6",
  },
];

const PCSLifetimeThroughput = () => {
  const bg = useColorModeValue("#FFFFFF", "#071C2C");
  const border = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const textColor = useColorModeValue("#0F172A", "#FFFFFF");
  const subColor = useColorModeValue("rgba(15,23,42,0.65)", "rgba(255,255,255,0.65)");
  const itemBg = useColorModeValue("rgba(248,250,252,0.85)", "rgba(255,255,255,0.04)");
  const outerBorder = useColorModeValue("1px solid rgba(15,23,42,0.08)", "1px solid rgba(255,255,255,0.06)");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      p={3}
      border={outerBorder}
      w="100%"
      h="180px"
      overflow="hidden"
    >
      <Box mb={2}>
        <WidgetTitle color={textColor}>Lifetime & Throughput</WidgetTitle>
      </Box>

      <Grid
        templateColumns="repeat(4,1fr)"
        borderTop="1px solid transparent"
      >
        {stats.map((item, index) => (
          <Box
            key={index}
            px={2}
            py={1}
            borderRight={
              index % 4 !== 3 ? `1px solid ${border}` : "none"
            }
            borderBottom={
              index < 4 ? `1px solid ${border}` : "none"
            }
            bg={itemBg}
            borderRadius="md"
          >
            <HStack align="flex-start" spacing={2}>
              <Box
                w="20px"
                h="20px"
                borderRadius="full"
                border={`1px solid ${item.color}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={item.icon}
                  color={item.color}
                  boxSize={3.5}
                />
              </Box>

              <VStack align="start" spacing={0}>
                <Text
                  fontSize="10px"
                  color={subColor}
                  lineHeight="1.2"
                >
                  {item.title}
                </Text>

                <Text
                  color={textColor}
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="1.2"
                >
                  {item.value}
                </Text>

                <Text
                  color={subColor}
                  fontSize="10px"
                >
                  {item.unit}
                </Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default PCSLifetimeThroughput;