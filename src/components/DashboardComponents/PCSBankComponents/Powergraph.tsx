// InverterPowerGraph.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColorModeValue, Box } from "@chakra-ui/react";
import NonCommunicationIndicator from "../../Common/NonCommunicationIndicator";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import WidgetTitle from "../../Common/WidgetTitle";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";
import useDateFormatterMargin from "../../DateFormatter";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const POWER_ALIAS = "Power (kW)";

const COLORS = [
  "#ef4444","#f97316","#f59e0b","#84cc16","#10b981",
  "#06b6d4","#3b82f6","#6366f1","#a855f7","#ec4899",
];

const intervalToMs = (interval: number, unit: string) => {
  switch (unit) {
    case "second": return interval * 1000;
    case "minute": return interval * 60 * 1000;
    case "hour": return interval * 60 * 60 * 1000;
    default: return 60000;
  }
};

interface Props {
  selectedDevice: string;
}

const InverterPowerGraph: React.FC<Props> = ({ selectedDevice }) => {

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
    manualChanges
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
  useEffect(() => { timeWindowRef.current = timeWindow; }, [timeWindow]);

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateNavEnabled, setDateNavEnabled] = useState(true);
  const dateFormatterMargin = useDateFormatterMargin({
    fullScreenMargin: "900",
    normalMargin: "28",
  });

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    console.log("RAW API DATA");
    console.log(data);
  }, [data]);

  const nonCommStorage = JSON.parse(
    sessionStorage.getItem("non_comm_info") || "{}"
  );

  const inverterInfo = nonCommStorage?.inverter;

  const showNonComm = inverterInfo?.status === 1;

  const nonCommMessage =
    inverterInfo
      ? `${inverterInfo.message}
${
  inverterInfo.time
    ? `\nTime : ${inverterInfo.time}`
    : ""
}`
      : "";

  /* TIMEWINDOW → NAVIGATOR SYNC */
  useEffect(() => {

    const tw = timeWindow.timeRange;

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

    if (!dateNavEnabled) return;

    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    handleTimeWindowChange({
      aggregation: timeWindowRef.current.aggregation,
      orderBy: "ASC",
      timeRange:{
        type:"absolute",
        startTs:start.getTime(),
        endTs:end.getTime()
      }
    });
  };

  const goPrevDay = () => {
    if (!dateNavEnabled) return;

    setCurrentDate(prev=>{
      const d = new Date(prev);
      d.setDate(d.getDate()-1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (!dateNavEnabled || isToday) return;

    setCurrentDate(prev=>{
      const d = new Date(prev);
      d.setDate(d.getDate()+1);

      const today = new Date();

      const reachedToday =
        d.getFullYear()===today.getFullYear() &&
        d.getMonth()===today.getMonth() &&
        d.getDate()===today.getDate();

      if(reachedToday){
        handleReset();   // back to relative
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  const activeSelectedDevice = selectedDevice || "ALL";

  const buildDataSource = () => ({
    devices: {
      patterns: [],
      ids:
        activeSelectedDevice === "ALL"
          ? []
          : [activeSelectedDevice],
    },
    keys:[{
      key:"active_power",
      alias:POWER_ALIAS,
      keyType:"common",
      type:"spline"
    }],
    aggregation: timeWindowRef.current.aggregation,
    timeRange: timeWindowRef.current.timeRange,
    orderBy:"ASC"
  });

  useEffect(()=>{
    fetchData(buildDataSource() as any);
  },[timeWindow, activeSelectedDevice]);

  useEffect(()=>{
    const {interval,intervalType}=timeWindow.timeRange;
    const refreshInterval = interval ?? 1;
    const refreshMs = intervalToMs(refreshInterval, intervalType ?? "minute");

    const id = setInterval(()=>{
      fetchData(buildDataSource() as any);
    },refreshMs);

    return ()=>clearInterval(id);
  },[
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
    activeSelectedDevice
  ]);

  const seriesForChart = useMemo(()=>{
    const widgetData = data as WidgetData | null;
    if(!widgetData) return [];

    const series:any[]=[];

    Object.keys(widgetData).forEach(deviceId=>{
      if(activeSelectedDevice!="ALL" && activeSelectedDevice!==deviceId) return;

      const pts = widgetData[deviceId]?.[POWER_ALIAS];
      if(!pts?.length) return;

      const suf = deviceId.match(/_(\d+)$/)?.[1] || deviceId;

      const colorIndex =
        !isNaN(Number(suf))
          ? (parseInt(suf)-1)%COLORS.length
          : series.length%COLORS.length;

      console.log("================================");
      console.log("Device ID :", deviceId);
      console.log("Series Name :", `${POWER_ALIAS}-${suf}`);
      console.log("Points :", pts.length);

      series.push({
        type:"spline",
        name:`${POWER_ALIAS}-${suf}`,
        data: pts.map(p=>[p.ts,p.value]),
        marker:{enabled:false},

        boostThreshold:1,
        turboThreshold:50000,

        color:COLORS[colorIndex]
      });
    });

    console.log("Final Series Count :", series.length);
    console.table(
      series.map((s) => ({
        name: s.name,
        points: s.data.length,
      }))
    );

    return series;
  },[data,activeSelectedDevice]);

  const textColor = useColorModeValue("#1A202C","#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568","#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)","rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)","rgba(255,255,255,0.06)");

  const offset = new Date().getTimezoneOffset() * 60000;

  // console.log(window.innerHeight);


  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={3}>
            <WidgetTitle color={textColor}>Power</WidgetTitle>

            <Box>
              <NonCommunicationIndicator status={showNonComm} message={nonCommMessage} />
            </Box>

          </Box>

          {/* ⭐ DATE NAVIGATOR */}
          <Box
            ml={dateFormatterMargin}
            opacity={dateNavEnabled ? 1 : 0.4}
            pointerEvents={dateNavEnabled ? "auto" : "none"}
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100","gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>

            <Box fontSize="12px" fontWeight="600" minW="100px" textAlign="center">
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
      width={["632px"]}
      height="300px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SpineGraph
        key={activeSelectedDevice}
        apiData={seriesForChart}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          chart: {
            events: {
              mouseOut: function(this: any) {
                this.series.forEach((s: any) => {
                  s.setState("", true);
                });
              },
            },
          },
          plotOptions: {
            series: {
              shadow: false,
              lineWidth: 2,
              states: {
                inactive: {
                  opacity: 1,
                },
                hover: {
                  enabled: true,
                  lineWidth: 2,
                },
              },
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },
          yAxis:{
            tickAmount:6,
            title:{text:null},
            labels:{
              style:{color:textColor},
              formatter(this: any) {
                return (this as any).value.toFixed(2);
              },
            },
            gridLineColor:gridColor
          },
          xAxis:{
            type:"datetime",
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels:{style:{color:subTextColor}},
            lineColor:axisLineColor,
            gridLineColor:gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
            tickInterval:60*60*2*1000,
            min: !manualChanges ? undefined : new Date(new Date().setHours(4,0,0,0) - offset).getTime(),
            max: !manualChanges ? undefined : new Date(new Date().setHours(20,0,0,0) - offset).getTime()
          },
          tooltip: {
            shared: true,
            hideDelay: 0,
            backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"),
            style: {
              color: textColor,
            },
            valueDecimals: 2,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: {
              color: textColor,
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default InverterPowerGraph;
