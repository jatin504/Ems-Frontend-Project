import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiZap,
  FiSettings,
  FiHome,
  FiWind,
} from "react-icons/fi";

const events = [
  {
    icon: FiZap,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.18)",
    title: "Peak Shaving Event Started",
    subtitle: "Target Reduction: 1.50 MW",
    time: "10:00 AM",
  },
  {
    icon: FiSettings,
    color: "#5BC248",
    bg: "rgba(91,194,72,0.18)",
    title: "HVAC Load Reduction Activated",
    subtitle: "Reduction: 0.30 MW",
    time: "10:02 AM",
  },
  {
    icon: FiHome,
    color: "#47C97B",
    bg: "rgba(71,201,123,0.18)",
    title: "Chiller Plant Load Reduced",
    subtitle: "Reduction: 0.40 MW",
    time: "10:05 AM",
  },
  {
    icon: FiWind,
    color: "#7ED957",
    bg: "rgba(126,217,87,0.18)",
    title: "Lighting Zone B Reduced",
    subtitle: "Reduction: 0.35 MW",
    time: "10:07 AM",
  },
];

export default function DSMEventTimeline() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const border = useColorModeValue("#D8E2EC", "#18344B");

  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const text = useColorModeValue("#475569", "#A8BED1");

  const cardBg = useColorModeValue("#F8FAFC", "#0C1F31");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="100%"
      p={3}
      overflow="hidden"
    >
      <HStack
        justify="space-between"
        mb={2}
      >
        <Text
          fontSize="14px"
          fontWeight="700"
          color={title}
        >
          DSM Event Timeline
        </Text>

        <Text
          fontSize="11px"
          color="#3B82F6"
          cursor="pointer"
          fontWeight="600"
        >
          View All
        </Text>
      </HStack>

      <VStack
        spacing={1}
        align="stretch"
        h="calc(100% - 28px)"
        justify="space-between"
      >
                {events.map((event) => (
          <HStack
            key={event.title}
            align="center"
            justify="space-between"
            bg={cardBg}
            border="1px solid"
            borderColor={border}
            borderRadius="8px"
            px={2}
            py={1}
            minH="40px"
          >
            <HStack align="flex-start" spacing={3} flex={1}>
              <Box
                w="22px"
                h="22px"
                borderRadius="5px"
                bg={event.bg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon
                  as={event.icon}
                  color={event.color}
                  boxSize={3}
                />
              </Box>

              <VStack
                align="start"
                spacing={0}
                flex={1}
              >
                <Text
                  color={title}
                  fontSize="11px"
                  fontWeight="500"
                  lineHeight="14px"
                >
                  {event.title}
                </Text>

                <Text
                  color={text}
                  fontSize="10px"
                  lineHeight="12px"
                >
                  {event.subtitle}
                </Text>
              </VStack>
            </HStack>

            <Text
              color={text}
              fontSize="10px"
              whiteSpace="nowrap"
              ml={2}
            >
              {event.time}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
    