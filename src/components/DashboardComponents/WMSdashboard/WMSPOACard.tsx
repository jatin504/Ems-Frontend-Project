// components/WMS/WMSPOACard.tsx

import React, { useMemo, useEffect } from "react";
import { Box, Flex, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import WMSImg from "../../../assets/WMSImg";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

type WMSPOACardProps = {
  selectedWMS: string;
};

const WMSPOACard: React.FC<WMSPOACardProps> = ({ selectedWMS }) => {
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedWMS) return;
    fetchData({
      devices: {
        patterns: [],
        ids: [selectedWMS],
      },
      keys: [
        {
          key: "soc",
          alias: "soc",
          keyType: "common",
          type: "spline",
          color: "#ef4444",
        },
      ],
      aggregation: {
        func: "avg",
        interval: 15,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "DESC",
    } as any);
  }, [selectedWMS]);

  const poaValue = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (
      selectedWMS &&
      widgetData &&
      widgetData[selectedWMS] &&
      widgetData[selectedWMS]["soc"] &&
      widgetData[selectedWMS]["soc"].length > 0
    ) {
      return widgetData[selectedWMS]["soc"][widgetData[selectedWMS]["soc"].length - 1].value;
    }
    return 0;
  }, [data, selectedWMS]);

  let displayValue: string | number = poaValue;
  if (typeof poaValue === "number" && !isNaN(poaValue)) {
    displayValue = poaValue.toFixed(2);
  }

  return (
    <Box
      width="100%"
      height="260px"
      p="20px"
      bg={useColorModeValue("white", "#131512")}
      borderRadius="md"
      overflow="hidden"
    >
      <Flex flexDir="column" height="100%" justify="space-between">
        {/* ===== Value Section ===== */}
        <VStack spacing={2} alignItems="flex-start">
          <Flex alignItems="baseline" gap={1}>
            <Text fontWeight={700} fontSize="22px">
              {displayValue}
            </Text>
            <Text fontWeight={500} fontSize="14px">
              W/m2
            </Text>
          </Flex>
          <Text fontSize="16px" color={useColorModeValue("gray.500", "#9BABBD")}> 
            POA
          </Text>
        </VStack>

        {/* ===== Image Section ===== */}
        <Box alignSelf="flex-end">
          <WMSImg />
        </Box>
      </Flex>
    </Box>
  );
};

export default WMSPOACard;
