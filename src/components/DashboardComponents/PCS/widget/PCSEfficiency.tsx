import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../../Common/WidgetTitle";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const EFFICIENCY_ALIAS = "Efficiency (%)";

const PCSEfficiency = () => {
  const bg = useColorModeValue("#FFFFFF", "#0B2239");
  const border = useColorModeValue("rgba(15,23,42,0.08)", "rgba(255,255,255,0.06)");
  const titleColor = useColorModeValue("#0F172A", "white");
  const mutedColor = useColorModeValue("#64748B", "#94A3B8");
  const statBoxBg = useColorModeValue("#F8FAFC", "#10263C");
  const statBoxBorder = useColorModeValue("rgba(15,23,42,0.08)", "rgba(255,255,255,0.08)");

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    5,
    "day",
    "avg",
    [15, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const { data, fetchData } = useTimeseriesData();
  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);
  const [selectedDevice, setSelectedDevice] = useState("ALL");
  const [deviceOptions, setDeviceOptions] = useState<any[]>([]);

  const dataSource = {
    devices: {
      patterns: ["_pcs_pcs_"],
      ids: [],
    },
    keys: [
      {
        key: "active_power",
        alias: EFFICIENCY_ALIAS,
        keyType: "common",
        type: "spline",
      },
    ],
    aggregation: timeWindow.aggregation,
    timeRange: timeWindow.timeRange,
    orderBy: timeWindow.orderBy,
  };

  useEffect(() => {
    fetchData(dataSource as any);
  }, [timeWindow]);

  useEffect(() => {
    const widgetData = data as any;
    if (!widgetData) {
      setDeviceOptions([]);
      return;
    }

    const options = Object.keys(widgetData).map((deviceId) => ({
      id: deviceId,
      label: deviceId,
    }));

    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);
  }, [data]);

  const filteredData = useMemo(() => {
    const widgetData = data as any;
    if (!widgetData) return null;

    if (selectedDevice === "ALL") return widgetData;

    const deviceData = widgetData[selectedDevice];
    if (!deviceData) return null;

    return { [selectedDevice]: deviceData };
  }, [data, selectedDevice]);

  const seriesForChart = useMemo(() => {
    if (!filteredData) return [];

    const series = Object.entries(filteredData).flatMap(([deviceId, device]: [string, any], index) => {
      const points = device?.[EFFICIENCY_ALIAS] ?? [];
      if (!points.length) return [];

      const suffix = index + 1;

      return [{
        name: `Power(kW)_${suffix}`,
        type: "spline",
        data: points.map((p: any) => [p.ts, p.value]),
        color: "#76C043",
      }];
    });

    return series;
  }, [filteredData]);

  const values = useMemo(() => {
    return seriesForChart.flatMap((s: any) => s.data.map((p: any) => p[1]));
  }, [seriesForChart]);

  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;

  return (
    <GraphLayout
      title={<WidgetTitle color={titleColor}>PCS Power</WidgetTitle>}
      width={["830px"]}
      height="300px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <Flex h="100%">
        {/* Graph */}
        <Box flex={1}>
          <Box h="270px">
            <SpineGraph
              apiData={seriesForChart}
              height={240}
              onExportReady={setExportFunctions}
              props={{
                yAxis: {
                  title: { text: null },
                },
                xAxis: {
                  type: "datetime",
                  tickInterval: 60 * 60 * 1000,
                  min: new Date().setHours(0, 0, 0, 0),
                  max: new Date().setHours(23, 59, 59, 999),
                },
                tooltip: {
                  valueSuffix: " kW",
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Stats */}
        <Box
          w="100px"
          minW="100px"
          h="140px"
          ml={3}
          bg={statBoxBg}
          border={`1px solid ${statBoxBorder}`}
          borderRadius="8px"
          px={2}
          py={1.5}
          display="flex"
          alignItems="center"
        >
          <VStack
            align="start"
            spacing={2.5}
            w="100%"
          >
            <Box w="100%">
              <Text
                fontSize="10px"
                color={mutedColor}
              >
                Average
              </Text>

              <Text
                color={titleColor}
                fontSize="18px"
                fontWeight="700"
                lineHeight="1.1"
              >
                {avg.toFixed(2)}
                <Text
                  as="span"
                  fontSize="11px"
                  ml={1}
                >
                  %
                </Text>
              </Text>
            </Box>

            <Box w="100%">
              <Text
                fontSize="9px"
                color="#94A3B8"
              >
                Max
              </Text>

              <Text
                color={titleColor}
                fontWeight="600"
                fontSize="15px"
                lineHeight="1.1"
              >
                {max.toFixed(2)} %
              </Text>
            </Box>

            <Box w="100%">
              <Text
                fontSize="9px"
                color={mutedColor}
              >
                Min
              </Text>

              <Text
                color={titleColor}
                fontWeight="600"
                fontSize="15px"
                lineHeight="1.1"
              >
                {min.toFixed(2)} %
              </Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </GraphLayout>
  );
};

export default PCSEfficiency;