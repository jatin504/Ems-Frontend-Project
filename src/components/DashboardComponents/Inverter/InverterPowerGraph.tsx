// InverterPowerGraph.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColorModeValue, Select, Box } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

interface DeviceOption {
  id: string;
  label: string;
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

const InverterPowerGraph: React.FC = () => {

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

  const [selectedDevice, setSelectedDevice] = useState("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

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

  const { data, fetchData } = useTimeseriesData();

  /*  TIMEWINDOW → NAVIGATOR SYNC */
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

  const buildDataSource = () => ({
    devices:{ patterns:["_bank_bank_"], ids:[] },
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
  },[timeWindow]);

  useEffect(()=>{
    const {interval,intervalType}=timeWindow.timeRange;
    const refreshMs = intervalToMs(interval || 1,intervalType);

    const id = setInterval(()=>{
      fetchData(buildDataSource() as any);
    },refreshMs);

    return ()=>clearInterval(id);
  },[
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType
  ]);

  useEffect(()=>{
    const widgetData = data as WidgetData | null;
    if(!widgetData){ setDeviceOptions([]); return; }

    const options = Object.keys(widgetData).map(id=>{
      const suf = id.match(/_(\d+)$/)?.[1];
      return { id, label: suf ? `INV_${suf}` : id };
    });

    options.sort((a,b)=>a.label.localeCompare(b.label));
    setDeviceOptions(options);
  },[data]);

  const seriesForChart = useMemo(()=>{
    const widgetData = data as WidgetData | null;
    if(!widgetData) return [];

    const series:any[]=[];

    Object.keys(widgetData).forEach(deviceId=>{
      if(selectedDevice!=="ALL" && selectedDevice!==deviceId) return;

      const pts = widgetData[deviceId]?.[POWER_ALIAS];
      if(!pts?.length) return;

      const suf = deviceId.match(/_(\d+)$/)?.[1] || deviceId;

      const colorIndex =
        !isNaN(Number(suf))
          ? (parseInt(suf)-1)%COLORS.length
          : series.length%COLORS.length;

      series.push({
        type:"spline",
        name:`${POWER_ALIAS}-${suf}`,
        data: pts.map(p=>[p.ts,p.value]),
        marker:{enabled:true},
        color:COLORS[colorIndex]
      });
    });

    return series;
  },[data,selectedDevice]);

  const textColor = useColorModeValue("#1A202C","#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568","#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)","rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)","rgba(255,255,255,0.06)");

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box fontWeight="600">Power</Box>

            <Select
              value={selectedDevice}
              onChange={(e)=>setSelectedDevice(e.target.value)}
              size="xs"
              minW="90px"
              height="24px"
              fontSize="11px"
              bg={useColorModeValue("gray.100","gray.700")}
              borderRadius="4px"
            >
              <option value="ALL">ALL</option>
              {deviceOptions.map(opt=>(
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </Select>
          </Box>

          {/*  DATE NAVIGATOR */}
          <Box
            ml={isFullScreen ? "900" : "28"}
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
      width={["100%"]}
      height="100%"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesForChart}
        height={260}
        onExportReady={setExportFunctions}
        props={{
          yAxis:{
            tickAmount:6,
            title:{text:null},
            labels:{style:{color:textColor}},
            gridLineColor:gridColor
          },
          xAxis:{
            type:"datetime",
            labels:{style:{color:subTextColor}},
            lineColor:axisLineColor,
            gridLineColor:gridColor,
            tickInterval:60*60*2*1000,
            min: !manualChanges ? undefined : new Date(new Date().setHours(4,0,0,0)).getTime(),
            max: !manualChanges ? undefined : new Date(new Date().setHours(20,0,0,0)).getTime()
          }
        }}
      />
    </GraphLayout>
  );
};

export default InverterPowerGraph;