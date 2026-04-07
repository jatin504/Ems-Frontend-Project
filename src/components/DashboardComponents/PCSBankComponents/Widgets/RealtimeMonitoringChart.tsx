import { useColorModeValue, Box } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useEffect, useMemo, useRef, useState } from "react";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";

interface RealtimeMonitoringChartProps {
  bankId: string;
}

function buildBankDeviceId(bankId: string) {
  const match = bankId.match(/pcs_(\d+)_bank_(\d+)/);
  if (!match) return null;
  const [, pcs, bank] = match;
  return `plant_1_pcs_${pcs}_bank_bank_${bank}`;
}

const RealtimeMonitoringChart: React.FC<RealtimeMonitoringChartProps> = ({ bankId }) => {

  const {
    config: timeWindowMonitoring,
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
        intervalType: "hour",
      },
    }
  );

  const timeWindowRef = useRef(timeWindowMonitoring);
  useEffect(() => {
    timeWindowRef.current = timeWindowMonitoring;
  }, [timeWindowMonitoring]);

  /*  DATE STATE */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateNavEnabled, setDateNavEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFs = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  /*  TIMEWINDOW SYNC */
  useEffect(() => {

    const tw = timeWindowMonitoring.timeRange;

    if (tw.type === "absolute") {
      if (tw.startTs) {
        setCurrentDate(new Date(tw.startTs));
        setDateNavEnabled(true);
      }
      return;
    }

    if (tw.type === "relative") {

      if (tw.relativeType === "currentDaySoFar") {
        setCurrentDate(new Date());
        setDateNavEnabled(true);
        return;
      }

      if (tw.relativeType === "yesterday") {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        setCurrentDate(d);
        setDateNavEnabled(true);
        return;
      }

      setDateNavEnabled(false);
      return;
    }

    if (tw.type === "last") {
      setDateNavEnabled(false);
    }

  }, [timeWindowMonitoring]);

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

    if (!dateNavEnabled) return;

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
    if (!dateNavEnabled) return;

    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (!dateNavEnabled || isToday) return;

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

  const deviceId = buildBankDeviceId(bankId);

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: { patterns: [], ids: [deviceId] },
      keys: [
        { key: "soc", alias: "Current (A)", keyType: "individual", type: "spline" },
        { key: "bcu_1_lowest_pack_voltage", alias: "Voltage (V)", keyType: "individual", type: "spline" },
        { key: "bcu_1_highest_pack_temperature", alias: "Temp (°C)", keyType: "individual", type: "spline" },
      ],
      aggregation: timeWindowMonitoring.aggregation,
      timeRange: timeWindowMonitoring.timeRange,
      orderBy: timeWindowMonitoring.orderBy,
    } as any);

  }, [timeWindowMonitoring, deviceId]);

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
            yAxis: metric === "Temp (°C)" ? 1 : 0,
          });
        }
      });
    });

    return s;
  }, [data]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">Real Time Monitoring</Box>

          <Box ml={isFullScreen ? "700px" : "250px"}
            opacity={dateNavEnabled ? 1 : 0.4}
            pointerEvents={dateNavEnabled ? "auto" : "none"}
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
      width={["930px"]}
      height="534px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={458}
        onExportReady={setExportFunctions}
        props={{
          yAxis: [
            { tickAmount: 6, title: { text: null }, labels: { style: { color: textColor } }, gridLineColor: gridColor },
            { tickAmount: 6, opposite: true, title: { text: null }, gridLineColor: gridColor, labels: { style: { color: textColor } } }
          ],
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },
          tooltip: { shared: true },
          legend: { align: "center", verticalAlign: "bottom" }
        }}
      />
    </GraphLayout>
  );
};

export default RealtimeMonitoringChart;