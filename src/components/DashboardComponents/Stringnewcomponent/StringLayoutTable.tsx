import React, { useEffect, useMemo } from "react";

import {
  Box,
  Circle,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

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

type Props = {
  selectedDevice: string;
};

const mpptRows = Array.from({ length: 12 }, (_, i) => i + 1);

const StringLayoutTable: React.FC<Props> = ({ selectedDevice }) => {
  const { data, fetchData } = useTimeseriesData();

  /* ================= API CALL ================= */

  useEffect(() => {
    if (!selectedDevice) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },

      keys: mpptRows.flatMap((index) => [
        {
          key: `mppt_${index}_current`,
          alias: `mppt_${index}_current`,
          keyType: "common",
        },

        {
          key: `mppt_${index}_voltage`,
          alias: `mppt_${index}_voltage`,
          keyType: "common",
        },
      ]),

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },

      orderBy: "DESC",
    } as any);
  }, [selectedDevice]);

  /* ================= DATA MAP ================= */

  const mpptData = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData || !selectedDevice || !widgetData[selectedDevice]) {
      return [];
    }

    const d = widgetData[selectedDevice];

    const latest = (arr?: WidgetPoint[]) => (arr && arr.length > 0 ? arr[arr.length - 1].value : 0);

    return mpptRows.map((index) => ({
      mppt: `MPPT ${index}`,
      current: latest(d[`mppt_${index}_current`]),
      voltage: latest(d[`mppt_${index}_voltage`]),
    }));
  }, [data, selectedDevice]);

  /* ================= COLORS ================= */

  const bg = useColorModeValue("white", "#0A213E");

  const border = `1px solid ${useColorModeValue("#E6EEF2", "#1C3E63")}`;

  const titleColor = useColorModeValue("#1A202C", "white");

  const headerLabelColor = useColorModeValue("#7B92AA", "#9FB6D0");

  const rowTextColor = useColorModeValue("#1A202C", "white");

  const voltageColor = useColorModeValue("#6B46C1", "#C875FF");

  const currentColor = useColorModeValue("#2F855A", "#72E66A");

  const circleColor = useColorModeValue("#2F855A", "#72F27B");

  const headerStickyBorder = useColorModeValue("#E6EEF2", "#173554");

  /* ================= UI ================= */

  return (
    <Box bg={bg} border={border} borderRadius="10px" h="343px" position="relative" overflow="hidden">
      {/* TITLE (sticky) */}
      <Box position="sticky" top="0" zIndex={1000} bg={bg}>
        <Text fontSize="14px" ml={2} fontWeight="700" color={titleColor} pt={2} pb={2} borderBottom={`1px solid ${headerStickyBorder}`}>
          DC Input
        </Text>
      </Box>

      {/* HEADER (sticky) */}
      <Box position="sticky" top="40px" zIndex={999} bg={bg}>
        <Grid templateColumns="160px 1fr 1fr" px={3} borderBottom={`1px solid ${headerStickyBorder}`}>
          <Text fontSize="12px" color={headerLabelColor} fontWeight="600">
            MPPT
          </Text>

          <Text fontSize="12px" color={headerLabelColor} fontWeight="600" textAlign="center">
            Voltage
          </Text>

          <Text fontSize="12px" color={headerLabelColor} fontWeight="600" textAlign="center">
            Current
          </Text>
        </Grid>
      </Box>

      {/* ROWS */}
      <Box position="absolute" top="74px" left="0" right="0" bottom="0" overflowY="auto" overflowX="hidden" px={3}>
        <Flex direction="column" gap={2} pt={2}>
          {mpptData.map((row, index) => (
            <Grid
              key={index}
              templateColumns="160px 1fr 1fr"
              alignItems="center"
              bg={useColorModeValue("#F8FAFB", "#071D36")}
              border={`1px solid ${useColorModeValue("#E6EEF2", "#173554")}`}
              borderRadius="2px"
              px={3}
              py={2}
            >
              {/* MPPT NAME */}
              <Flex align="center">
                <Circle size="8px" bg={circleColor} mr={3} />

                <Text fontSize="10px" color={rowTextColor} fontWeight="600">
                  {row.mppt}
                </Text>
              </Flex>

              {/* VOLTAGE */}
              <Text textAlign="center" fontSize="10px" fontWeight="600" color={voltageColor}>
                {Number(row.voltage).toFixed(1)} V
              </Text>

              {/* CURRENT */}
              <Text textAlign="center" fontSize="10px" fontWeight="600" color={currentColor}>
                {Number(row.current).toFixed(1)} A
              </Text>
            </Grid>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default StringLayoutTable;