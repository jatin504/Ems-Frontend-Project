import React, { useEffect, useMemo, useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraphNew from "../../../Graphs/RevampCharts/ColumnGraphNew";
import WidgetTitle from "../../../Common/WidgetTitle";
import { useColorModeValue } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import type { TimeseriesDataSource } from "../../../../types/timeseries/datasource";


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

  // Fetch CUF AC, CUF DC, PR
  const cufFetch: { dataSource: TimeseriesDataSource } = {
    dataSource: {
      devices: { patterns: [], ids: ["plant_1_pcs_2_bank_bank_1"] },
      keys: [
  {
    key: "energy_charged_today",
    alias: "CUF AC",
    keyType: "number",
  },
  {
    key: "energy_discharged_today",
    alias: "CUF DC",
    keyType: "number",
  },
  {
    key: "soc",
    alias: "PR",
    keyType: "number",
  },
],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: "ASC" as const,
    },
  };

  const { data: cufData, fetchData: fetchCuf } = useTimeseriesData();

  useEffect(() => {
    fetchCuf(cufFetch.dataSource);
  }, [timeWindow]);

  // Prepare series for stacked bar (CUF AC/DC) and PR column
  const mixedSeries = useMemo(() => {
    if (!cufData) return [];
    const root = cufData.data ?? cufData;
    // Assume one device for simplicity
    const dev = Object.keys(root)[0];
    if (!dev) return [];
    const d = root[dev] as unknown as Record<string, Array<{ ts: number; value: number }>>;
    const getSeries = (key: string) => (d[key] ?? []) as Array<{ ts: number; value: number }>;
    // X axis: timestamps
    const tsArr = getSeries("CUF AC").map((p) => p.ts);
    // Series data
    const cufAc = getSeries("CUF AC").map((p) => p.value);
    const cufDc = getSeries("CUF DC").map((p) => p.value);
    const pr = getSeries("PR").map((p) => p.value);
    return [
      {
        type: "column",
        name: "CUF AC",
        data: tsArr.map((ts: any, i: number) => [ts, cufAc[i]]),
        stack: "CUF",
        color: "#3B82F6",
        zIndex: 2,
      },
      {
        type: "column",
        name: "CUF DC",
        data: tsArr.map((ts: any, i: number) => [ts, cufDc[i]]),
        stack: "CUF",
        color: "#F59E0B",
        zIndex: 2,
      },
      {
        type: "column",
        name: "PR",
        data: tsArr.map((ts: any, i: number) => [ts, pr[i]]),
        color: "#10B981",
        zIndex: 1,
      },
    ];
  }, [cufData]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={<WidgetTitle color={textColor}>CUF & PR</WidgetTitle>}
      width={["578px"]}
      height={"344px"}
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraphNew
        apiData={mixedSeries}
        height={250}
        onExportReady={setExportFunctions}
        axisLabelColor={textColor}
        gridColor={gridColor}
        lineColor={gridColor}
        tooltipBg={useColorModeValue("#fff", "rgba(24,24,27,0.95)")}
        tooltipColor={textColor}
        legendColor={textColor}
        stacked
        barWidth={18}
        barGap="8%"
        barCategoryGap="30%"
        borderRadius={0}
      />
    </GraphLayout>
  );
};

export default SoCGraph;
