import React, { useEffect, useMemo, useState } from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

type MetricType = "Power" | "Voltage";

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

const SMBvsStringGraph: React.FC = () => {
  const metricOptions = [
    { label: "SMB Power (kW)", value: "Power" },
    { label: "SMB Voltage (V)", value: "Voltage" },
  ];

  const [metric, setMetric] = useState<MetricType>("Power");
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
      patterns: ["_bank_bank_"],
      ids: [],
    },
    keys: [
      {
        key: "active_power",
        alias: "String-1",
        keyType: "common",
        type: "spline",
      },
      {
        key: "power_factor",
        alias: "String-2",
        keyType: "common",
        type: "spline",
      },
      {
        key: "rated_power",
        alias: "String-3",
        keyType: "common",
        type: "spline",
      },
      {
        key: "phase_a_active_power",
        alias: "String-4 (kW)",
        keyType: "common",
        type: "spline",
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

  const currentHeatmapData: HeatmapData | null = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return null;

    const alias = metric === "Power" ? "SMB Power (kW)" : "SMB Voltage (V)";

    const deviceList: { deviceId: string; label: string; numericSuffix: number }[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const label = suffix ? `SMB-${suffix}` : deviceId;
      const numericSuffix = match ? parseInt(match[1], 10) : 999999;

      deviceList.push({ deviceId, label, numericSuffix });
    });

    deviceList.sort((a, b) => a.numericSuffix - b.numericSuffix);

    const xAxisCategories: string[] = [];
    const rawPoints: { x: number; y: number; value: number }[] = [];
    let maxYIndex = 0;

    // X-axis: SMB devices
    deviceList.forEach(({ deviceId, label }, xIndex) => {
      xAxisCategories.push(label);
      
      const deviceData = widgetData[deviceId];
      if (!deviceData) return;

      const points = deviceData[alias] || [];
      points.forEach((p, yIndex) => {
        if (!p) return;
        rawPoints.push({ x: xIndex, y: yIndex, value: p.value });
        maxYIndex = Math.max(maxYIndex, yIndex);
      });
    });

    if (rawPoints.length === 0) return null;

    const yAxisCategories: string[] = Array.from({ length: maxYIndex + 1 }, (_, i) => `${i + 1}`);

    const seriesData: [number, number, number][] = rawPoints.map((p) => [
      p.x,
      p.y,
      p.value,
    ]);

    return {
      series: [
        {
          type: "heatmap",
          name: metric === "Power" ? "SMB Power (kW)" : "SMB Voltage (V)",
          borderWidth: 1,
          data: seriesData,
        },
      ],
      xAxisCategories,
      yAxisCategories,
      lastUpdateTime: String(Date.now()),
    };
  }, [data, metric]);

  return (
    <GraphLayout
      title="SMB vs String Heatmap"
      titleLengthSVG={70}
      titleLengthLongSVG={1680}
      width={["100%"]}
      height={"100%"}
      fullScreen
      timeWindow={true}
      mt="2"
      onTimeWindowChange={(config) => handleTimeWindowChange(config)}
      onReset={handleReset}
    >
      <VStack width={"100%"} height={"100%"} spacing={2} align="stretch">
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
                const val = (e?.value as MetricType) || "Power";
                setMetric(val);
              }}
              selectedOptionColorScheme="green"
              value={metricOptions.find((option) => option.value === metric)}
            />
          </HStack>
        </HStack>

        <Box width={"100%"} flex="1" minH="180px" maxH="420px" p="4px">
          {currentHeatmapData && currentHeatmapData.series && (
            <HeatmapChart
              height={isFullscreen ? 600 : 320}
              apiData={
                isFullscreen
                  ? currentHeatmapData.series
                  : [
                      {
                        ...currentHeatmapData.series[0],
                        data: currentHeatmapData.series[0].data.filter(
                          (point: any) => point[0] <= 9
                        ),
                      },
                    ]
              }
              isFullscreen={isFullscreen}
              onFullscreenChange={setIsFullscreen}
              props={{
                xAxis: {
                  type: "category",
                  categories: currentHeatmapData.xAxisCategories,
                  labels: { style: { color: axisLabelColor, fontSize: "9px" } },
                },
                yAxis: {
                  title: null,
                  categories: currentHeatmapData.yAxisCategories,
                  labels: { style: { color: axisLabelColor, fontSize: "9px" } },
                  min: 0,
                  max: isFullscreen ? currentHeatmapData.yAxisCategories.length - 1 : 23,
                  crosshair: false,
                  gridLineWidth: 0,
                },
                tooltip: {
                  backgroundColor: tooltipBgColor,
                  style: { color: tooltipTextColor, fontSize: "11px" },
                  formatter: function (this: any) {
                    const smb = this.series.xAxis.categories[this.point.x];
                    const index = this.point.y + 1;
                    const unit = metric === "Power" ? "kW" : "V";
                    return `<b>${smb}</b><br>Value #${index} : <b>${this.point.value} ${unit}</b>`;
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

export default SMBvsStringGraph;