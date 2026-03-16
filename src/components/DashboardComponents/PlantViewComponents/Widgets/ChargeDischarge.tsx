import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";

import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import type { ExportFunctions } from "../../../../types/graphExport/export";

const DAY = 24 * 60 * 60 * 1000;

const GridStackBarGraph: React.FC = () => {
  /* TIME WINDOW */
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

  /* API CONFIG */
  const gridFetch = {
    dataSource: {
      devices: {
        ids: ["plant_1_pcs_2_bank_bank_20"],
        patterns: [],
      },
      keys: [
        { key: "bcu_2_energy_charged_this_year", alias: "Consumption" },
        { key: "bcu_2_energy_discharged_today", alias: "Feed" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    },
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(gridFetch.dataSource);
  }, [timeWindow]);

  /* STACKED SERIES (2 STACKS ONLY) */
  const stackedSeries = useMemo(() => {
    if (!data) return [];

    const root = data.data ?? data;
    const device = Object.keys(root)[0];
    if (!device) return [];

    const d = root[device];
    const series: any[] = [];

    /* CONSUMPTION */
    if (Array.isArray(d["Consumption"])) {
      series.push({
        type: "column",
        name: "Consumption (kWh)",
        color: "#EF4444",
        stack: "grid",
        pointRange: DAY,
        data: d["Consumption"].map((p: any) => [
          p.ts,
          Number(p.value),
        ]),
      });
    }

    /* FEED */
    if (Array.isArray(d["Feed"])) {
      series.push({
        type: "column",
        name: "Feed (kWh)",
        color: "#22C55E",
        stack: "grid",
        pointRange: DAY,
        data: d["Feed"].map((p: any) => [
          p.ts,
          Number(p.value),
        ]),
      });
    }

    return series;
  }, [data]);

  /* COLORS */
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  /* RENDER */
  return (
    <GraphLayout
      title="Grid"
      width={["578px"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={stackedSeries}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            column: {
              stacking: "normal",
              borderWidth: 0,
              pointWidth: 22,
              borderRadius: 6,
              groupPadding: 0,
              pointPadding: 0,
            },
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          yAxis: {
            min: 0,
            title: { text: "" },
            labels: { style: { color: textColor } },
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
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

export default GridStackBarGraph;
