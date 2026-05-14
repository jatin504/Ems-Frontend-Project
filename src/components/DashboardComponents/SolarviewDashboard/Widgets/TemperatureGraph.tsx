import React, { useEffect, useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import {
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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

  const isPCS = tabIndex === 0;

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: isPCS ? ["_bank_bank_"] : ["_bank_bank_"],
        ids: [],
      },
      keys: [
        {
          key: isPCS
            ? "battery_cabin_temperature_3"
            : "active_power",
          alias: isPCS
            ? "Temperature 3 (°C)"
            : "Active Power",
          keyType: "common",
          type: "spline",
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
      title="Source"
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
          {/* ================= PCS TAB ================= */}
          <TabPanel height="100%" p={0}>
            <SpineGraph
              apiData={
                data
                  ? transformToHighchartsTimeSeries(
                      data,
                      fetchingToServerObj.dataSource.keys
                    )
                  : [{}]
              }
              height="45%"       
              onExportReady={setExportFunctions}
              props={{
                yAxis: {
                  tickAmount: 6,
                  title: { text: null },
                  labels: { style: { color: textColor } },
                  gridLineColor: gridColor,
                },
                xAxis: {
                  type: "datetime",
                  crosshair: {
                    color: "rgba(255,255,255,0.15)",
                    width: 1,
                  },
                  labels: { style: { color: subTextColor } },
                  lineColor: axisLineColor,
                  gridLineColor: gridColor,
                  gridLineDashStyle: "ShortDot",
                  gridLineWidth: 1,
                },
                tooltip: {
                  shared: true,
                  backgroundColor: useColorModeValue(
                    "#fff",
                    "rgba(24,24,27,0.95)"
                  ),
                  style: { color: textColor },
                },
                legend: {
                  align: "center",
                  verticalAlign: "bottom",
                  layout: "horizontal",
                  itemStyle: { color: textColor },
                },
              }}
            />
          </TabPanel>

          {/* ================= PV TAB ================= */}
          <TabPanel height="100%" p={0}>
            <SpineGraph
              apiData={
                data
                  ? transformToHighchartsTimeSeries(
                      data,
                      fetchingToServerObj.dataSource.keys
                    )
                  : [{}]
              }
              height="45%"       // Match PCS tab
              onExportReady={setExportFunctions}
              props={{
                yAxis: {
                  tickAmount: 6,
                  title: { text: null },
                  labels: { style: { color: textColor } },
                  gridLineColor: gridColor,
                },
                xAxis: {
                  type: "datetime",
                  crosshair: {
                    color: "rgba(255,255,255,0.15)",
                    width: 1,
                  },
                  labels: { style: { color: subTextColor } },
                  lineColor: axisLineColor,
                  gridLineColor: gridColor,
                  gridLineDashStyle: "ShortDot",
                  gridLineWidth: 1,
                },
                tooltip: {
                  shared: true,
                  backgroundColor: useColorModeValue(
                    "#fff",
                    "rgba(24,24,27,0.95)"
                  ),
                  style: { color: textColor },
                },
                legend: {
                  align: "center",
                  verticalAlign: "bottom",
                  layout: "horizontal",
                  itemStyle: { color: textColor },
                },
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </GraphLayout>
  );
};

export default TemperatureGraph;
