import React, { useMemo, useState, useEffect } from "react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import { useColorModeValue, Box, Select } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../types/graphExport/export";

/* ---------------- MOCK DATA ---------------- */
interface DeviceData {
  socData: [number, number][];
  voltageData: [number, number][];
  currentData: [number, number][];
}

const dummyData: { [deviceId: string]: DeviceData } = {
  "device_bank_bank_1": {
    socData: [
      [Date.UTC(2025, 0, 1, 9, 0), 45],
      [Date.UTC(2025, 0, 1, 10, 0), 50],
      [Date.UTC(2025, 0, 1, 11, 0), 58],
      [Date.UTC(2025, 0, 1, 12, 0), 62],
      [Date.UTC(2025, 0, 1, 13, 0), 55],
      [Date.UTC(2025, 0, 1, 14, 0), 48],
      [Date.UTC(2025, 0, 1, 15, 0), 52],
      [Date.UTC(2025, 0, 1, 16, 0), 60],
    ],
    voltageData: [
      [Date.UTC(2025, 0, 1, 9, 0), 380],
      [Date.UTC(2025, 0, 1, 10, 0), 385],
      [Date.UTC(2025, 0, 1, 11, 0), 390],
      [Date.UTC(2025, 0, 1, 12, 0), 395],
      [Date.UTC(2025, 0, 1, 13, 0), 388],
      [Date.UTC(2025, 0, 1, 14, 0), 382],
      [Date.UTC(2025, 0, 1, 15, 0), 387],
      [Date.UTC(2025, 0, 1, 16, 0), 392],
    ],
    currentData: [
      [Date.UTC(2025, 0, 1, 9, 0), 120],
      [Date.UTC(2025, 0, 1, 10, 0), 135],
      [Date.UTC(2025, 0, 1, 11, 0), 141],
      [Date.UTC(2025, 0, 1, 12, 0), 147],
      [Date.UTC(2025, 0, 1, 13, 0), 142],
      [Date.UTC(2025, 0, 1, 14, 0), 126],
      [Date.UTC(2025, 0, 1, 15, 0), 134],
      [Date.UTC(2025, 0, 1, 16, 0), 149],
    ],
  },
  "device_bank_bank_2": {
    socData: [
      [Date.UTC(2025, 0, 1, 9, 0), 50],
      [Date.UTC(2025, 0, 1, 10, 0), 55],
      [Date.UTC(2025, 0, 1, 11, 0), 63],
      [Date.UTC(2025, 0, 1, 12, 0), 67],
      [Date.UTC(2025, 0, 1, 13, 0), 60],
      [Date.UTC(2025, 0, 1, 14, 0), 53],
      [Date.UTC(2025, 0, 1, 15, 0), 57],
      [Date.UTC(2025, 0, 1, 16, 0), 65],
    ],
    voltageData: [
      [Date.UTC(2025, 0, 1, 9, 0), 385],
      [Date.UTC(2025, 0, 1, 10, 0), 390],
      [Date.UTC(2025, 0, 1, 11, 0), 395],
      [Date.UTC(2025, 0, 1, 12, 0), 400],
      [Date.UTC(2025, 0, 1, 13, 0), 393],
      [Date.UTC(2025, 0, 1, 14, 0), 387],
      [Date.UTC(2025, 0, 1, 15, 0), 392],
      [Date.UTC(2025, 0, 1, 16, 0), 397],
    ],
    currentData: [
      [Date.UTC(2025, 0, 1, 9, 0), 125],
      [Date.UTC(2025, 0, 1, 10, 0), 140],
      [Date.UTC(2025, 0, 1, 11, 0), 146],
      [Date.UTC(2025, 0, 1, 12, 0), 152],
      [Date.UTC(2025, 0, 1, 13, 0), 147],
      [Date.UTC(2025, 0, 1, 14, 0), 131],
      [Date.UTC(2025, 0, 1, 15, 0), 139],
      [Date.UTC(2025, 0, 1, 16, 0), 154],
    ],
  },
  "device_bank_bank_3": {
    socData: [
      [Date.UTC(2025, 0, 1, 9, 0), 40],
      [Date.UTC(2025, 0, 1, 10, 0), 45],
      [Date.UTC(2025, 0, 1, 11, 0), 53],
      [Date.UTC(2025, 0, 1, 12, 0), 57],
      [Date.UTC(2025, 0, 1, 13, 0), 50],
      [Date.UTC(2025, 0, 1, 14, 0), 43],
      [Date.UTC(2025, 0, 1, 15, 0), 47],
      [Date.UTC(2025, 0, 1, 16, 0), 55],
    ],
    voltageData: [
      [Date.UTC(2025, 0, 1, 9, 0), 375],
      [Date.UTC(2025, 0, 1, 10, 0), 380],
      [Date.UTC(2025, 0, 1, 11, 0), 385],
      [Date.UTC(2025, 0, 1, 12, 0), 390],
      [Date.UTC(2025, 0, 1, 13, 0), 383],
      [Date.UTC(2025, 0, 1, 14, 0), 377],
      [Date.UTC(2025, 0, 1, 15, 0), 382],
      [Date.UTC(2025, 0, 1, 16, 0), 387],
    ],
    currentData: [
      [Date.UTC(2025, 0, 1, 9, 0), 115],
      [Date.UTC(2025, 0, 1, 10, 0), 130],
      [Date.UTC(2025, 0, 1, 11, 0), 136],
      [Date.UTC(2025, 0, 1, 12, 0), 142],
      [Date.UTC(2025, 0, 1, 13, 0), 137],
      [Date.UTC(2025, 0, 1, 14, 0), 121],
      [Date.UTC(2025, 0, 1, 15, 0), 129],
      [Date.UTC(2025, 0, 1, 16, 0), 144],
    ],
  },
};

