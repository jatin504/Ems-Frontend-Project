import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import SplineGraph from "../../../../components/Graphs/RevampCharts/SplineGraph";

import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import useDateFormatterMargin from "../../../DateFormatter";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface WMSTrendChartProps {
  selectedDevice: string;
}

const WMSTrendChart: React.FC<WMSTrendChartProps> = ({
  selectedDevice,
}) => {

  const textColor = useColorModeValue(
    "#1A202C",
    "#E6E6E6"
  );

  const subTextColor = useColorModeValue(
    "#4A5568",
    "#B9B9B9"
  );

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "avg",
    [1, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
    }
  );

  const { data, fetchData } = useTimeseriesData();

  const [currentDate, setCurrentDate] = useState(new Date());

  const dateFormatterMargin = useDateFormatterMargin({
    fullScreenMargin: "900",
    normalMargin: "28",
  });

  const formattedDate = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(currentDate.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  }, [currentDate]);

  const isToday = useMemo(() => {
    const t = new Date();
    return (
      currentDate.getFullYear() === t.getFullYear() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getDate() === t.getDate()
    );
  }, [currentDate]);

  const applyAbsoluteDay = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    handleTimeWindowChange({
      aggregation: timeWindow.aggregation,
      orderBy: timeWindow.orderBy,
      timeRange: {
        type: "absolute",
        startTs: start.getTime(),
        endTs: end.getTime(),
      },
    });
  };

  const goPrevDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;

    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);

      const today = new Date();

      const reachedToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();

      if (reachedToday) {
        handleReset();
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  useEffect(() => {

    if (!selectedDevice) return;

    const payload = {

      devices: {
        ids: [selectedDevice],
        patterns: [],
      },

      keys: [

        {
          key: "irradiance",
          alias: "Irradiance",
          keyType: "timeseries",
        },

        {
          key: "temperature",
          alias: "Ambient Temperature",
          keyType: "timeseries",
        },

      ],

      aggregation: {
        func: "avg",
        interval: 5,
        intervalType: "minute",
      },

      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },

      orderBy: "ASC",

    } as any;

    const fetchTrend = () => fetchData(payload);

    // initial
    fetchTrend();

    const interval = setInterval(
      fetchTrend,
      60000
    );

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const seriesForChart = useMemo(() => {

    const irrData =
      data?.[selectedDevice]?.["Irradiance"] || [];

    const tempData =
      data?.[selectedDevice]?.["Ambient Temperature"] || [];

    return [

      {
        type: "spline",

        name: "Irradiance",

        data: irrData.map((d: any) => [
          d.ts,
          Number(d.value),
        ]),

        color: "#ffb020",
      },

      {
        type: "spline",

        name: "Ambient Temp",

        data: tempData.map((d: any) => [
          d.ts,
          Number(d.value),
        ]),

        color: "#65d10d",
      },

    ];

  }, [data, selectedDevice]);

  return (

    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">Irradiance & Ambient Temperature Trend</Box>

          <Box
            ml="12px"
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>

            <Box fontSize="11px" fontWeight="600" minW="78px" textAlign="center">
              {formattedDate}
            </Box>

            <Box
              cursor={isToday ? "not-allowed" : "pointer"}
              opacity={isToday ? 0.35 : 1}
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>
        </Box>
      }

      width={["688px"]}

      height="424px"

      fullScreen

      timeWindow

      onTimeWindowChange={handleTimeWindowChange}

      onReset={handleReset}
    >

      <SplineGraph
        apiData={seriesForChart}

        height={360}

        props={{

          plotOptions: {

            series: {
              connectNulls: false,
              turboThreshold: 5000,
            },

            spline: {
              lineWidth: 2,
              marker: {
                enabled: false,
              },
            },

          },

          yAxis: {

            labels: {
              style: {
                color: textColor,
              },
            },

            gridLineColor: gridColor,

          },

          xAxis: {

            type: "datetime",

            labels: {
              style: {
                color: subTextColor,
              },
            },

            lineColor: axisLineColor,

            gridLineColor: gridColor,

            gridLineDashStyle: "ShortDot",

            gridLineWidth: 1,

          },

          legend: {

            align: "center",

            verticalAlign: "bottom",

            layout: "horizontal",

            itemStyle: {
              color: textColor,
            },

          },

          tooltip: {

            shared: true,

            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),

            style: {
              color: textColor,
            },

          },

        }}
      />

    </GraphLayout>
  );
};

export default WMSTrendChart;