import { useEffect, useState, useMemo, useRef } from "react";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useColorModeValue, Box } from "@chakra-ui/react";
import useDateFormatterMargin from "../../../DateFormatter";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const MeterWidget = () => {

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
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
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const timeWindowRef = useRef(timeWindow);

  useEffect(() => {
    timeWindowRef.current = timeWindow;
  }, [timeWindow]);

  /*  DATE STATE */
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const tw = timeWindow.timeRange;

    if (tw.type === "absolute") {
      setCurrentDate(new Date(tw.startTs ?? Date.now()));
    }

    if (tw.type === "relative") {
      if (tw.relativeType === "currentDaySoFar") {
        setCurrentDate(new Date());
      }

      if (tw.relativeType === "yesterday") {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        setCurrentDate(d);
      }
    }

  }, [timeWindow]);

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
      orderBy: "ASC",
      timeRange: {
        type: "absolute",
        startTs: start.getTime(),
        endTs: end.getTime(),
      },
    });
  };

  const goPrevDay = () => {

    setCurrentDate(prev => {

      const d = new Date(prev);
      d.setDate(d.getDate() - 1);

      applyAbsoluteDay(d);

      return d;
    });

  };

  const goNextDay = () => {

    if (isToday) return;

    setCurrentDate(prev => {

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

  // removed memoized fetching payload; we'll construct request in the effect below

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    const loadData = () => {
      fetchData({
        devices: {
          patterns: [],
          ids: ["plant_1_ht_outgoing_meter_1"],
        },
        keys: [
          {
            key: "total_active_power",
            alias: "Power (kW)",
            keyType: "common",
            type: "spline",
          },
          {
            key: "total_reactive_power",
            alias: "Power (kVAR)",
            keyType: "common",
            type: "spline",
          },
          {
            key: "total_apparent_power",
            alias: "Power (KVA)",
            keyType: "common",
            type: "spline",
          },
        ],
        aggregation: timeWindow.aggregation,
        timeRange: timeWindow.timeRange,
        orderBy: "ASC",
      } as any);
    };

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, [timeWindow]);

  const seriesForChart = useMemo(() => {

    if (!data || typeof data !== "object") return [];

    const s: any[] = [];

    Object.values(data).forEach((deviceObj: any) => {

      if (!deviceObj) return;

      Object.entries(deviceObj).forEach(([metric, pts]: any) => {

        if (Array.isArray(pts)) {

          s.push({
            type: "spline",
            name: metric,

            data: pts
              .filter(
                (p: any) =>
                  p &&
                  p.ts &&
                  p.value !== null &&
                  p.value !== undefined &&
                  !isNaN(Number(p.value))
              )
              .map((p: any) => [Number(p.ts), Number(p.value)])
              .sort((a: any, b: any) => a[0] - b[0]),

            marker: {
              enabled: false,
            },
          });

        }

      });

    });

    return s.length ? s : [{}];

  }, [data]);

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

  const dateFormatterMargin = useDateFormatterMargin({
    fullScreenMargin: "900",
    normalMargin: "130px",
  });

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">Meter Data</Box>

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
      width={["630px"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },
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
          tooltip: { shared: true },
          legend: { align: "center", verticalAlign: "bottom" },
        }}
      />
    </GraphLayout>
  );
};

export default MeterWidget;