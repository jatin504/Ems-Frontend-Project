import React, { useEffect, useMemo } from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

/* ================= PROPS ================= */

interface PerformanceRatioChartProps {
  deviceId: string; //  IMPORTANT
}

/* ================= COMPONENT ================= */

const PerformanceRatioChart: React.FC<PerformanceRatioChartProps> = ({
  deviceId,
}) => {
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );
  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );
  const highlightGreen = useColorModeValue("#16A34A", "#4ADE80");
  const mutedGray = useColorModeValue("#A0AEC0", "#9CA3AF");

  /* ---------- TIME WINDOW ---------- */
  const { config: timeWindow } = useTimeHandle(
    5,
    "day",
    "avg",
    [1, "day"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentWeekSoFar",
        interval: 1,
        intervalType: "day",
      },
    }
  );

  const { data, fetchData } = useTimeseriesData();

  /* ---------- API CALL ---------- */
  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: {
        ids: [deviceId], 
        patterns: [],
      },
      keys: [
      { key: "dcdc1_bus_side_voltage", alias: "PR Actual", keyType: "common" },
      { key: "bcu_1_rack_current", alias: "PR Expected", keyType: "common" },
      { key: "bcu_2_lowest_pack_temperature", alias: "PR Estimated", keyType: "common" },
    ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeWindow]);

  /* ---------- SERIES BUILD ---------- */
  const { series, summary } = useMemo(() => {
    if (!data || !data[deviceId]) {
      return { series: [], summary: null };
    }

    const deviceData = data[deviceId];

    const buildSeries = (alias: string, name: string, color: string) => {
      const arr = deviceData[alias];
      if (!arr || !arr.length) return null;

      return {
        type: "column" as const,
        name,
        color,
        data: arr.map((p: any) => [p.ts, p.value]),
      };
    };

    const actual = buildSeries("PR Actual", "ACTUAL (%)", "#111827");
    const expected = buildSeries("PR Expected", "EXPECTED (%)", "#2563EB");
    const estimated = buildSeries("PR Estimated", "ESTIMATED (%)", "#22C55E");

    const safeLast = (alias: string) => {
      const arr = deviceData[alias];
      if (!arr || !arr.length) return "--";
      const v = arr[arr.length - 1]?.value;
      return typeof v === "number" ? v.toFixed(1) : "--";
    };

    return {
      series: [actual, expected, estimated].filter(Boolean),
      summary: {
        actual: safeLast("PR Actual"),
        expected: safeLast("PR Expected"),
        estimated: safeLast("PR Estimated"),
      },
    };
  }, [data, deviceId]);

  /* ================= RENDER ================= */

  return (
    <Box w="578px">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="700" fontSize="14px" color={textColor}>
          Performance Ratio (%)
        </Text>

        <Text fontSize="13px" color={subTextColor}>
          {summary?.actual ?? "--"} % /{" "}
          <Box as="span" color={highlightGreen}>
            {summary?.expected ?? "--"} %
          </Box>{" "}
          /{" "}
          <Box as="span" color={mutedGray}>
            {summary?.estimated ?? "--"} %
          </Box>
        </Text>
      </Flex>

      <ColumnGraph
        apiData={series}
        height={200}
        onExportReady={() => {}}
        props={{
          plotOptions: {
            column: {
              borderWidth: 0,
              pointWidth: 10,
              borderRadius: 8,
              groupPadding: 0.8,
              pointPadding: 0.4,
              stacking: null,
            },
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: textColor, fontSize: "11px" } },
            lineColor: axisLineColor,
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          yAxis: {
            title: { text: null },
            labels: { style: { color: textColor, fontSize: "11px" } },
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          legend: {
            enabled: true,
            align: "center",
            verticalAlign: "bottom",
            useHTML: true,
            itemStyle: {
              color: textColor,
              fontSize: "7px",
            },
            labelFormatter: function (this: any) {
              return (
                '<span style="width:10px;height:10px;display:inline-block;' +
                "background-color:" +
                this.color +
                ';"></span> ' +
                this.name
              );
            },
          },
          tooltip: {
            valueSuffix: " %",
          },
          navigator: { enabled: false } as any,
          scrollbar: { enabled: false } as any,
          rangeSelector: { enabled: false } as any,
        }}
      />
    </Box>
  );
};

export default PerformanceRatioChart;
