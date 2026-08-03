import React from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Icon,
  Circle,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import WidgetTitle from "../../Common/WidgetTitle";

import {
  FiBatteryCharging,
  FiThermometer,
  FiActivity,
  FiInfo,
} from "react-icons/fi";

import {
  MdOutlineBatteryChargingFull,
  MdBolt,
} from "react-icons/md";

import { BsArrowRepeat, BsShieldCheck } from "react-icons/bs";

interface Metric {
  title: string;
  value: string;
  unit?: string;
  icon: any;
  color: string;
  bg: string;
}

interface BottomMetricProps {
  title: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  icon: any;
  iconColor: string;
  borderColor: string;
}

const topMetrics: Metric[] = [
  {
    title: "Equivalent Full Cycles",
    value: "862",
    icon: BsArrowRepeat,
    color: "#9333EA",
    bg: "#F3E8FF",
  },
  {
    title: "Total Charge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: MdBolt,
    color: "#65A30D",
    bg: "#ECFCCB",
  },
  {
    title: "Total Discharge Energy",
    value: "1284.56",
    unit: "MWh",
    icon: FiActivity,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    title: "Lifetime Throughput",
    value: "2569.12",
    unit: "MWh",
    icon: MdOutlineBatteryChargingFull,
    color: "#EA580C",
    bg: "#FFEDD5",
  },
  {
    title: "Calendar Age",
    value: "14.2",
    unit: "Months",
    icon: FiBatteryCharging,
    color: "#7C3AED",
    bg: "#F3E8FF",
  },
  {
    title: "Cycle Age",
    value: "10.8",
    unit: "Months",
    icon: FiBatteryCharging,
    color: "#0891B2",
    bg: "#CFFAFE",
  },
];

const MetricCard = ({ item }: { item: Metric }) => (
  <GridItem
    p={2.5}
    borderRight="1px solid"
    borderBottom="1px solid"
    borderColor="gray.200"
    overflow="hidden"
  >
    <HStack align="center" spacing={2} w="100%">
      <Circle size="34px" bg={item.bg} flexShrink={0}>
        <Icon as={item.icon} color={item.color} boxSize={4} />
      </Circle>

      <VStack align="start" spacing={0} flex="1" minW={0}>
        <Text
          fontSize="10px"
          color="gray.500"
          lineHeight="12px"
          whiteSpace="normal"
        >
          {item.title}
        </Text>

        <HStack spacing={1} align="baseline" flexWrap="wrap">
          <Text fontSize="15px" fontWeight="700" lineHeight="18px">
            {item.value}
          </Text>

          {item.unit && (
            <Text fontSize="10px" color="gray.500">
              {item.unit}
            </Text>
          )}
        </HStack>
      </VStack>
    </HStack>
  </GridItem>
);

const BottomMetric = ({
  title,
  value,
  unit,
  status,
  statusColor,
  icon,
  iconColor,
  borderColor,
}: BottomMetricProps) => (
  <GridItem p={3} borderRight="1px solid" borderColor={borderColor}>
    <VStack h="100%" align="stretch" spacing={2}>
      <HStack spacing={2}>
        <Icon as={icon} color={iconColor} boxSize={4} />
        <Text fontSize="11px" color="gray.500">
          {title}
        </Text>
      </HStack>

      <VStack flex={1} justify="center" spacing={1}>
        <HStack spacing={0.5} justify="center">
          <Text fontSize="22px" fontWeight="700" lineHeight="22px">
            {value}
          </Text>
          <Text fontSize="11px" color="gray.500" mt="6px">
            {unit}
          </Text>
        </HStack>

        <Badge colorScheme={statusColor} fontSize="9px" px={2} py={0.5} alignSelf="center">
          {status}
        </Badge>
      </VStack>
    </VStack>
  </GridItem>
);

interface Props {
  selectedDevice?: string;
}

const BatteryHealthOverview: React.FC<Props> = ({ selectedDevice }) => {
  void selectedDevice;

  const bg = useColorModeValue("white", "#111827");
  const border = useColorModeValue("#E2E8F0", "whiteAlpha.200");

  return (
    <Box
      w="525px"
      h="344px"
      bg={bg}
      borderRadius="16px"
      border="1px solid"
      borderColor={border}
      overflow="hidden"
      minW={0}
    >
      {/* Header */}

      <HStack
        h="46px"
        px={4}
        justify="space-between"
        borderBottom="1px solid"
        borderColor={border}
      >
        <HStack spacing={3}>
          

          <VStack align="start" spacing={0}>
            <WidgetTitle>Battery Health Overview</WidgetTitle>

            <Text fontSize="9px" color="gray.500">
              Lifetime performance & health summary
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={3}>
          <Badge
            colorScheme="green"
            borderRadius="full"
            px={2}
            py={0.5}
            fontSize="10px"
          >
            <HStack spacing={1}>
              <Icon as={BsShieldCheck} />
              <Text>Excellent</Text>
            </HStack>
          </Badge>

          <Icon as={FiInfo} color="gray.500" boxSize={5} />
        </HStack>
      </HStack>

      <Grid
        w="100%"
        minW={0}
        templateColumns="repeat(3, minmax(0, 1fr))"
        templateRows="repeat(2, 84px)"
      >
        {topMetrics.map((item) => (
          <MetricCard
            key={item.title}
            item={item}
          />
        ))}
      </Grid>
            <Divider />

      <Grid templateColumns="repeat(4,1fr)" h="124px">
        <BottomMetric
          title="Max Cell Voltage"
          value="3.652"
          unit="V"
          status="Normal"
          statusColor="green"
          icon={MdBolt}
          iconColor="orange.400"
          borderColor={border}
        />

        <BottomMetric
          title="Voltage Delta"
          value="12"
          unit="mV"
          status="Excellent"
          statusColor="green"
          icon={MdBolt}
          iconColor="blue.500"
          borderColor={border}
        />

        <BottomMetric
          title="Max Temperature"
          value="31.8"
          unit="°C"
          status="Normal"
          statusColor="green"
          icon={FiThermometer}
          iconColor="red.400"
          borderColor={border}
        />

        <BottomMetric
          title="Temperature Delta"
          value="2.4"
          unit="°C"
          status="Stable"
          statusColor="yellow"
          icon={FiThermometer}
          iconColor="orange.500"
          borderColor="transparent"
        />
      </Grid>
    </Box>
  );
};

export default BatteryHealthOverview;