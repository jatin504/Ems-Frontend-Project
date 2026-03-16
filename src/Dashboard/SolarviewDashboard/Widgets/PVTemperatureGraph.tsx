import React, { useEffect, useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import {
  useColorModeValue,
} from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import { transformToHighchartsTimeSeries } from "../../../../Services/APIDataFormatter/TimeseriesGraphs";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const PVTemperatureGraph: React.FC = () => {
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

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: ["_bank_bank_"],
        ids: [],
      },
      keys: [
        {
          key: "soc",
          alias: "Temperature 3 (°C)",
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
  }, [timeWindowTemp]);

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
      title="PV"
      width={["605px"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowTempChange}
      onReset={TempHandleReset}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={
          data
            ? transformToHighchartsTimeSeries(
                data,
                fetchingToServerObj.dataSource.keys
              )
            : [{}]
        }
        height="280px"
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
    </GraphLayout>
  );
};

export default PVTemperatureGraph;