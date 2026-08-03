import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiActivity,
  FiUsers,
  FiWind,
} from "react-icons/fi";

import { MdFactory } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";

const opportunities = [
  {
    title: "Peak Shaving",
    time: "14:00 - 16:00",
    reduction: "1.35 MW",
    saving: "₹ 18,450",
    icon: FiActivity,
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
  {
    title: "Shiftable Load",
    time: "10:30 - 12:30",
    reduction: "0.85 MW",
    saving: "₹ 9,730",
    icon: FiUsers,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    title: "HVAC Optimization",
    time: "13:00 - 15:00",
    reduction: "0.60 MW",
    saving: "₹ 6,120",
    icon: FiWind,
    color: "#06B6D4",
    bg: "#CFFAFE",
  },
  {
    title: "Compressors Staging",
    time: "16:00 - 18:00",
    reduction: "0.75 MW",
    saving: "₹ 8,950",
    icon: MdFactory,
    color: "#22C55E",
    bg: "#DCFCE7",
  },
];

const DSMOpportunities = () => {
  const bg = useColorModeValue("white", "#151716");
  const border = useColorModeValue("#E6E8EC", "#2A2A2A");
  const text = useColorModeValue("#111827", "white");
  const sub = useColorModeValue("#64748B", "#A1A1AA");
  const green = "#4CAF50";

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      border="1px solid"
      borderColor={border}
      h="320px"
      p={4}
      display="flex"
      flexDirection="column"
    >
      <Flex
        justify="space-between"
        align="center"
        mb={2}
      >
        <HStack spacing={2}>
          <Text
            fontSize="18px"
            fontWeight="700"
            color={text}
          >
            DSM Opportunities
          </Text>

          <Text
            fontSize="13px"
            color={sub}
          >
            (Today)
          </Text>

          <Icon
            as={BsInfoCircle}
            color={sub}
            boxSize={4}
          />
        </HStack>

        <Text
          color="#3B82F6"
          fontWeight="600"
          cursor="pointer"
          fontSize="13px"
        >
          View All
        </Text>
      </Flex>

      <VStack
        spacing={0}
        align="stretch"
        flex="1"
      >
        {opportunities.map((item) => (
  <React.Fragment key={item.title}>
    <Flex
      justify="space-between"
      align="center"
      w="100%"
      py={0}
      minH="46px"
    >
      {/* Left */}
      <HStack spacing={4} flex={1}>
        <Flex
          w="34px"
          h="30px"
          borderRadius="12px"
          bg={useColorModeValue(item.bg, "whiteAlpha.100")}
          align="center"
          justify="center"
        >
          <Icon
            as={item.icon}
            color={item.color}
            boxSize={5}
          />
        </Flex>

        <VStack
          align="start"
          spacing={0}
          minW="155px"
        >
          <Text
            fontSize="14px"
            fontWeight="700"
            color={text}
          >
            {item.title}
          </Text>

          <Text
            fontSize="13px"
            color={sub}
            fontWeight="500"
          >
            {item.time}
          </Text>
        </VStack>
      </HStack>

      {/* Center */}
      <VStack
        align="start"
        spacing={0}
        minW="130px"
      >
        <Text
          fontSize="13px"
          color={sub}
        >
          Potential Reduction
        </Text>

        <Text
          fontSize="14px"
          fontWeight="700"
          color={text}
        >
          {item.reduction}
        </Text>
      </VStack>

      {/* Savings */}
      <VStack
        align="start"
        spacing={0}
        minW="120px"
      >
        <Text
          fontSize="13px"
          color={sub}
        >
          Est. Savings
        </Text>

        <Text
          fontSize="14px"
          fontWeight="700"
          color={green}
        >
          {item.saving}
        </Text>
      </VStack>

      {/* Button */}
      <Button
        size="xs"
        variant="outline"
        colorScheme="blue"
        borderRadius="10px"
        minW="90px"
        h="34px"
      >
        Schedule
      </Button>
    </Flex>

    {item.title !== "Compressors Staging" && (
      <Divider
        borderColor={border}
      />
    )}
  </React.Fragment>
))}
      </VStack>

      <Divider borderColor={border} mt={1} />

      <Flex
        mt={0}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={2}
      >
        <HStack spacing={3}>
          <VStack align="start" spacing={0}>
            <Text
              fontSize="12px"
              color={sub}
            >
              Total Potential Reduction
            </Text>

            <Text
              fontSize="15px"
              fontWeight="700"
              color={text}
            >
              3.55 MW
            </Text>
          </VStack>

          <VStack align="start" spacing={0}>
            <Text
              fontSize="12px"
              color={sub}
            >
              Total Est. Savings
            </Text>

            <Text
              fontSize="15px"
              fontWeight="700"
              color={green}
            >
              ₹ 43,250
            </Text>
          </VStack>
        </HStack>

        <Button
          colorScheme="blue"
          size="xs"
          h="34px"
          px={6}
          borderRadius="10px"
        >
          Schedule All
        </Button>
      </Flex>
  </Box>
);

};

export default DSMOpportunities;
      