/* ---------------- EVENT BUILDER ---------------- */
const buildSocEvents = (data: [number, number][]) => {
  const plotBands: any[] = [];
  let start = data[0][0];
  let prevSoc = data[0][1];
  let mode: "charge" | "discharge" | null = null;

  const index = { charge: 1, discharge: 1 };

  for (let i = 1; i < data.length; i++) {
    const [time, soc] = data[i];
    const currentMode =
      soc > prevSoc ? "charge" : soc < prevSoc ? "discharge" : mode;

    if (mode && currentMode !== mode) {
      plotBands.push(createBand(start, data[i - 1][0], mode, index));
      start = data[i - 1][0];
    }

    mode = currentMode;
    prevSoc = soc;
  }

  // 🔥 extend last band to avoid right cut
  plotBands.push(
    createBand(
      start,
      data[data.length - 1][0] + 5 * 60 * 1000,
      mode,
      index
    )
  );

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
    color: isCharge
      ? "rgba(0, 180, 0, 0.15)"
      : "rgba(220, 0, 0, 0.15)",
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
const PCSSoCGraph: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [deviceOptions, setDeviceOptions] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const options: { id: string; label: string }[] = [];
    Object.keys(dummyData).forEach((deviceId) => {
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const label = suffix ? `PCS_${suffix}` : deviceId;
      options.push({ id: deviceId, label });
    });
    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);
  }, []);

  useEffect(() => {
    if (
      selectedDevice !== "ALL" &&
      !deviceOptions.find((opt) => opt.id === selectedDevice)
    ) {
      setSelectedDevice("ALL");
    }
  }, [deviceOptions, selectedDevice]);

  const filteredData = useMemo(() => {
    if (selectedDevice === "ALL") return dummyData;
    const deviceData = dummyData[selectedDevice];
    if (!deviceData) return {};
    return { [selectedDevice]: deviceData };
  }, [selectedDevice]);

  const plotBands = useMemo(() => {
    const allSocData: [number, number][] = [];
    Object.values(filteredData).forEach((device) => {
      if (device.socData) allSocData.push(...device.socData);
    });
    if (allSocData.length === 0) return [];
    // For simplicity, use the first device's SoC for plotBands
    return buildSocEvents(Object.values(filteredData)[0]?.socData || []);
  }, [filteredData]);

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

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

  const seriesForChart = useMemo(() => {
    const series: any[] = [];
    const COLORS = [
      "#1e3a8a",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#f97316",
      "#84cc16",
      "#06b6d4",
      "#3b82f6",
      "#6366f1",
      "#a855f7",
    ];

    Object.keys(filteredData).forEach((deviceId, idx) => {
      const device = filteredData[deviceId];
      if (!device) return;

      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const suffixLabel = suffix || deviceId;

series.push({
  name: `SoC-${suffixLabel}`,
  data: device.socData,
  color: COLORS[idx % COLORS.length],
  lineWidth: 2,
  marker: { enabled: false },
  type: "spline",
});

series.push({
  name: `Voltage-${suffixLabel}`,
  data: device.voltageData,
  color: COLORS[(idx + 1) % COLORS.length],
  lineWidth: 2,
  marker: { enabled: false },
  type: "spline",
});

series.push({
  name: `Current-${suffixLabel}`,
  data: device.currentData,
  color: COLORS[(idx + 2) % COLORS.length],
  lineWidth: 2,
  marker: { enabled: false },
  type: "spline",
});

    });

    return series;
  }, [filteredData]);

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <Box>Charge/Discharge Cycle</Box>

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
      timeWindow={false}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesForChart}
        height={260}
        onExportReady={setExportFunctions}
        props={{
          /*CHART FIX (important for 100%) */
          chart: {
            spacingRight: 40,
            marginRight: 40,
          },

          yAxis: {
            tickAmount: 6,
            // title: { text: "Values" },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",
            plotBands,
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,

            /* 🔥 RIGHT CUT FIX */
            endOnTick: false,
            startOnTick: false,
            minPadding: 0.02,
            maxPadding: 0.1,
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
                if (seriesName.includes("SoC")) suffix = " %";
                else if (seriesName.includes("Voltage")) suffix = " V";
                else if (seriesName.includes("Current")) suffix = " A";
                tooltip += `${seriesName}: <b>${point.y}${suffix}</b><br/>`;
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
