import React, { useEffect, useMemo, useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";
import { useColorModeValue } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import { buildCategoryChartData } from "../../../../Services/APIDataFormatter/buildCategoryChartData";

const PRGraph: React.FC = () => {
  // Time window and export logic
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

  // Fetch PR
  const prFetch = {
    dataSource: {
      devices: { patterns: [], ids: ["plant_1_plant_device"] },
      keys: [
        { key: "total_inv_pr", alias: "PR %", keyType: "individual", type: "column" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    },
  };

  const { data: prData, fetchData: fetchPr } = useTimeseriesData();

  useEffect(() => {
    fetchPr(prFetch.dataSource);
  }, [timeWindow]);

  // Prepare series for PR column
  // const prSeries = useMemo(() => {
  //   if (!prData) return [];
  //   const root = prData.data ?? prData;
  //   const dev = Object.keys(root)[0];
  //   if (!dev) return [];
  //   const d = root[dev] as unknown as Record<string, { ts: number; value: number }[]>;
  //   const tsArr = (d["PR"] || []).map((p: any) => p.ts);
  //   const pr = (d["PR"] || []).map((p: any) => p.value);
  //   return [
  //     {
  //       type: "column",
  //       name: "PR",
  //       data: tsArr.map((ts: any, i: number) => [ts, pr[i]]),
  //       color: "#10B981",
  //     },
  //   ];
  // }, [prData]);

  const chartData = useMemo(() => {
      if (!prData) return { categories: [], series: [] };
      const root = prData.data ?? prData;
      const dev = Object.keys(root)[0];
      if (!dev) return { categories: [], series: [] };
      return buildCategoryChartData(root[dev], [
        {
          alias: "PR %",
          color: "#10B981",
          type: "column"
        }
      ]);
    }, [prData]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title="Performance Ratio"
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
        height={260}
        onExportReady={setExportFunctions}
        props={{
          timestamps: chartData.timestamps,
          xAxis: {
            categories: chartData.categories,
            // type: "datetime",
            labels: { style: { color: subTextColor } },
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
          },
          plotOptions: {
            column: {
              pointWidth: 18,
              borderRadius: 6,
            },
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

export default PRGraph;