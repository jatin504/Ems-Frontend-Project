import React, { useEffect, useMemo, useState } from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

type MetricType = "voltage" | "temperature";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyName: string]: WidgetPoint[];
  };
}

const CellVoltageHeatmap = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [parameter, setParameter] = useState({
    label: "Cell Voltage",
    value: "voltage" as MetricType,
  });

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

  const parameterOptions = [
    {
      label: "Cell Voltage",
      value: "voltage" as MetricType,
    },
    {
      label: "Cell Temperature",
      value: "temperature" as MetricType,
    },
  ];

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

  /*
   * Rack device mapping
   */
  const rackDevices = [
    "plant_1_pcs_2_bank_bank_1_rack_rack_1",
    "plant_1_pcs_2_bank_bank_1_rack_rack_2",
    "plant_1_pcs_2_bank_bank_1_rack_rack_3",
    "plant_1_pcs_2_bank_bank_1_rack_rack_4",
  ];

  /*
   * Actual telemetry keys from config
   */
  const dataSource = useMemo(
    () => ({
      devices: {
        patterns: [],
        ids: rackDevices,
      },

      keys: [
        {
          key: "total_voltage",
          alias: "Cell Voltage",
          keyType: "common",
          type: "spline",
        },
        {
          key: "average_cell_temperature",
          alias: "Cell Temperature",
          keyType: "common",
          type: "spline",
        },
      ],

      aggregation: timeWindowConfig.aggregation,
      timeRange: timeWindowConfig.timeRange,
      orderBy: timeWindowConfig.orderBy,
    }),
    [timeWindowConfig]
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(dataSource as any);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindowConfig]);

  /*
   * Convert API response into heatmap data
   */
  const currentHeatmapData = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData) return null;

    const alias =
      parameter.value === "voltage"
        ? "Cell Voltage"
        : "Cell Temperature";

    const rackList: {
      deviceId: string;
      label: string;
      numericSuffix: number;
    }[] = [];

    /*
     * Get only rack devices from API response
     */
    Object.keys(widgetData).forEach((deviceId) => {
      if (!rackDevices.includes(deviceId)) return;

      const match = deviceId.match(/_rack_(\d+)$/);

      const numericSuffix = match
        ? parseInt(match[1], 10)
        : 999999;

      const label = match
        ? `Rack-${match[1]}`
        : deviceId;

      rackList.push({
        deviceId,
        label,
        numericSuffix,
      });
    });

    /*
     * Sort Rack-1, Rack-2, Rack-3, Rack-4
     */
    rackList.sort(
      (a, b) => a.numericSuffix - b.numericSuffix
    );

    const yAxisCategories: string[] = [];

    const rawPoints: {
      ts: number;
      y: number;
      value: number;
    }[] = [];

    /*
     * Create heatmap points
     */
    rackList.forEach(({ deviceId, label }) => {
      const deviceData = widgetData[deviceId];

      if (!deviceData) return;

      const rowIndex = yAxisCategories.length;

      yAxisCategories.push(label);

      const points = deviceData[alias] || [];

      points.forEach((p) => {
        if (!p) return;

        const value = Number(p.value);

        if (!Number.isFinite(value)) return;

        rawPoints.push({
          ts: p.ts,
          y: rowIndex,
          value,
        });
      });
    });

    if (rawPoints.length === 0) return null;

    /*
     * Keep 04:00 AM - 08:00 PM
     * Same logic as sample heatmap
     */
    const filteredPoints = rawPoints.filter((p) => {
      const date = new Date(p.ts);
      const hour = date.getUTCHours();

      return hour >= 4 && hour <= 20;
    });

    if (filteredPoints.length === 0) return null;

    const allTS = filteredPoints.map((p) => p.ts);

    const uniqueSortedTs = Array.from(
      new Set(allTS)
    ).sort((a, b) => a - b);

    /*
     * Timestamp -> X-axis index
     */
    const tsIndexMap = new Map<number, number>();

    uniqueSortedTs.forEach((ts, idx) => {
      tsIndexMap.set(ts, idx);
    });

    /*
     * Heatmap data:
     * [timeIndex, rackIndex, value]
     */
    const seriesData: [number, number, number][] =
      filteredPoints.map((p) => [
        tsIndexMap.get(p.ts) ?? 0,
        p.y,
        p.value,
      ]);

    return {
      series: [
        {
          type: "heatmap",
          name:
            parameter.value === "voltage"
              ? "Cell Voltage"
              : "Cell Temperature",
          borderWidth: 0.5,
          data: seriesData,
        },
      ],

      xAxisCategories: uniqueSortedTs.map((ts) => {
        const date = new Date(ts);

        return `${String(
          date.getUTCHours()
        ).padStart(2, "0")}:${String(
          date.getUTCMinutes()
        ).padStart(2, "0")}`;
      }),

      yAxisCategories,

      lastUpdateTime: String(
        uniqueSortedTs[uniqueSortedTs.length - 1]
      ),
    };
  }, [data, parameter.value]);

  /*
   * Color range according to selected parameter
   */
  const colorAxis = useMemo(() => {
    if (parameter.value === "voltage") {
      return {
        min: 3.20,
        max: 3.40,

        stops: [
          [0, "#16a34a"],
          [0.5, "#facc15"],
          [1, "#dc2626"],
        ],
      };
    }

    return {
      min: 25,
      max: 40,

      stops: [
        [0, "#16a34a"],
        [0.5, "#facc15"],
        [1, "#dc2626"],
      ],
    };
  }, [parameter.value]);

  return (
    <GraphLayout
      title="Cell Voltage Heatmap"
      titleLengthSVG={75}
      titleLengthLongSVG={1680}
      width={["750px"]}
      height={"100%"}
      fullScreen
      timeWindow={false}
      mt="2"
      onTimeWindowChange={(config) =>
        handleTimeWindowChange(config)
      }
      onReset={handleReset}
    >
      <VStack
        w="100%"
        h="100%"
        spacing={2}
        align="stretch"
      >
        {/* Top Right Dropdown */}

        <HStack
          justify="flex-end"
          w="100%"
          mb={1}
        >
          <Select
            isMulti={false}
            size="sm"
            variant="flushed"
            closeMenuOnSelect
            options={parameterOptions}
            value={parameter}
            selectedOptionColorScheme="green"
            focusBorderColor="#062D59"
            onChange={(e) => {
              if (e) {
                setParameter(e as {
                  label: string;
                  value: MetricType;
                });
              }
            }}
            chakraStyles={{
              valueContainer: (provided) => ({
                ...provided,
                fontSize: "10px",
                width: "170px",
              }),

              control: (provided) => ({
                ...provided,
                minHeight: "20px",
                height: "20px",
              }),

              option: (provided) => ({
                ...provided,
                fontSize: "10px",
                height: "18px",
              }),

              menuList: (provided) => ({
                ...provided,
                maxHeight: "100px",
              }),
            }}
          />
        </HStack>

        {/* Heatmap */}

        <Box
          flex="1"
          w="100%"
          minH="220px"
        >
          {currentHeatmapData && (
            <HeatmapChart
              height={250}
              apiData={
                isFullscreen
                  ? currentHeatmapData.series
                  : [
                      {
                        ...currentHeatmapData.series[0],
                        data:
                          currentHeatmapData.series[0].data.filter(
                            (point: any) =>
                              point[1] <= 3
                          ),
                      },
                    ]
              }
              isFullscreen={isFullscreen}
              onFullscreenChange={setIsFullscreen}
              props={{
                colorAxis,

                xAxis: {
                  type: "category",
                  min: 0,
                  max:
                    currentHeatmapData
                      .xAxisCategories.length - 1,
                  categories:
                    currentHeatmapData.xAxisCategories,

                  labels: {
                    style: {
                      color: axisLabelColor,
                      fontSize: "8px",
                    },
                  },
                },

                yAxis: {
                  title: null,

                  min: 0,
                  max: isFullscreen
                    ? currentHeatmapData
                        .yAxisCategories.length - 1
                    : 3,

                  categories:
                    currentHeatmapData.yAxisCategories,

                  labels: {
                    enabled: true,

                    style: {
                      color: axisLabelColor,
                      fontSize: "8px",
                    },
                  },

                  gridLineWidth: 0,
                },

                tooltip: {
                  backgroundColor: tooltipBgColor,

                  style: {
                    color: tooltipTextColor,
                    fontSize: "11px",
                  },

                  formatter: function (this: any) {
                    const rack =
                      this.series.yAxis.categories[
                        this.point.y
                      ];

                    const time =
                      currentHeatmapData
                        .xAxisCategories[
                          this.point.x
                        ] || "";

                    const unit =
                      parameter.value === "voltage"
                        ? "V"
                        : "°C";

                    return `
                      <b>${rack}</b><br/>
                      ${time}<br/>
                      <b>${Number(
                        this.point.value
                      ).toFixed(2)} ${unit}</b>
                    `;
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

export default CellVoltageHeatmap;