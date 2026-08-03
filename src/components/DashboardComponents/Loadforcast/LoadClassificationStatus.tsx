import React from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiShield,
  FiShieldOff,
  FiCheckCircle,
} from "react-icons/fi";

const loadData = [
  {
    name: "Critical Load",
    value: 2.15,
    percent: "33.5%",
    color: "#EF4444",
  },
  {
    name: "Semi-Critical Load",
    value: 2.28,
    percent: "35.5%",
    color: "#F59E0B",
  },
  {
    name: "Non-Critical Load",
    value: 2.00,
    percent: "31.0%",
    color: "#58C04D",
  },
];

const statusCards = [
  {
    title: "Critical Load (Cannot Shed)",
    value: "2.15 MW",
    percent: "33.5%",
    status: "Protected",
    statusColor: "#58C04D",
    icon: FiShieldOff,
    color: "#EF4444",
  },
  {
    title: "Semi-Critical Load (Can Reduce)",
    value: "2.28 MW",
    percent: "35.5%",
    status: "Active",
    statusColor: "#F59E0B",
    icon: FiShield,
    color: "#F59E0B",
  },
  {
    title: "Non-Critical Load (Can Shed)",
    value: "2.00 MW",
    percent: "31.0%",
    status: "Active",
    statusColor: "#22C55E",
    icon: FiCheckCircle,
    color: "#58C04D",
  },
];

export default function LoadClassificationStatus() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const border = useColorModeValue("#D8E2EC", "#18344B");

  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const text = useColorModeValue("#64748B", "#A8BED1");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={4}
      h="100%"
    >
      <Text
        fontSize="15px"
        fontWeight="600"
        color={title}
        mb={4}
      >
        Load Classification & Control Status
      </Text>

      <Grid
        templateColumns="120px 1fr"
        gap={4}
        alignItems="center"
      >
                {/* Donut */}
        <GridItem>
          <Box
            position="relative"
            w="120px"
            h="120px"
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <g transform="rotate(-90 60 60)">
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="18"
                  strokeDasharray="84 251"
                  strokeDashoffset="0"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="18"
                  strokeDasharray="89 251"
                  strokeDashoffset="-84"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke="#58C04D"
                  strokeWidth="18"
                  strokeDasharray="78 251"
                  strokeDashoffset="-173"
                />
              </g>
            </svg>

            <VStack
              position="absolute"
              inset={0}
              justify="center"
              spacing={0}
            >
              <Text
                color={title}
                fontWeight="700"
                fontSize="22px"
                lineHeight="24px"
              >
                6.42
              </Text>

              <Text
                color={text}
                fontSize="13px"
              >
                MW
              </Text>
            </VStack>
          </Box>
        </GridItem>

        {/* Legend */}
        <GridItem>
          <VStack
            align="stretch"
            spacing={4}
          >
            {loadData.map((item) => (
              <HStack
                key={item.name}
                justify="space-between"
              >
                <HStack spacing={3}>
                  <Box
                    w="12px"
                    h="12px"
                    borderRadius="3px"
                    bg={item.color}
                  />

                  <Text
                    color={text}
                    fontSize="13px"
                  >
                    {item.name}
                  </Text>
                </HStack>

                <Text
                  color={title}
                  fontSize="13px"
                  fontWeight="500"
                >
                  {item.value.toFixed(2)} MW ({item.percent})
                </Text>
              </HStack>
            ))}
          </VStack>
        </GridItem>
      </Grid>
      <VStack
        mt={6}
        spacing={3}
        align="stretch"
      >
        {statusCards.map((item) => (
          <Box
            key={item.title}
            border="1px solid"
            borderColor={border}
            borderRadius="10px"
            p={3}
          >
            <HStack
              justify="space-between"
              align="flex-start"
            >
              <HStack spacing={3} align="flex-start">
                <Box
                  w="38px"
                  h="38px"
                  borderRadius="10px"
                  bg={`${item.color}20`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={item.icon}
                    color={item.color}
                    boxSize={5}
                  />
                </Box>

                <VStack
                  align="start"
                  spacing={0}
                >
                  <Text
                    fontSize="13px"
                    fontWeight="600"
                    color={title}
                  >
                    {item.title}
                  </Text>

                  <Text
                    fontSize="12px"
                    color={text}
                  >
                    {item.value} ({item.percent})
                  </Text>
                </VStack>
              </HStack>

              <Box
                px={3}
                py={1}
                borderRadius="full"
                bg={`${item.statusColor}20`}
              >
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  color={item.statusColor}
                >
                  {item.status}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
