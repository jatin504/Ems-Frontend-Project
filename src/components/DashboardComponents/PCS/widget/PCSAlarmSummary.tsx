import React from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  MdError,
  MdWarningAmber,
  MdInfoOutline,
} from "react-icons/md";

import { AiFillAlert } from "react-icons/ai";

const alarms = [
  {
    time: "19:10:22",
    message: "PCS-07 DC Over Voltage",
    device: "PCS-07",
    severity: "MAJOR",
  },
  {
    time: "19:05:18",
    message: "PCS-12 Communication Lost",
    device: "PCS-12",
    severity: "MAJOR",
  },
  {
    time: "19:02:33",
    message: "PCS-04 Over Temperature",
    device: "PCS-04",
    severity: "MINOR",
  },
  {
    time: "18:55:47",
    message: "PCS-03 AC Voltage High",
    device: "PCS-03",
    severity: "MINOR",
  },
  {
    time: "18:52:11",
    message: "PCS-01 DG Fault",
    device: "PCS-01",
    severity: "INFO",
  },
];

const Counter = ({
  icon,
  color,
  value,
  title,
  textColor,
  subTextColor,
}: any) => (
  <VStack spacing={1} flex={1}>
    <Icon
      as={icon}
      color={color}
      boxSize={5}
    />

    <Text
      color={textColor}
      fontWeight="700"
      fontSize="22px"
      lineHeight="20px"
    >
      {value}
    </Text>

    <Text
      color={subTextColor}
      fontSize="10px"
    >
      {title}
    </Text>
  </VStack>
);

const getBadgeColor = (type: string) => {
  switch (type) {
    case "MAJOR":
      return "orange";

    case "MINOR":
      return "yellow";

    case "INFO":
      return "blue";

    default:
      return "gray";
  }
};

const PCSAlarmSummary = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#0B2239");
  const borderColor = useColorModeValue("rgba(15,23,42,.08)", "rgba(255,255,255,.06)");
  const titleColor = useColorModeValue("#0F172A", "white");
  const mutedColor = useColorModeValue("#64748B", "#9FB1C5");
  const valueColor = useColorModeValue("#0F172A", "white");
  const linkColor = useColorModeValue("#2563EB", "#55A8FF");

  return (
    <Box
      bg={cardBg}
      borderRadius="10px"
      border={`1px solid ${borderColor}`}
      h="300px"
      overflow="hidden"
    >
      {/* Header */}

      <Flex
        justify="space-between"
        align="center"
        px={4}
        py={3}
      >
        <Text
          color={titleColor}
          fontWeight="600"
          fontSize="13px"
        >
          Alarms Summary
        </Text>

        <Text
          color={linkColor}
          fontSize="11px"
          cursor="pointer"
        >
          View All
        </Text>
      </Flex>

      {/* Counters */}

      <HStack
        px={3}
        spacing={1}
      >
        <Counter
          icon={AiFillAlert}
          color="#FF4D4F"
          value={3}
          title="Critical"
          textColor={valueColor}
          subTextColor={mutedColor}
        />

        <Counter
          icon={MdWarningAmber}
          color="#FF9800"
          value={4}
          title="Major"
          textColor={valueColor}
          subTextColor={mutedColor}
        />

        <Counter
          icon={MdWarningAmber}
          color="#FFD43B"
          value={5}
          title="Minor"
          textColor={valueColor}
          subTextColor={mutedColor}
        />

        <Counter
          icon={MdInfoOutline}
          color="#4DA3FF"
          value={12}
          title="Info"
          textColor={valueColor}
          subTextColor={mutedColor}
        />
      </HStack>

      <Box px={4} mt={4}>
        <Text
          color={titleColor}
          fontSize="11px"
          fontWeight="600"
        >
          Recent Alarms
        </Text>
      </Box>
            {/* Recent Alarm List */}
      <VStack
        align="stretch"
        spacing={0}
        mt={2}
        px={4}
      >
        {alarms.map((alarm, index) => (
          <Flex
            key={index}
            align="center"
            justify="space-between"
            py="5px"
            borderBottom={
              index === alarms.length - 1
                ? "none"
                : `1px solid ${borderColor}`
            }
          >
            {/* Time */}
            <Text
              w="58px"
              fontSize="9px"
              color={mutedColor}
            >
              {alarm.time}
            </Text>

            {/* Alarm Message */}
            <Text
              flex={1}
              mx={2}
              color={valueColor}
              fontSize="9px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {alarm.message}
            </Text>

            {/* Device */}
            <Text
              w="55px"
              textAlign="center"
              color={mutedColor}
              fontSize="9px"
            >
              {alarm.device}
            </Text>

            {/* Severity */}
            <Badge
              ml={2}
              px={2}
              py="2px"
              borderRadius="3px"
              fontSize="8px"
              colorScheme={getBadgeColor(alarm.severity)}
            >
              {alarm.severity}
            </Badge>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default PCSAlarmSummary;