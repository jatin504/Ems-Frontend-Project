// src/components/DashboardComponents/PCS/detailDashboard/ACSideCard.tsx

import React from "react";
import {
  Box,
  Grid,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import WidgetTitle from "../../../Common/WidgetTitle";

const acData = [
  {
    title: "AC Voltage (L-L)",
    value: "33.01 kV",
  },
  {
    title: "AC Current",
    value: "218.6 A",
  },
  {
    title: "Frequency",
    value: "50.02 Hz",
  },
  {
    title: "THD (%)",
    value: "2.12 %",
  },
];

const ACSideCard = () => {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const border = useColorModeValue("#E8EDF3", "#2D3748");
  const titleColor = useColorModeValue("#6B7280", "#94A3B8");
  const valueColor = useColorModeValue("#111827", "#F8FAFC");
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
      p={5}
      w="100%"
    >
      <WidgetTitle color={valueColor} mb={8}>
        AC Side
      </WidgetTitle>

      <Grid
        templateColumns="repeat(2,1fr)"
        rowGap={6}
        columnGap={6}
      >
        {acData.map((item) => (
          <VStack
            key={item.title}
            align="stretch"
            spacing={0.5}
          >
            <HStack justify="space-between">
              <Text
                fontSize="12px"
                color={titleColor}
                fontWeight="500"
              >
                {item.title}
              </Text>

              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg="#22C55E"
                boxShadow="0 0 0 3px rgba(34,197,94,0.15)"
              />
            </HStack>

            <Text
              fontSize="16px"
              fontWeight="700"
              color={valueColor}
              lineHeight="1.1"
            >
              {item.value}
            </Text>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
};

export default ACSideCard;