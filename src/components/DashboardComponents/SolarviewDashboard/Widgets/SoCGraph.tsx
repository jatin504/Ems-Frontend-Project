import React, { useEffect, useMemo, useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";
import Highcharts from "highcharts";
import { useColorModeValue } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import { buildCategoryChartData } from "../../../../Services/APIDataFormatter/buildCategoryChartData";


  // return [
  //   S(soc1, "#F59E0B", "SoC-1 %"), // orange
  //   S(soc2, "#3B82F6", "SoC-2 %"), // blue
  // ];


const SoCGraph: React.FC = () => {
  // Time window and export logic (CUFBarGraph style)
  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "last",
    [1, "day"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 7,
        intervalType: "day",
      },
    }
  );

  // Fetch CUF AC, CUF DC
  const cufFetch = {
    dataSource: {
      devices: { patterns: [], ids: ["plant_1_plant_device"] },
      keys: [
        { key: "cuf_ac", alias: "CUF AC %", keyType: "number" },
        { key: "cuf_dc", alias: "CUF DC %", keyType: "number" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: "ASC",
    },
  };

  const { data: cufData, fetchData: fetchCuf } = useTimeseriesData();

  useEffect(() => {
    fetchCuf(cufFetch.dataSource);
  }, [timeWindow]);

  // Prepare series for stacked bar (CUF AC/DC)
  const chartData = useMemo(() => {
    if (!cufData) return { categories: [], series: [] };
    const root = cufData.data ?? cufData;
    const dev = Object.keys(root)[0];
    if (!dev) return { categories: [], series: [] };
    return buildCategoryChartData(root[dev], [
      {
        alias: "CUF AC %",
        color: "#3B82F6",
      },
      {
        alias: "CUF DC %",
        color: "#F59E0B",
      },
    ]);
  }, [cufData]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title="Asset Utilization"
      width={["578px"]}
      height={"344px"}
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={chartData.series}
        category={chartData.categories}
        height={260}
        onExportReady={setExportFunctions}
        props={{
          timestamps: chartData.timestamps,
          plotOptions: {
            column: {
              dataLabels: { enabled: false },
              borderWidth: 0,
              pointWidth: 7,
              borderRadius: 0,
              
            },
          },
          xAxis: {
            categories: chartData.categories,

            labels: {
              style: {
                color: subTextColor,
              },
            },

            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
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
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default SoCGraph;