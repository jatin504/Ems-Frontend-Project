import React, { useEffect, useState, useMemo } from "react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import { useColorModeValue, Box, Select } from "@chakra-ui/react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

interface DeviceOption {
  id: string;
  label: string;
}

const ENERGY_ALIAS = "Energy (kW)";

const PCSYieldGraph: React.FC = () => {
  const { config: timeWindow, handleTimeWindowChange, handleReset } =
    useTimeHandle(
    5,
    "day",
    "last",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 2,
        intervalType: "minute",
      },
    }
  );

  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);

  const dataSource = {
    devices: {
      patterns: ["_bank_bank_"],
      ids: [] as string[],
    },
    keys: [
      {
        key: "total_energy_charged",
        alias: ENERGY_ALIAS,
        keyType: "common",
        type: "bar",
        color: "#ef4444",
      },
    ],
    aggregation: timeWindow.aggregation,
    timeRange: timeWindow.timeRange,
    orderBy: timeWindow.orderBy,
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(dataSource as any);
  }, [timeWindow]);

  useEffect(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) {
      setDeviceOptions([]);
      return;
    }

    const options: DeviceOption[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const label = suffix ? `PCS_${suffix}` : deviceId;
      options.push({ id: deviceId, label });
    });

    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);
  }, [data]);

  useEffect(() => {
    if (
      selectedDevice !== "ALL" &&
      !deviceOptions.find((opt) => opt.id === selectedDevice)
    ) {
      setSelectedDevice("ALL");
    }
  }, [deviceOptions, selectedDevice]);

  // Prepare Highcharts series and assign deterministic colors per PCS
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const series: any[] = [];

    const COLORS = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#84cc16",
      "#10b981",
      "#06b6d4",
      "#3b82f6",
      "#6366f1",
      "#a855f7",
      "#ec4899",
    ];

    Object.keys(widgetData).forEach((deviceId) => {
      if (selectedDevice !== "ALL" && selectedDevice !== deviceId) return;

      const deviceData = widgetData[deviceId];
      if (!deviceData) return;

      const points = deviceData[ENERGY_ALIAS] || [];
      if (!points || points.length === 0) return;

      // Label for legend (Energy (kW) - PCS_8)
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const pcsLabel = suffix ? `PCS_${suffix}` : deviceId;
      const seriesName = suffix
  ? `${ENERGY_ALIAS.replace(/\s*\((.*?)\)\s*/g, "($1)")}-${suffix}`
  : `${ENERGY_ALIAS.replace(/\s*\((.*?)\)\s*/g, "($1)")}-${deviceId}`;


      // Deterministic color assignment: prefer numeric suffix if present,
      // otherwise use current series length to pick a color.
      const colorIndex = suffix
        ? ((parseInt(suffix, 10) - 1) % COLORS.length + COLORS.length) % COLORS.length
        : series.length % COLORS.length;
      const color = COLORS[colorIndex];

      series.push({
        type: "column",
        name: seriesName,
        data: points.map((p) => [p.ts, p.value]),
        marker: { enabled: true, fillColor: color },
        color,
      });
    });

    return series;
  }, [data, selectedDevice]);

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

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <Box>PCS Yield</Box>

          <Select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            size="xs"
            width="90px"
            minW="100px"
            height="24px"
            fontSize="11px"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="4px"
            paddingInline="2"
          >
            <option value="ALL">ALL</option>
            {deviceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Box>
      }
      width={["100%"]}   
      height={"100%"}    
      fullScreen
      timeWindow={true}
      onTimeWindowChange={(config) => handleTimeWindowChange(config)}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph apiData={seriesForChart}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            crosshair: { color: "rgba(255,255,255,0.15)", width: 1 },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default PCSYieldGraph;