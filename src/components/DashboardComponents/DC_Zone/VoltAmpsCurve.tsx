import { useEffect, useMemo, useRef, useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Select as ChakraSelect } from "chakra-react-select";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
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

const VOLTAGE_ALIAS = "Voltage (V)";
const CURRENT_ALIAS = "Current (A)";

const intervalToMs = (interval: number, unit: string) => {
  switch (unit) {
    case "second": return interval * 1000;
    case "minute": return interval * 60000;
    case "hour": return interval * 3600000;
    default: return 60000;
  }
};

const VoltAmpsCurve = () => {

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
        type: "relative",
        relativeType: "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const timeWindowRef = useRef(timeWindow);
  useEffect(() => { timeWindowRef.current = timeWindow; }, [timeWindow]);

  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  /* ⭐ DATE STATE */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateNavEnabled, setDateNavEnabled] = useState(true);

  /* ⭐ TIMEWINDOW → DATE SYNC */
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
        handleReset();
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  const { data, fetchData } = useTimeseriesData();

  const buildDataSource = () => ({
    devices:{ patterns:["_bank_bank_"], ids:[] },
    keys:[
      { key:"phase_a_voltage", alias:VOLTAGE_ALIAS, keyType:"common", type:"spline" },
      { key:"bcu_2_rack_current", alias:CURRENT_ALIAS, keyType:"common", type:"spline" }
    ],
    aggregation: timeWindowRef.current.aggregation,
    timeRange: timeWindowRef.current.timeRange,
    orderBy: timeWindowRef.current.orderBy,
  });

  useEffect(()=>{ fetchData(buildDataSource() as any); },[timeWindow]);

  useEffect(()=>{
    const {interval,intervalType}=timeWindow.timeRange;
    const refreshMs = intervalToMs(interval ?? 1, intervalType ?? "minute");

    const id=setInterval(()=>{
      fetchData(buildDataSource() as any);
    },refreshMs);

    return ()=>clearInterval(id);

  },[timeWindow.timeRange.interval,timeWindow.timeRange.intervalType]);

  useEffect(()=>{
    const widgetData = data as WidgetData | null;
    if(!widgetData) return;

    const options = Object.keys(widgetData).map(id=>{
      const suf=id.match(/_bank_(\d+)$/)?.[1];
      return { id, label: suf?`Inverter-${suf}`:id };
    });

    options.sort((a,b)=>a.label.localeCompare(b.label));
    setDeviceOptions(options);

    if(options.length) setSelectedDevice(options[0].id);

  },[data]);

  const seriesForChart = useMemo(()=>{
    const widgetData = data as WidgetData | null;
    if(!widgetData) return [];

    const series:any[]=[];

    Object.keys(widgetData).forEach(deviceId=>{

      if(selectedDevice && selectedDevice!==deviceId) return;

      const vArr=widgetData[deviceId]?.[VOLTAGE_ALIAS];
      const cArr=widgetData[deviceId]?.[CURRENT_ALIAS];

      if(vArr && cArr){
        const len=Math.min(vArr.length,cArr.length);
        const pts:any[]=[];

        for(let i=0;i<len;i++){
          pts.push([Number(cArr[i].value),Number(vArr[i].value)]);
        }

        const suf=deviceId.match(/_bank_(\d+)$/)?.[1];

        series.push({
          type:"spline",
          name:suf?`Volt-Amps-${suf}`:"Volt-Amps",
          data:pts,
          marker:{enabled:true}
        });
      }

    });

    return series;

  },[data,selectedDevice]);

  const textColor = useColorModeValue("#1A202C","#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568","#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)","rgba(255,255,255,0.08)");

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%" gap={3}>

          <Box fontWeight="600">Volt-Amps Curve</Box>

          <ChakraSelect
            options={deviceOptions}
            value={deviceOptions.find(d=>d.id===selectedDevice)}
            onChange={(e)=>setSelectedDevice((e?.value as string)||"")}
            size="sm"
            chakraStyles={{
              valueContainer:(p)=>({...p,fontSize:"10px",width:"140px"}),
              control:(p)=>({...p,height:"24px",minBlockSize:"24px"})
            }}
            ml="auto"
          />

          {/* ⭐ DATE NAVIGATOR */}
          <Box
            opacity={dateNavEnabled?1:0.4}
            pointerEvents={dateNavEnabled?"auto":"none"}
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100","gray.700")}
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
              cursor={isToday?"not-allowed":"pointer"}
              opacity={isToday?0.35:1}
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>

        </Box>
      }
      width="100%"
      height="100%"
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
          chart:{zoomType:"xy"},
          yAxis:{
            title:{text:"Voltage (V)",style:{color:textColor}},
            tickAmount:6,
            labels:{style:{color:textColor}},
            gridLineColor:gridColor
          },
          xAxis:{
            type:"linear",
            title:{text:"Current (A)",style:{color:textColor}},
            labels:{style:{color:subTextColor}}
          }
        }}
      />
    </GraphLayout>
  );
};

export default VoltAmpsCurve;