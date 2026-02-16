// PCSPowerGraph.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue, Select, Box } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";

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

const POWER_ALIAS = "Power (kW)"; 

const PCSPowerGraph: React.FC = () => {
  const { config: timeWindow, handleTimeWindowChange, handleReset } =
    useTimeHandle(
      12,
      "hour",
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

 
  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);

  
  const dataSource = {
    devices: {
      patterns: ["_bank_bank_"],
      ids: [] as string[],
    },
    keys: [
      {
        key: "active_power",
        alias: POWER_ALIAS,
        keyType: "common",
        type: "spline",
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

  
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const series: any[] = [];

    // Color palette (wraps if more devices than colors)
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

      const points = deviceData[POWER_ALIAS] || [];
      if (!points || points.length === 0) return;

      // Label for legend (Power (kW) - PCS_8)
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const pcsLabel = suffix ? `PCS_${suffix}` : deviceId;
      const seriesName = suffix
  ? `Power(kW)-${suffix}`
  : `Power(kW)-${deviceId}`;


      // Deterministic color assignment: prefer numeric suffix if present,
      // otherwise use current series length to pick a color.
      const colorIndex = suffix
        ? ((parseInt(suffix, 10) - 1) % COLORS.length + COLORS.length) % COLORS.length
        : series.length % COLORS.length;
      const color = COLORS[colorIndex];

      series.push({
        type: "spline",
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
          <Box>PCS Power</Box>

          {/* 🔹 Compact device dropdown: label = PCS_x, value = deviceId */}
          <Select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            size="xs"
            width="80px"
            minW="89px"
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
      <SpineGraph
        apiData={seriesForChart} 
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
            crosshair: { color: "rgba(255,255,255,0.15)" },
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

export default PCSPowerGraph;