import React, { useEffect, useMemo, useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";
import { useColorModeValue } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";


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
      devices: { patterns: ["_bank_bank_"], ids: [] },
      keys: [
        { key: "soc", alias: "CUF AC", keyType: "number" },
        { key: "power_factor", alias: "CUF DC", keyType: "number" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    },
  };

  const { data: cufData, fetchData: fetchCuf } = useTimeseriesData();

  useEffect(() => {
    fetchCuf(cufFetch.dataSource);
  }, [timeWindow]);

  // Prepare series for stacked bar (CUF AC/DC)
  const cufSeries = useMemo(() => {
    if (!cufData) return [];
    const root = cufData.data ?? cufData;
    const dev = Object.keys(root)[0];
    if (!dev) return [];
    const d = root[dev] as unknown as Record<string, { ts: number; value: number }[]>;
    const tsArr = (d["CUF AC"] || []).map((p: any) => p.ts);
    const cufAc = (d["CUF AC"] || []).map((p: any) => p.value);
    const cufDc = (d["CUF DC"] || []).map((p: any) => p.value);
    return [
      {
        type: "column",
        name: "CUF AC",
        data: tsArr.map((ts: any, i: number) => [ts, cufAc[i]]),
        color: "#3B82F6",
      },
      {
        type: "column",
        name: "CUF DC",
        data: tsArr.map((ts: any, i: number) => [ts, cufDc[i]]),
        color: "#F59E0B",
      },
    ];
  }, [cufData]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title="CUF"
      width={["578px"]}
      height={"344px"}
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={cufSeries}
        height={260}
        onExportReady={setExportFunctions}
        props={{
          xAxis: {
            type: "datetime",
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
              pointPadding: 0,
              grouping: true,
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

export default SoCGraph;
