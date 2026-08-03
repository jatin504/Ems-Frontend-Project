import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import { BsInfoCircle } from "react-icons/bs";

const schedules = [
  {
    event: "Peak Shaving",
    type: "BESS",
    start: "14:00",
    duration: "2 hr",
    saving: "₹18,450",
    color: "purple",
  },
  {
    event: "Shiftable Load",
    type: "Load",
    start: "10:30",
    duration: "2 hr",
    saving: "₹9,730",
    color: "blue",
  },
  {
    event: "HVAC Optimization",
    type: "HVAC",
    start: "13:00",
    duration: "2 hr",
    saving: "₹6,120",
    color: "cyan",
  },
  {
    event: "Compressors",
    type: "Utility",
    start: "16:00",
    duration: "2 hr",
    saving: "₹8,950",
    color: "green",
  },
];

const OptimizationSchedule = () => {
  const bg = useColorModeValue("white", "#151716");
  const border = useColorModeValue("#E5E7EB", "#2A2A2A");
  const text = useColorModeValue("#111827", "white");
  const sub = useColorModeValue("#64748B", "#A1A1AA");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      border="1px solid"
      borderColor={border}
      h="320px"
      p={2.5}
      display="flex"
      flexDirection="column"
    >
      <Flex
        justify="space-between"
        align="center"
        mb={3}
      >
        <HStack spacing={2}>
          <Text
            fontSize="16px"
            fontWeight="700"
            color={text}
          >
            Optimization Schedule
          </Text>

          <Icon
            as={BsInfoCircle}
            color={sub}
            boxSize={4}
          />
        </HStack>

        <Text
          color="#3B82F6"
          fontSize="12px"
          fontWeight="600"
          cursor="pointer"
        >
          View Calendar
        </Text>
      </Flex>

      <Flex
        px={1}
        pb={1}
        fontWeight="700"
        fontSize="11px"
        color={sub}
      >
        <Box flex={2}>Event</Box>
        <Box flex={1}>Start</Box>
        <Box flex={1}>Duration</Box>
        <Box flex={1} textAlign="right">
          Savings
        </Box>
      </Flex>

      <Divider mb={2} />
            <VStack
        spacing={0}
        align="stretch"
        flex={1}
        justify="space-evenly"
      >
        {schedules.map((item, index) => (
          <React.Fragment key={item.event}>
            <Flex
              align="center"
              minH="48px"
            >
              {/* Event */}

              <Box flex={2}>
                <Text
                  fontSize="13px"
                  fontWeight="600"
                  color={text}
                >
                  {item.event}
                </Text>

                <Badge
                  mt={0.5}
                  colorScheme={item.color}
                  borderRadius="full"
                  px={2}
                  py={0}
                  fontSize="9px"
                >
                  {item.type}
                </Badge>
              </Box>

              {/* Start */}

              <Box flex={1}>
                <Text
                  fontSize="12px"
                  color={text}
                >
                  {item.start}
                </Text>
              </Box>

              {/* Duration */}

              <Box flex={1}>
                <Text
                  fontSize="12px"
                  color={text}
                >
                  {item.duration}
                </Text>
              </Box>

              {/* Savings */}

              <Box
                flex={1}
                textAlign="right"
              >
                <Text
                  fontSize="13px"
                  fontWeight="700"
                  color="#16A34A"
                >
                  {item.saving}
                </Text>
              </Box>
            </Flex>

            {index !== schedules.length - 1 && (
              <Divider />
            )}
          </React.Fragment>
        ))}
      </VStack>

      <Divider mt={1} flexShrink={0} />

      <Flex
        justify="space-between"
        align="center"
        mt={2}
        flexShrink={0}
      >
        <Text
          color={sub}
          fontSize="12px"
        >
          Today's Scheduled Savings
        </Text>

        <Text
          fontSize="18px"
          fontWeight="700"
          color="#16A34A"
        >
          ₹43,250
        </Text>
      </Flex>
          </Box>
  );
};

export default OptimizationSchedule;