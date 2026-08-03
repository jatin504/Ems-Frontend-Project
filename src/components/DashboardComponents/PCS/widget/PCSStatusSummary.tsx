import React, { useMemo, useState, useEffect } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../../Common/WidgetTitle";
import { useColorModeValue, Box, Select } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import type { ExportFunctions } from "../../../../types/graphExport/export";

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

const SOC_ALIAS = "SoC";
const PHASE_A_VOLTAGE = "Phase A Voltage";
const PHASE_B_VOLTAGE = "Phase B Voltage";
const PHASE_C_VOLTAGE = "Phase C Voltage";

const PHASE_A_CURRENT = "Phase A Current";
const PHASE_B_CURRENT = "Phase B Current";
const PHASE_C_CURRENT = "Phase C Current";

const buildSocEvents = (data: WidgetPoint[]) => {
  const plotBands: any[] = [];

  if (!data.length) return plotBands;

  let start = data[0].ts;
  let prevSoc = data[0].value;
  let mode: "charge" | "discharge" | null = null;

  const index = { charge: 1, discharge: 1 };

  for (let i = 1; i < data.length; i++) {
    const currentSoc = data[i].value;
    const currentMode: "charge" | "discharge" | null =
      currentSoc > prevSoc ? "charge" : currentSoc < prevSoc ? "discharge" : mode;

    if (mode && currentMode !== mode) {
      plotBands.push(createBand(start, data[i - 1].ts, mode, index));
      start = data[i - 1].ts;
    }

    mode = currentMode;
    prevSoc = currentSoc;
  }

  plotBands.push(createBand(start, data[data.length - 1].ts + 5 * 60 * 1000, mode, index));

  return plotBands;
};

const createBand = (
  from: number,
  to: number,
  mode: "charge" | "discharge" | null,
  index: { charge: number; discharge: number }
) => {
  const isCharge = mode === "charge";
  const label = `${isCharge ? "Charge" : "Discharge"} Event-${index[mode!]++}`;

  return {
    from,
    to,
    color: isCharge ? "rgba(0, 180, 0, 0.15)" : "rgba(220, 0, 0, 0.15)",
    label: {
      text: label,
      style: {
        fontWeight: "bold",
        color: isCharge ? "#006400" : "#8B0000",
      },
    },
  };
};

/* ---------------- COMPONENT ---------------- */
interface PCSSoCGraphProps {
  hideWrapper?: boolean;
}

