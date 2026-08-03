import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";

const eventData = [
  {
    event: "High Temp. Exposure (>45°C)",
    occurrence: 6,
    impact: "-0.35 %",
    value: 90,
  },
  {
    event: "Over Charge Current",
    occurrence: 3,
    impact: "-0.22 %",
    value: 72,
  },
  {
    event: "Deep Discharge (<10% SOC)",
    occurrence: 1,
    impact: "-0.10 %",
    value: 55,
  },
  {
    event: "Rapid Charge Events",
    occurrence: 4,
    impact: "-0.18 %",
    value: 52,
  },
];

const EventImpactAnalysis = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");
  const headingColor = useColorModeValue("#1A202C", "#FFFFFF");
  const textColor = useColorModeValue("#475569", "#CBD5E1");
  const headerColor = useColorModeValue("#64748B", "#94A3B8");
  const dividerColor = useColorModeValue("#E5E7EB", "#173040");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="10px"
      px={3}
      py={2}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={headingColor}
        mb={2}
      >
        Event Impact Analysis (Last 30 Days)
      </Text>

      {/* Header */}
      <Flex
        fontSize="11px"
        color={headerColor}
        fontWeight="600"
        pb={1}
      >
        <Text w="190px">Event Type</Text>

        <Text
          w="55px"
          textAlign="center"
        >
          Occurrences
        </Text>

        <Text
          flex="1"
          textAlign="center"
        >
          Impact on Health
        </Text>
      </Flex>

      <VStack
        spacing={0}
        align="stretch"
        flex="1"
        justify="space-evenly"
      >
                {eventData.map((item, index) => (
          <React.Fragment key={item.event}>
            <Flex
              align="center"
              py={1}
              minH="30px"
            >
              {/* Event */}
              <Text
                w="190px"
                fontSize="12px"
                color={textColor}
                noOfLines={1}
              >
                {item.event}
              </Text>

              {/* Occurrences */}
              <Text
                w="55px"
                textAlign="center"
                fontSize="12px"
                color={headingColor}
              >
                {item.occurrence}
              </Text>

              {/* Impact */}
              <HStack
                flex="1"
                spacing={2}
              >
                <Progress
                  flex={1}
                  value={item.value}
                  size="sm"
                  borderRadius="full"
                  bg={useColorModeValue("#E5E7EB", "#374151")}
                  sx={{
                    "& > div": {
                      background:
                        "linear-gradient(90deg,#FF3B30 0%,#FF8A3D 100%)",
                    },
                  }}
                />

                <Text
                  minW="48px"
                  textAlign="right"
                  fontSize="12px"
                  color={headingColor}
                >
                  {item.impact}
                </Text>
              </HStack>
            </Flex>

            {index !== eventData.length - 1 && (
              <Box
                h="0.5px"
                bg={dividerColor}
                opacity={0.6}
              />
            )}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default EventImpactAnalysis;
      