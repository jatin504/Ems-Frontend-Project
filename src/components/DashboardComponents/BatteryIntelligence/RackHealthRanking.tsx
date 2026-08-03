import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

const rackData = [
  {
    rank: 1,
    rack: "Rack-07",
    health: 96,
    soh: 97.2,
    temp: 31.4,
    status: "Excellent",
    healthColor: "#66CC33",
    statusColor: "#66CC33",
  },
  {
    rank: 2,
    rack: "Rack-02",
    health: 93,
    soh: 96.1,
    temp: 32.1,
    status: "Good",
    healthColor: "#66CC33",
    statusColor: "#66CC33",
  },
  {
    rank: 3,
    rack: "Rack-03",
    health: 91,
    soh: 96.3,
    temp: 32.6,
    status: "Good",
    healthColor: "#9BD33A",
    statusColor: "#9BD33A",
    selected: true,
  },
  {
    rank: 4,
    rack: "Rack-01",
    health: 89,
    soh: 94.8,
    temp: 33.8,
    status: "Fair",
    healthColor: "#D8C63A",
    statusColor: "#D8C63A",
  },
  {
    rank: 5,
    rack: "Rack-05",
    health: 82,
    soh: 92.1,
    temp: 36.5,
    status: "Attention",
    healthColor: "#F59E0B",
    statusColor: "#F59E0B",
  },
  {
    rank: 6,
    rack: "Rack-04",
    health: 76,
    soh: 89.3,
    temp: 38.9,
    status: "Poor",
    healthColor: "#EF4444",
    statusColor: "#EF4444",
  },
];

const RackHealthRanking = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");
  const headingColor = useColorModeValue("#1A202C", "#FFFFFF");
  const textColor = useColorModeValue("#4B5563", "#CBD5E1");
  const headerColor = useColorModeValue("#64748B", "#94A3B8");
  const rowBorder = useColorModeValue("#E5E7EB", "#173040");
  const selectedBg = useColorModeValue("#E8F1FF", "#163B63");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="10px"
      px={4}
      py={3}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Text
        fontSize="16px"
        fontWeight="700"
        color={headingColor}
        mb={3}
      >
        Rack Health Ranking
      </Text>

      {/* Table Header */}
      <Flex
        align="center"
        py={2}
        fontSize="12px"
        color={headerColor}
        fontWeight="600"
      >
        <Text w="40px" textAlign="center">Rank</Text>

        <Text w="90px" textAlign="center">Rack ID</Text>

        <Text w="90px" textAlign="center">
          Health Score
        </Text>

        <Text w="70px" textAlign="center">
          SOH (%)
        </Text>

        <Text w="80px" textAlign="center">
          Temp (°C)
        </Text>

        <Text flex="1" textAlign="center">
          Status
        </Text>
      </Flex>

      <VStack
        spacing={1}
        align="stretch"
        flex="1"
        overflowY="auto"
        pr={1}
      >
        {rackData.map((item) => (
          <Flex
            key={item.rank}
            align="center"
            py="8px"
            px="10px"
            borderRadius="8px"
            bg={item.selected ? selectedBg : "transparent"}
            borderBottom={
              item.rank !== rackData.length ? "1px solid" : "none"
            }
            borderColor={rowBorder}
            _hover={{
              bg: useColorModeValue("#F8FAFC", "#102A43"),
            }}
          >
            {/* Rank */}
            <Text
              w="40px"
              textAlign="center"
              fontSize="15px"
              fontWeight="500"
              color={headingColor}
            >
              {item.rank}
            </Text>

            {/* Rack ID */}
            <Text
              w="90px"
              textAlign="center"
              fontSize="14px"
              color={headingColor}
            >
              {item.rack}
            </Text>

            {/* Health Score */}
            <Text
              w="90px"
              textAlign="center"
              fontSize="14px"
              fontWeight="700"
              color={item.healthColor}
            >
              {item.health}
            </Text>

            {/* SOH */}
            <Text
              w="70px"
              textAlign="center"
              fontSize="14px"
              color={headingColor}
            >
              {item.soh}
            </Text>

            {/* Temperature */}
            <Text
              w="80px"
              textAlign="center"
              fontSize="14px"
              color={headingColor}
            >
              {item.temp}
            </Text>

            {/* Status */}
            <Text
              flex="1"
              textAlign="center"
              fontSize="14px"
              fontWeight="600"
              color={item.statusColor}
            >
              {item.status}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default RackHealthRanking;
      