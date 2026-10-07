import React, { useEffect, useMemo, useState } from "react";
import { Box, Select, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraphNew";
import WidgetTitle from "../../Common/WidgetTitle";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../types/graphExport/export";

type TemperatureParameter = "Average" | "Maximum" | "Minimum";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetDeviceData {
  [key: string]: WidgetPoint[];
}

interface WidgetData {
  [deviceId: string]: WidgetDeviceData;
}

const TemperatureDistribution: React.FC = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [parameter, setParameter] =
    useState<TemperatureParameter>("Average");

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

  const rackDevices = [
    "plant_1_pcs_2_bank_bank_1_rack_rack_1",
    "plant_1_pcs_2_bank_bank_1_rack_rack_2",
    "plant_1_pcs_2_bank_bank_1_rack_rack_3",
    "plant_1_pcs_2_bank_bank_1_rack_rack_4",
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
   * Temperature keys
   */
  const dataSource = useMemo(
    () => ({
      devices: {
        patterns: [],
        ids: rackDevices,
      },

      keys: [
        {
          key: "average_cell_temperature",
          alias: "Average Temperature",
          keyType: "common",
        },
        {
          key: "maximum_cell_temperature",
          alias: "Maximum Temperature",
          keyType: "common",
        },
        {
          key: "minimum_cell_temperature",
          alias: "Minimum Temperature",
          keyType: "common",
        },
      ],

      aggregation: timeWindowConfig.aggregation,
      timeRange: timeWindowConfig.timeRange,
      orderBy: timeWindowConfig.orderBy,
    }),
    [timeWindowConfig]
  );

  const { data, fetchData } = useTimeseriesData();

  /*
   * API call
   */
  useEffect(() => {
    fetchData(dataSource as any);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindowConfig]);

  /*
   * Get selected temperature value
   */
  const selectedTemperatureKey = useMemo(() => {
    switch (parameter) {
      case "Maximum":
        return "Maximum Temperature";

      case "Minimum":
        return "Minimum Temperature";

      default:
        return "Average Temperature";
    }
  }, [parameter]);

  /*
   * Convert API response to chart data
   */
  const chartData = useMemo(() => {
    const widgetData =
      ((data as any)?.data ?? data) as WidgetData | null;

    if (!widgetData) {
      return {
        categories: [],
        series: [],
      };
    }

    const categories: string[] = [];

    const values: (number | null)[] = [];

    rackDevices.forEach((deviceId, index) => {
      const rackNumber = index + 1;

      categories.push(`Rack-${rackNumber}`);

      const deviceData = widgetData[deviceId];

      if (!deviceData) {
        values.push(null);
        return;
      }

      const series = deviceData[selectedTemperatureKey];

      if (!Array.isArray(series) || series.length === 0) {
        values.push(null);
        return;
      }

      /*
       * DESC order => first point is latest
       */
      const latestPoint = series[0];

      const value = Number(latestPoint?.value);

      values.push(
        Number.isFinite(value) ? value : null
      );
    });

    /*
     * Split values into Normal / Warning / Alarm
     * so legend remains visible.
     */
    const normalData = values.map((value) => {
      if (value === null) return null;
      return value < 40 ? value : null;
    });

    const warningData = values.map((value) => {
      if (value === null) return null;
      return value >= 40 && value <= 50 ? value : null;
    });

    const alarmData = values.map((value) => {
      if (value === null) return null;
      return value > 50 ? value : null;
    });

    return {
      categories,

      series: [
        {
          name: "Normal (<40°C)",
          type: "column",
          color: "#67C23A",
          data: normalData,
        },
        {
          name: "Warning (40-50°C)",
          type: "column",
          color: "#F59E0B",
          data: warningData,
        },
        {
          name: "Alarm (>50°C)",
          type: "column",
          color: "#EF4444",
          data: alarmData,
        },
      ],
    };
  }, [data, selectedTemperatureKey]);

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <WidgetTitle color={textColor}>Temperature Distribution</WidgetTitle>

          <Select
            size="xs"
            width="110px"
            height="24px"
            fontSize="11px"
            value={parameter}
            onChange={(e) =>
              setParameter(
                e.target.value as TemperatureParameter
              )
            }
            bg={useColorModeValue(
              "gray.100",
              "gray.700"
            )}
            borderRadius="4px"
          >
            <option value="Average">Average</option>
            <option value="Maximum">Maximum</option>
            <option value="Minimum">Minimum</option>
          </Select>
        </Box>
      }
      width={["500px"]}
      height="100%"
      fullScreen
      timeWindow={false}
      onTimeWindowChange={(config) =>
        handleTimeWindowChange(config)
      }
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={chartData.series}
        category={chartData.categories}
        height={250}
        barWidth={20}
        barCategoryGap="25%"
        borderRadius={4}
        legendHeight={40}
        axisLabelColor={subTextColor}
        gridColor={gridColor}
        lineColor={axisLineColor}
        legendColor={textColor}
        tooltipBg={useColorModeValue(
          "#FFFFFF",
          "rgba(24,24,27,0.95)"
        )}
        tooltipColor={textColor}
        onExportReady={setExportFunctions}
      />
    </GraphLayout>
  );
};

export default TemperatureDistribution;