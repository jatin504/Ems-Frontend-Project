import React, { useEffect, useState, useMemo } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import {
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box
} from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import { transformToHighchartsTimeSeries } from "../../../../Services/APIDataFormatter/TimeseriesGraphs";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const TemperatureGraph: React.FC = () => {

  const [tabIndex, setTabIndex] = useState(0);

  const {
    config: timeWindowTemp,
    handleTimeWindowChange: handleTimeWindowTempChange,
    handleReset: TempHandleReset,
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

  /*  DATE NAV STATE */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFs = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

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
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    handleTimeWindowTempChange({
      aggregation: timeWindowTemp.aggregation,
      orderBy: timeWindowTemp.orderBy,
      timeRange:{
        type:"absolute",
        startTs:start.getTime(),
        endTs:end.getTime()
      }
    });
  };

  const goPrevDay = () => {
    setCurrentDate(prev=>{
      const d = new Date(prev);
      d.setDate(d.getDate()-1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;

    setCurrentDate(prev=>{
      const d = new Date(prev);
      d.setDate(d.getDate()+1);

      const today = new Date();

      const reachedToday =
        d.getFullYear()===today.getFullYear() &&
        d.getMonth()===today.getMonth() &&
        d.getDate()===today.getDate();

      if(reachedToday){
        TempHandleReset();
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  const isPCS = tabIndex === 0;

  const fetchingToServerObj = {
  dataSource: {
    devices: isPCS
      ? {
          patterns: ["_bank_bank_"],
          ids: [],
        }
      : {
          ids: [],
          patterns: ["_inverter_inverter_"],
        },

    keys: [
      {
        key: isPCS
          ? "active_power"
          : "active_power",

        alias: isPCS
          ? "active_power"
          : "active_power",

        keyType: "timeseries",
        chartType: "line",
        color: "#10B981",
      },
    ],

    aggregation: timeWindowTemp.aggregation,
    timeRange: timeWindowTemp.timeRange,
    orderBy: timeWindowTemp.orderBy,
  },
};

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource);
  }, [timeWindowTemp, tabIndex]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)","rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)","rgba(255,255,255,0.06)");

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const seriesForChart = useMemo(() => {
  if (!data) return [];

  const palette = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F43F5E",
    "#6366F1",
    "#14B8A6",
  ];

  return transformToHighchartsTimeSeries(
    data,
    fetchingToServerObj.dataSource.keys
  ).map((series: any, index: number) => ({
    ...series,
    type: "line",              // <-- add this
    name: `${series.name}-${index}`, // <-- unique name
    color: palette[index % palette.length],
  }));
}, [data]);

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          <Box fontWeight="600">Source</Box>

          <Box
            ml={isFullScreen ? "900px" : "128px"}
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
      width={["578px"]}
      height="334px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowTempChange}
      onReset={TempHandleReset}
      onExport={exportFunctions}
    >
      <Tabs
        index={tabIndex}
        onChange={setTabIndex}
        mt="-10px"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <TabList>
          <Tab>PCS</Tab>
          <Tab>PV</Tab>
        </TabList>

        <TabPanels flex="1" overflow="hidden">
          <TabPanel height="100%" p={0}>
            <SpineGraph
              apiData={seriesForChart}
              height="260"
              onExportReady={setExportFunctions}
            />
          </TabPanel>

          <TabPanel height="100%" p={0}>
            <SpineGraph
              apiData={seriesForChart}
              height="260px"
              onExportReady={setExportFunctions}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </GraphLayout>
  );
};

export default TemperatureGraph;