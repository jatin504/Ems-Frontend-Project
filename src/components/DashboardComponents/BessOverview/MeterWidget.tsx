import { useEffect, useState, useMemo, useRef } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useColorModeValue, Box } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../types/graphExport/export";

const MeterWidget = () => {

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "avg",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 12,
        intervalType: "hour",
      },
    }
  );

  const timeWindowRef = useRef(timeWindow);

  useEffect(() => {
    timeWindowRef.current = timeWindow;
  }, [timeWindow]);

  /*  DATE STATE */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFs = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  useEffect(() => {
    const tw = timeWindow.timeRange;

    if (tw.type === "absolute") {
      setCurrentDate(new Date(tw.startTs));
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
      aggregation: timeWindowRef.current.aggregation,
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

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: [],
        ids: ["plant_1_pcs_2_bank_bank_1"],
      },
      keys: [
        { key: "active_power", alias: "Active Power", keyType: "common" },
        { key: "reactive_power", alias: "Reactive Power", keyType: "common" },
        { key: "apparent_power", alias: "Apparent Power", keyType: "common" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    },
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource);
  }, [timeWindow]);

  const seriesForChart = useMemo(() => {

    if (!data) return [];

    const s: any[] = [];

    Object.values(data).forEach((deviceObj: any) => {
      Object.entries(deviceObj).forEach(([metric, pts]: any) => {
        if (Array.isArray(pts)) {
          s.push({
            type: "spline",
            name: metric,
            data: pts.map((p: any) => [p.ts, p.value]),
            marker: { enabled: true },
          });
        }
      });
    });

    return s;

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

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">Meter Data</Box>

          <Box
            ml={isFullScreen ? "900px" : "130px"}
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
      width={["100%"]}
      height="344px"
      mt={0}
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
          tooltip: { shared: true },
          legend: { align: "center", verticalAlign: "bottom" },
        }}
      />
    </GraphLayout>
  );
};

export default MeterWidget;