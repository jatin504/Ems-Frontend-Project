import React, { useMemo, useState, useEffect } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useDateFormatterMargin from "../../DateFormatter";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

const minute = 60 * 1000;

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

type Props = {
  selectedDevice: string;
};

const stringRows = Array.from({ length: 24 }, (_, i) => i + 1);

const StringTrendChart: React.FC<Props> = ({ selectedDevice }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data, fetchData } = useTimeseriesData();

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
    manualChanges,
  } = useTimeHandle(
    12,
    "hour",
    "none",
    [1, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
    }
  );

  // compute absolute day range from selected date
  const absoluteDayRange = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { startTs: start.getTime(), endTs: end.getTime() };
  }, [currentDate]);

  const dateFormatterMargin = useDateFormatterMargin({ fullScreenMargin: "900", normalMargin: "328" });

  useEffect(() => {
    if (!selectedDevice) return;

    // decide which timeRange to use: prefer explicit absolute range
    // from the timeWindow if present, otherwise use the absolute
    // day range derived from `currentDate`.
    const timeRangeToUse: any =
      timeWindow.timeRange.type === "absolute"
        ? {
            type: "absolute",
            startTs: timeWindow.timeRange.startTs,
            endTs: timeWindow.timeRange.endTs,
          }
        : {
            type: "absolute",
            startTs: absoluteDayRange.startTs,
            endTs: absoluteDayRange.endTs,
          };

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },

      keys: stringRows.map((index) => ({
        key: `string_${index}_current`,
        alias: `string_${index}_current`,
        keyType: "common",
        type: "spline",
      })),


      aggregation: timeWindow.aggregation,

      timeRange: timeRangeToUse,

      orderBy: "ASC",
    } as any);

  }, [selectedDevice, timeWindow, absoluteDayRange, manualChanges]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData || !selectedDevice) return [];

    const deviceData = widgetData[selectedDevice];
    if (!deviceData) return [];

    return stringRows.map((index) => {
      const alias = `string_${index}_current`;
      const points = deviceData[alias] || [];

      return {
        type: "spline",
        name: `String_${index}`,
        data: points.map((p) => [p.ts, Number(p.value)]),
        marker: { enabled: false },
      };
    });

  }, [data, selectedDevice]);

  const goPrevDay = () => {
    setCurrentDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 1);

      const start = new Date(n);
      start.setHours(0, 0, 0, 0);

      const end = new Date(n);
      end.setHours(23, 59, 59, 999);

      handleTimeWindowChange({
        aggregation: timeWindow.aggregation,

        orderBy: "ASC",

        timeRange: {
          type: "absolute",
          startTs: start.getTime(),
          endTs: end.getTime(),
        },
      });

      return n;
    });
  };

  const goNextDay = () => {
    setCurrentDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 1);

      const today = new Date();

      const isToday = n.toDateString() === today.toDateString();

      if (isToday) {
        handleReset();
      } else {
        const start = new Date(n);
        start.setHours(0, 0, 0, 0);

        const end = new Date(n);
        end.setHours(23, 59, 59, 999);

        handleTimeWindowChange({
          aggregation: timeWindow.aggregation,

          orderBy: "ASC",

          timeRange: {
            type: "absolute",
            startTs: start.getTime(),
            endTs: end.getTime(),
          },
        });
      }

      return n;
    });
  };

  return (
    <Box mt="-16px">
      <GraphLayout
  title={
    <Box display="flex" alignItems="center" w="100%">
      <Box fontWeight="600">String Current Trend</Box>

      <Box
        ml={dateFormatterMargin}
        display="flex"
        alignItems="center"
        bg={useColorModeValue("gray.100", "gray.700")}
        borderRadius="6px"
        px={2}
        height="22px"
        gap={2}
      >
        <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>

        <Box
          fontSize="11px"
          fontWeight="600"
          minW="78px"
          textAlign="center"
        >
          {currentDate.toISOString().split("T")[0]}
        </Box>

        <Box cursor="pointer" fontSize="12px" onClick={goNextDay}>›</Box>
      </Box>
    </Box>
  }
  
  width={["100%"]}
  height="343px"

  fullScreen={true}
  timeWindow={true}
  onTimeWindowChange={handleTimeWindowChange}
  onReset={handleReset}
>
            <SplineGraph
              apiData={seriesForChart}
              height={280}
              props={{
                chart: {
                  zoomType: "x",
                  backgroundColor: "transparent",
                },

                title: { text: "" },

                yAxis: {
                  title: { text: null },
                  tickAmount: 6,
                  labels: {
                    style: {
                      color: useColorModeValue("#1A202C", "#E6E6E6"),
                    },
                  },
                },

                xAxis: {
                  type: "datetime",
                  labels: {
                    style: {
                      color: useColorModeValue("#6A89A7", "#6A89A7"),
                    },
                  },
                },

                tooltip: {
                  shared: true,
                  valueDecimals: 2,
                  backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"),
                },

                legend: {
                  enabled: true,
                  align: "center",
                  verticalAlign: "bottom",
                  itemStyle: {
                    color: useColorModeValue("#1A202C", "#E6E6E6"),
                  },
                },

                credits: {
                  enabled: false,
                },
              }}
            />
</GraphLayout>
    </Box>
  );
};

export default StringTrendChart;
