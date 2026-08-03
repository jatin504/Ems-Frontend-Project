import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const breakdownData = [
  {
    name: "Capacity Health (SOH)",
    weight: "35%",
    score: "92/100",
    color: "#66CC33",
  },
  {
    name: "Resistance Health (IR)",
    weight: "25%",
    score: "90/100",
    color: "#66CC33",
  },
  {
    name: "Temperature Health",
    weight: "15%",
    score: "93/100",
    color: "#66CC33",
  },
  {
    name: "Voltage Consistency",
    weight: "15%",
    score: "89/100",
    color: "#D9C43C",
  },
  {
    name: "Usage Pattern",
    weight: "10%",
    score: "88/100",
    color: "#D9C43C",
  },
];

const HealthScoreBreakdown = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#081724");
  const border = useColorModeValue("#D9E2EC", "#1A3445");
  const titleColor = useColorModeValue("#1F2937", "#FFFFFF");
  const textColor = useColorModeValue("#4B5563", "#C8D2DC");
  const divider = useColorModeValue("#E5E7EB", "#22384A");

  return (
    <Box
      w="100%"
      h="100%"
      minH="0"
      display="flex"
      flexDirection="column"
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="8px"
      px="12px"
      py="4px"
      overflow="hidden"
      boxSizing="border-box"
    >
      {/* Title */}
      <Text
        fontSize="15px"
        fontWeight="600"
        letterSpacing="0.2px"
        color={titleColor}
        mb="6px"
      >
        Health Score Breakdown
      </Text>

      <HStack
        align="stretch"
        spacing="4px"
        flex="1"
        minH="0"
        overflow="hidden"
      >
        {/* Gauge Part */}
        <Box
          w="140px"
          h="140px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          mt="36px"
        >
          <Box position="relative" w="140px" h="140px">
            <svg
              width="140"
              height="140"
              viewBox="0 0 170 170"
            >
              <defs>
                <linearGradient
                  id="healthGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#B8FF4D"
                  />
                  <stop
                    offset="100%"
                    stopColor="#47B300"
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Ring */}
              <circle
                cx="85"
                cy="85"
                r="58"
                stroke={useColorModeValue("#E5E7EB", "#243847")}
                strokeWidth="10"
                fill="none"
              />

              {/* Progress Ring */}
              <circle
                cx="85"
                cy="85"
                r="58"
                stroke="url(#healthGradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="364.42"
                strokeDashoffset="32.8"
                transform="rotate(-90 85 85)"
                filter="url(#glow)"
              />
            </svg>

            {/* Center Text */}
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
                fontSize="42px"
                fontWeight="700"
                lineHeight="44px"
                color={useColorModeValue("#111827", "#FFFFFF")}
              >
                91
              </Text>

              <Text
                mt="0"
                fontSize="15px"
                color={useColorModeValue("#6B7280", "#B9C5CF")}
              >
                /100
              </Text>
            </Flex>
          </Box>
        </Box>

        {/* Table */}
        <VStack
          flex="1"
          align="stretch"
          spacing="2px"
          justify="flex-start"
          minH="0"
          overflow="hidden"
        >
          <Flex
            justify="space-between"
            color={useColorModeValue("#64748B", "#8FA7B8")}
            fontSize="12px"
            fontWeight="600"
          >
            <Text w="165px"></Text>

            <Text w="50px" textAlign="center">
              Weight
            </Text>

            <Text w="60px" textAlign="right">
              Score
            </Text>
          </Flex>

          {breakdownData.map((item) => (
            <React.Fragment key={item.name}>
              <Flex
                justify="space-between"
                align="center"
                py="0"
                minH="0"
              >
                <Text
                  w="165px"
                  fontSize="14px"
                  fontWeight="400"
                  color={textColor}
                >
                  {item.name}
                </Text>

                <Text
                  w="50px"
                  fontSize="14px"
                  textAlign="center"
                  color={textColor}
                >
                  {item.weight}
                </Text>

                <Text
                  w="60px"
                  textAlign="right"
                  fontSize="14px"
                  fontWeight="700"
                  color={item.color}
                >
                  {item.score}
                </Text>
              </Flex>

              <Divider
                mt="2px"
                mb="2px"
                borderColor={divider}
                opacity={0.45}
              />
            </React.Fragment>
          ))}

          <Flex
            justify="space-between"
            align="center"
            pt="6px"
          >
            <Text
              fontSize="15px"
              fontWeight="500"
              color={textColor}
            >
              Overall Rating
            </Text>

            <Text
              fontSize="18px"
              fontWeight="700"
              lineHeight="36px"
              color="#66CC33"
            >
              Good
            </Text>
          </Flex>
        </VStack>
      </HStack>
    </Box>
  );
};

export default HealthScoreBreakdown;