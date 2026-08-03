import React, { useEffect, useMemo, useState } from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import HeatmapChart from "../../../Graphs/RevampCharts/Heatmapchart";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import WidgetTitle from "../../../Common/WidgetTitle";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";

type MetricType = "PR" | "Yield";

interface HeatmapData {
  series: any[];
  xAxisCategories: string[];
  yAxisCategories: string[];
  lastUpdateTime: string;
}

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyName: string]: WidgetPoint[];
  };
}

interface InverterPRvsYieldGraphProps {
  data?: any[];
}

const InverterPRvsYieldGraph: React.FC<InverterPRvsYieldGraphProps> = (_props) => {
  const metricOptions = [
    { label: "Performance Ratio (PR)", value: "PR" },
    { label: "Yield", value: "Yield" },
  ];

  const [metric, setMetric] = useState<MetricType>("Yield");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    config: timeWindowConfig,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
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

 
  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0"); 
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

 
  const dataSource = {
    devices: {
      patterns: ["_inverter_inverter_"],
      ids: [],
    },
    keys: [
      {
        // PR (abhi soc use kar rahe ho)
        key: "INV_PR",
        alias: "PR",
        keyType: "common",
        type: "spline",
        color: "#e67e22",
      },
      {
        // Yield => charge_energy_kwh
        key: "specific_yield",
        alias: "Yield",
        keyType: "common",
        type: "spline",
        color: "#0b8043",
      },
    ],
    aggregation: timeWindowConfig.aggregation,
    timeRange: timeWindowConfig.timeRange,
    orderBy: timeWindowConfig.orderBy,
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(dataSource as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindowConfig]);

  // ---- WidgetData -> Heatmap series transformation ----
  const currentHeatmapData: HeatmapData | null = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return null;

    const alias = metric === "PR" ? "PR" : "Yield";

    // 🔹 First, collect all devices with their numeric suffix for sorting
    const deviceList: { deviceId: string; label: string; numericSuffix: number }[] = [];
    
    Object.keys(widgetData).forEach((deviceId) => {
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const label = suffix ? `INV_${suffix}` : deviceId;
      const numericSuffix = match ? parseInt(match[1], 10) : 999999; // devices without number go to end
      
      deviceList.push({ deviceId, label, numericSuffix });
    });

    // 🔹 Sort by numeric suffix (INV_1, INV_2, INV_3, ... INV_10, INV_11, etc.)
    deviceList.sort((a, b) => a.numericSuffix - b.numericSuffix);

    const yAxisCategories: string[] = [];
    const rawPoints: { ts: number; y: number; value: number }[] = [];
    const allTimestamps: number[] = [];

    // 🔹 Now process devices in sorted order
    deviceList.forEach(({ deviceId, label }) => {
      const deviceData = widgetData[deviceId];
      if (!deviceData) return;

      const rowIndex = yAxisCategories.length;
      yAxisCategories.push(label);

      const points = deviceData[alias] || [];
      points.forEach((p) => {
        if (!p) return;
        rawPoints.push({ ts: p.ts, y: rowIndex, value: p.value });
        allTimestamps.push(p.ts);
      });
    });

    if (rawPoints.length === 0) return null;

    const filteredPoints = rawPoints.filter((p) => {
    const date = new Date(p.ts);
    const hour = date.getUTCHours(); // or getHours() for local time

    return hour >= 4 && hour <= 20;
  });

  const allTS = filteredPoints.map((p) => p.ts);

  const uniqueSortedTs = Array.from(new Set(allTS)).sort(
    (a, b) => a - b
  );

  const tsIndexMap = new Map<number, number>();
  uniqueSortedTs.forEach((ts, idx) => tsIndexMap.set(ts, idx));

  const seriesData: [number, number, number][] = filteredPoints.map((p) => [
    tsIndexMap.get(p.ts) ?? 0,
    p.y,
    p.value,
  ]);

    return {
      series: [
  {
    type: "heatmap",
    name: metric === "PR" ? "Performance Ratio (PR)" : "Yield",

    borderWidth: 0.5,
    borderColor: "#4ade80",

    data: seriesData,
  },
],
      xAxisCategories: uniqueSortedTs.map((ts) => {
        const date = new Date(ts);

        return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
          date.getUTCMinutes()
        ).padStart(2, "0")}`;
      }),
      yAxisCategories,
      lastUpdateTime: String(uniqueSortedTs[uniqueSortedTs.length - 1]),
    };
  }, [data, metric]);

  return (
    <GraphLayout
      title={<WidgetTitle>Performance Map</WidgetTitle>}
      titleLengthSVG={70}
      titleLengthLongSVG={1680}
      width={["710px"]}
      height={"314px"}
      fullScreen
      timeWindow={false}
      mt="2" 
      onTimeWindowChange={(config) => handleTimeWindowChange(config)}
      onReset={handleReset}
    >
      <VStack
        width={"100%"}
        height={"100%"}
        spacing={2}
        align="stretch"
      >
        {/* Top right dropdown */}
        <HStack width={"100%"} justify={"flex-end"} mb={1}>
          <HStack>
            <Select
              isMulti={false}
              placeholder="Select Parameter"
              closeMenuOnSelect
              variant="flushed"
              focusBorderColor="#062D59"
              size="sm"
              chakraStyles={{
                valueContainer: (provided) => ({
                  ...provided,
                  fontSize: "10px",
                  width: "160px",
                }),
                control: (prov) => ({
                  ...prov,
                  height: "10px",
                  minBlockSize: "20px",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "80px",
                }),
                option: (prov) => ({
                  ...prov,
                  height: "18px",
                  fontSize: "10px",
                }),
              }}
              options={metricOptions}
              onChange={(e) => {
                const val = (e?.value as MetricType) || "PR";
                setMetric(val);
              }}
              selectedOptionColorScheme="green"
              value={metricOptions.find((option) => option.value === metric)}
            />
          </HStack>
        </HStack>

        {/* Heatmap */}
        <Box
          width={"100%"}
          flex="1"
          minH="240px"
          maxH="380px"
          p="4px"
          transform="rotate(0deg)"
          opacity={1}
        >
          {currentHeatmapData && currentHeatmapData.series && (
            <HeatmapChart
              height={200}
              apiData={
                isFullscreen
                  ? currentHeatmapData.series
                  : [
                      {
                        ...currentHeatmapData.series[0],
                        data: currentHeatmapData.series[0].data.filter(
                          (point: any) => point[1] <= 9 // Only show y-index 0-9 (INV_1 to INV_10)
                        ),
                      },
                    ]
              }
              isFullscreen={isFullscreen}
              onFullscreenChange={setIsFullscreen}
              props={{
                xAxis: {
                  type: "category",
                  min: 0,
                  max: currentHeatmapData.xAxisCategories.length - 1,
                  categories: currentHeatmapData.xAxisCategories,
                  labels: {
                    style: { color: axisLabelColor, fontSize: "8px" },
                  },
                },
                yAxis: {
                  title: null,
                  crosshair: false,
                  min: 0,
                  max: isFullscreen ? currentHeatmapData.yAxisCategories.length - 1 : 9,
                  labels: {
                    enabled: true,
                    style: {
                      color: axisLabelColor,
                      fontSize: "8px",
                    },
                  },
                  gridLineWidth: 0,
                  categories: currentHeatmapData.yAxisCategories,
                },
                colorAxis: {
  min: 0,
  max: metric === "PR" ? 100 : 10,

  stops: [
    [0, "#22c55e"],     // Green
    [0.4, "#84cc16"],   // Light Green
    [0.7, "#f59e0b"],   // Orange
    [1, "#ef4444"],     // Red
  ],

  labels: {
    style: {
      color: axisLabelColor,
      fontSize: "8px",
    },
  },
},
                tooltip: {
                  backgroundColor: tooltipBgColor,
                  style: {
                    color: tooltipTextColor,
                    fontSize: "11px",
                  },
                  formatter: function (this: any) {
                    const inverter =
                      this.series.yAxis.categories[this.point.y];
                    const time =
                      currentHeatmapData.xAxisCategories[this.point.x] || "";
                    const unit = metric === "PR" ? "%" : "kWh/kWp";
                    return `<b>${inverter}</b><br>${time} : <b>${(this.point?.value || 0).toFixed(2)} ${unit}</b>`;
                  },
                },
              }}
            />
          )}
        </Box>
      </VStack>
    </GraphLayout>
  );
};

export default InverterPRvsYieldGraph;