const PCSSoCGraph: React.FC<PCSSoCGraphProps> = ({ hideWrapper }) => {
  const { data, fetchData } = useTimeseriesData();
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  useEffect(() => {
    fetchData({
      devices: {
        patterns: ["_pcs_pcs_"],
        ids: [],
      },
      keys: [
        { key: "soc", alias: SOC_ALIAS, keyType: "common" },
        { key: "phase_a_voltage", alias: PHASE_A_VOLTAGE, keyType: "common" },
        { key: "phase_b_voltage", alias: PHASE_B_VOLTAGE, keyType: "common" },
        { key: "phase_c_voltage", alias: PHASE_C_VOLTAGE, keyType: "common" },
        { key: "phase_a_current", alias: PHASE_A_CURRENT, keyType: "common" },
        { key: "phase_b_current", alias: PHASE_B_CURRENT, keyType: "common" },
        { key: "phase_c_current", alias: PHASE_C_CURRENT, keyType: "common" },
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
      orderBy: "ASC",
    } as any);
  }, []);

  useEffect(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return;

    const options = Object.keys(widgetData).map((deviceId) => {
      const suffix = deviceId.match(/_(\d+)$/)?.[1];
      return { id: deviceId, label: suffix ? `PCS_${suffix}` : deviceId };
    });

    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);

    if (!selectedDevice && options.length) {
      setSelectedDevice(options[0].id);
    }
  }, [data]);

  useEffect(() => {
    if (selectedDevice && !deviceOptions.find((opt) => opt.id === selectedDevice)) {
      setSelectedDevice(deviceOptions[0]?.id ?? "");
    }
  }, [deviceOptions, selectedDevice]);

  const widgetData = data as WidgetData | null;

  const filteredData = useMemo(() => {
    if (!widgetData) return {};
    if (!selectedDevice) return {};

    const deviceData = widgetData[selectedDevice];
    if (!deviceData) return {};
    return { [selectedDevice]: deviceData };
  }, [widgetData, selectedDevice]);

  const plotBands = useMemo(() => {
    const firstDevice = Object.values(filteredData)[0] as
      | { [keyAlias: string]: WidgetPoint[] }
      | undefined;
    const socPoints = firstDevice?.[SOC_ALIAS] ?? [];

    if (!socPoints.length) return [];
    return buildSocEvents(socPoints);
  }, [filteredData]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const today = new Date();

  const startTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    8,
    0,
    0,
    0
  ).getTime();

  const endTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    20,
    0,
    0,
    0
  ).getTime();
  const seriesForChart = useMemo(() => {
    const deviceEntries = Object.entries(filteredData);
    if (deviceEntries.length === 0) return [];

    const visibleDevices = selectedDevice
      ? deviceEntries.filter(([id]) => id === selectedDevice)
      : [deviceEntries[0]];

    if (visibleDevices.length === 0) return [];

    const series: any[] = [];
    const [socDeviceId, socDevice] = visibleDevices[0];
    const socMatch = socDeviceId.match(/_(\d+)$/);
    const socSuffix = socMatch ? socMatch[1] : socDeviceId;

    series.push({
      name: `SoC-${socSuffix}`,
      data: (socDevice?.[SOC_ALIAS] ?? []).map((point) => [point.ts, point.value]),
      color: "#1e3a8a",
      lineWidth: 2,
      marker: { enabled: false },
      type: "spline",
      pointPlacement: "on",
      cropThreshold: 1000,
    });

    visibleDevices.forEach(([deviceId, device]) => {
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : deviceId;

      const voltageSeries = [
        { alias: PHASE_A_VOLTAGE, name: `Va-${suffix}`, color: "#10b981" },
        { alias: PHASE_B_VOLTAGE, name: `Vb-${suffix}`, color: "#3b82f6" },
        { alias: PHASE_C_VOLTAGE, name: `Vc-${suffix}`, color: "#f59e0b" },
      ];

      voltageSeries.forEach((item) => {
        series.push({
          name: item.name,
          data: (device?.[item.alias] ?? []).map((point) => [point.ts, point.value]),
          color: item.color,
          lineWidth: 2,
          marker: { enabled: false },
          type: "spline",
        });
      });

      const currentSeries = [
        { alias: PHASE_A_CURRENT, name: `Ia-${suffix}`, color: "#ef4444" },
        { alias: PHASE_B_CURRENT, name: `Ib-${suffix}`, color: "#8b5cf6" },
        { alias: PHASE_C_CURRENT, name: `Ic-${suffix}`, color: "#14b8a6" },
      ];

      currentSeries.forEach((item) => {
        series.push({
          name: item.name,
          data: (device?.[item.alias] ?? []).map((point) => [point.ts, point.value]),
          color: item.color,
          lineWidth: 2,
          marker: { enabled: false },
          type: "spline",
        });
      });
    });

    return series;
  }, [filteredData, selectedDevice]);

  if (hideWrapper) {
    return (
      <SpineGraph
        apiData={seriesForChart}
        height={265}
        onExportReady={setExportFunctions}
        props={{
          /*CHART FIX (important for 100%) */
          chart: {
            spacingLeft: 0,
            spacingRight: 0,
            marginLeft: 50,
            marginRight: 10,
          },

          yAxis: {
            tickAmount: 6,
            // title: { text: "Values" },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",
            min: startTime,
            max: endTime,
            tickInterval: 60 * 60 * 1000,
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            plotBands,
            tickmarkPlacement: "on",
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels: {
              format: "{value:%H:%M}",
              rotation: 0,
              autoRotation: false,
              step: 1,
              style: {
                color: subTextColor,
                fontSize: "11px",
              },
            },
            lineColor: "transparent",
            gridLineWidth: 0,
            tickLength: 0,
            showFirstLabel: true,
            showLastLabel: true,
          },

          legend: {
            enabled: true,
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
            xDateFormat: "%d %b %Y %H:%M",
            formatter: function (this: any) {
              let tooltip = `<b>${new Date(this.x).toLocaleString()}</b><br/>`;
              this.points.forEach((point: any) => {
                let suffix = "";
                const seriesName = point.series.name;
                if (seriesName.startsWith("SoC")) suffix = " %";
                else if (seriesName.startsWith("Va") || seriesName.startsWith("Vb") || seriesName.startsWith("Vc")) suffix = " V";
                else if (seriesName.startsWith("Ia") || seriesName.startsWith("Ib") || seriesName.startsWith("Ic")) suffix = " A";
                const formattedValue = Number(point.y).toFixed(2);
                tooltip += `${seriesName}: <b>${formattedValue}${suffix}</b><br/>`;
              });
              return tooltip;
            },
          },
        }}
      />
    );
  }

  return (
    <GraphLayout
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" gap={3}>
          <WidgetTitle color={useColorModeValue("#111827", "#E6EEF6")}>
            Charge/Discharge Cycle
          </WidgetTitle>

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
            {deviceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Box>
      }
      width={["100%"]}
      height={"300px"}
      fullScreen
      timeWindow={false}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesForChart}
        height={240}
        onExportReady={setExportFunctions}
        props={{
          /*CHART FIX (important for 100%) */
          chart: {
            spacingLeft: 0,
            spacingRight: 0,
            marginLeft: 50,
            marginRight: 10,
          },

          yAxis: {
            tickAmount: 6,
            // title: { text: "Values" },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",
            min: startTime,
            max: endTime,
            tickInterval: 60 * 60 * 1000,
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            plotBands,
            tickmarkPlacement: "on",
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels: {
              format: "{value:%H:%M}",
              rotation: 0,
              autoRotation: false,
              step: 1,
              style: {
                color: subTextColor,
                fontSize: "11px",
              },
            },
            lineColor: "transparent",
            gridLineWidth: 0,
            tickLength: 0,
            showFirstLabel: true,
            showLastLabel: true,
          },

          legend: {
            enabled: true,
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
            xDateFormat: "%d %b %Y %H:%M",
            formatter: function (this: any) {
              let tooltip = `<b>${new Date(this.x).toLocaleString()}</b><br/>`;
              this.points.forEach((point: any) => {
                let suffix = "";
                const seriesName = point.series.name;
                if (seriesName.startsWith("SoC")) suffix = " %";
                else if (seriesName.startsWith("Va") || seriesName.startsWith("Vb") || seriesName.startsWith("Vc")) suffix = " V";
                else if (seriesName.startsWith("Ia") || seriesName.startsWith("Ib") || seriesName.startsWith("Ic")) suffix = " A";
                const formattedValue = Number(point.y).toFixed(2);
                tooltip += `${seriesName}: <b>${formattedValue}${suffix}</b><br/>`;
              });
              return tooltip;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default PCSSoCGraph;
