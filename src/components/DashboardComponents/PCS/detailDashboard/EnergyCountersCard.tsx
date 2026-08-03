// src/components/DashboardComponents/PCS/detailDashboard/EnergyCountersCard.tsx

import React from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const energyData = [
  {
    name: "Charge Energy",
    today: "128.35 MWh",
    lifetime: "12,356.42 MWh",
  },
  {
    name: "Discharge Energy",
    today: "86.75 MWh",
    lifetime: "10,892.13 MWh",
  },
  {
    name: "Net Energy",
    today: "41.60 MWh",
    lifetime: "1,464.29 MWh",
  },
  {
    name: "Operating Hours",
    today: "18.6 h",
    lifetime: "4,352 h",
  },
];

const EnergyCountersCard = () => {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const border = useColorModeValue("#E8EDF3", "#2D3748");
  const text = useColorModeValue("#111827", "#F8FAFC");
  const sub = useColorModeValue("#6B7280", "#94A3B8");
  const rowBorder = useColorModeValue("#EEF2F7", "#2D3748");
  const shadow = useColorModeValue(
    "0 2px 8px rgba(15,23,42,0.05)",
    "none"
  );

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="14px"
      boxShadow={shadow}
      h="220px"
      p={4}
      w="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Text
        fontSize="16px"
        fontWeight="700"
        color={text}
        mb={2}
      >
        Energy Counters
      </Text>

      {/* Header */}
      <Grid
        templateColumns="1.6fr 1fr 1fr"
        mb={1}
        px={1}
        flexShrink={0}
      >
        <Text />

        <Text
          textAlign="center"
          fontSize="13px"
          fontWeight="600"
          color={sub}
        >
          Today
        </Text>

        <Text
          textAlign="center"
          fontSize="13px"
          fontWeight="600"
          color={sub}
        >
          Lifetime
        </Text>
      </Grid>

      {energyData.map((item, index) => (
        <Flex
          key={item.name}
          align="center"
          justify="space-between"
          py={2}
          borderTop={index === 0 ? "1px solid" : undefined}
          borderBottom="1px solid"
          borderColor={rowBorder}
          minH="0"
        >
          <Box flex="1.6">
            <Text
              fontSize="11px"
              color={text}
            >
              {item.name}
            </Text>
          </Box>

          <Box
            flex="1"
            textAlign="center"
          >
            <Text
              fontSize="13px"
              fontWeight="600"
              color={text}
            >
              {item.today}
            </Text>
          </Box>

          <Box
            flex="1"
            textAlign="center"
          >
            <Text
              fontSize="13px"
              fontWeight="600"
              color={text}
            >
              {item.lifetime}
            </Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default EnergyCountersCard;