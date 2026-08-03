import React from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const NextMaintenancePrediction = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");
  const headingColor = useColorModeValue("#1A202C", "#FFFFFF");
  const textColor = useColorModeValue("#64748B", "#CBD5E1");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="10px"
      px={4}
      py={3}
      h="100%"
    >
      <Text
        fontSize="16px"
        fontWeight="700"
        color={headingColor}
        mb={5}
      >
        Next Maintenance Prediction
      </Text>

      <HStack
        justify="space-between"
        align="center"
        h="150px"
      >
        {/* Left Side */}
        <VStack
          align="flex-start"
          spacing={3}
        >
          <Text
            fontSize="13px"
            color={textColor}
          >
            Recommended Service Date
          </Text>

          <Text
            fontSize="24px"
            fontWeight="700"
            color={headingColor}
            lineHeight="28px"
          >
            24 Aug 2026
          </Text>

          <Text
            fontSize="16px"
            fontWeight="600"
            lineHeight="20px"
            color="#66CC33"
          >
            (In 45 Days)
          </Text>
        </VStack>

        {/* Gauge */}
        <Box
          position="relative"
          w="140px"
          h="140px"
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
          >
            <circle
              cx="70"
              cy="70"
              r="55"
              stroke="#444"
              strokeWidth="14"
              fill="none"
            />

            <circle
              cx="70"
              cy="70"
              r="55"
              stroke="#66CC33"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="345"
              strokeDashoffset="120"
              transform="rotate(-90 70 70)"
            />
          </svg>
                    <Flex
            position="absolute"
            top="0"
            left="0"
            w="140px"
            h="140px"
            direction="column"
            justify="center"
            align="center"
          >
            <Text
              fontSize="22px"
              fontWeight="700"
              color={headingColor}
              lineHeight="24px"
            >
              45
            </Text>

            <Text
              fontSize="13px"
              color={textColor}
              mt={1}
            >
              Days Left
            </Text>
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
};

export default NextMaintenancePrediction;