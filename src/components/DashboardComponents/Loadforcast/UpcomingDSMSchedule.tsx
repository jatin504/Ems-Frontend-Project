import React from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const schedule = [
  {
    event: "Peak Shaving Event",
    start: "14:00",
    end: "16:00",
    reduction: "1.50 MW",
  },
  {
    event: "Demand Charge Event",
    start: "18:00",
    end: "20:00",
    reduction: "1.20 MW",
  },
  {
    event: "TOU Optimization",
    start: "22:00",
    end: "06:00",
    reduction: "0.80 MW",
  },
];

export default function UpcomingDSMSchedule() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const border = useColorModeValue("#D8E2EC", "#18344B");

  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const text = useColorModeValue("#475569", "#A8BED1");
  const head = useColorModeValue("#64748B", "#94A3B8");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="100%"
      p={4}
    >
      <HStack justify="space-between" mb={4}>
        <Text
          fontSize="15px"
          fontWeight="700"
          color={title}
        >
          Upcoming DSM Schedule
        </Text>

        <Text
          fontSize="12px"
          fontWeight="600"
          color="#3B82F6"
          cursor="pointer"
        >
          View Calendar
        </Text>
      </HStack>

      {/* Header */}
      <HStack
        pb={2}
        borderBottom="1px solid"
        borderColor={border}
        color={head}
        fontSize="11px"
        fontWeight="600"
      >
        <Box w="42%">
          <Text>Event</Text>
        </Box>

        <Box w="18%">
          <Text>Start Time</Text>
        </Box>

        <Box w="18%">
          <Text>End Time</Text>
        </Box>

        <Box w="22%" textAlign="right">
          <Text>Target Reduction</Text>
        </Box>
      </HStack>

      <VStack
        spacing={0}
        align="stretch"
      >
        {schedule.map((item) => (
          <HStack
            key={item.event}
            py={3}
            borderBottom="1px solid"
            borderColor={border}
            fontSize="12px"
          >
            <Box w="42%">
              <Text color={title}>
                {item.event}
              </Text>
            </Box>

            <Box w="18%">
              <Text color={text}>
                {item.start}
              </Text>
            </Box>

            <Box w="18%">
              <Text color={text}>
                {item.end}
              </Text>
            </Box>

            <Box
              w="22%"
              textAlign="right"
            >
              <Text
                color={title}
                fontWeight="500"
              >
                {item.reduction}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}