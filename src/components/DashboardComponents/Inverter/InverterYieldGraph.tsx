import React, { useEffect, useState, useMemo } from "react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import { useColorModeValue, Box, Select } from "@chakra-ui/react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import { transformToHighchartsTimeSeries } from "../../../Services/APIDataFormatter/TimeseriesGraphs";
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

const InverterYieldGraph: React.FC = () => {
  const {
    config: timeWindowSoC,
    handleTimeWindowChange: handleTimeWindowSoCChange,
    handleReset: SoCHandleReset,
  } = useTimeHandle(
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

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: ["_bank_bank_"],
        ids: [],
      },
      keys: [
        {
          key: "energy_charged_today",
          alias: ENERGY_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#0b8043",
        },
      ],
      aggregation: timeWindowSoC.aggregation,
      timeRange: timeWindowSoC.timeRange,
      orderBy: timeWindowSoC.orderBy,
    },
  };

  const { data, fetchData } = useTimeseriesData();

  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindowSoC]);

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
      const label = suffix ? `INV_${suffix}` : deviceId;
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

  const filteredData = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return null;

    if (selectedDevice === "ALL") return widgetData;

    const deviceData = widgetData[selectedDevice];
    if (!deviceData) return null;

    return {
      [selectedDevice]: deviceData,
    } as WidgetData;
  }, [data, selectedDevice]);

  // Prepare Highcharts series and assign deterministic colors per inverter
  const seriesForChart = useMemo(() => {
    if (!filteredData) return [];

    const baseSeries = transformToHighchartsTimeSeries(
      filteredData,
      fetchingToServerObj.dataSource.keys
    );

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

    return baseSeries.map((s: any, idx: number) => {
      const name: string = typeof s.name === "string" ? s.name : "";
      const match = name.match(/INV_(\d+)/);
      const suffix = match ? match[1] : null;
      const colorIndex = suffix
        ? ((parseInt(suffix, 10) - 1) % COLORS.length + COLORS.length) % COLORS.length
        : idx % COLORS.length;
      const color = COLORS[colorIndex];

      return {
        ...s,
        color,
        marker: { ...(s.marker || {}), fillColor: color },
      };
    });
  }, [filteredData]);

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
          <Box>Inverter Yield</Box>

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
      onTimeWindowChange={(config) => handleTimeWindowSoCChange(config)}
      onReset={SoCHandleReset}
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
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default InverterYieldGraph;
