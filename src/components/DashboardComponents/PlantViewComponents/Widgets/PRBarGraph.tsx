import React, { useEffect, useState, useMemo } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";

const SolarGraph: React.FC = () => {
  const {
    config: timeWindowCUF,
    handleTimeWindowChange: handleTimeWindowCUFChange,
    handleReset: CUFHandleReset,
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

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: [],
        ids: ["plant_1_pcs_2_bank_bank_11"],
      },
      keys: [
        {
          key: "bcu_1_energy_discharged_today",
          alias: "Aux",
          keyType: "individual",
          color: "#6DA2FF",
        },
        {
          key: "bcu_1_energy_charged_today",
          alias: "Daily Energy (kWh)",
          keyType: "individual",
          color: "#6EE7B7",
        },
        {
          key: "bcu_2_energy_charged_this_year",
          alias: "Gen. Loss (kWh)",
          keyType: "individual",
          color: "#e76ed9ff",
        },
      ],
      aggregation: timeWindowCUF.aggregation,
      timeRange: timeWindowCUF.timeRange,
      orderBy: timeWindowCUF.orderBy,
    },
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource);
  }, [timeWindowCUF]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
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

  /* ---------------- SERIES (UNCHANGED LOGIC) ---------------- */
  const seriesForChart = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    const deviceKeys = Object.keys(data);
    if (!deviceKeys.length) return [];

    const deviceData = data[deviceKeys[0]];
    if (!deviceData) return [];

    const series: any[] = [];

    fetchingToServerObj.dataSource.keys.forEach((cfg) => {
      const points = deviceData[cfg.alias];
      if (Array.isArray(points) && points.length > 0) {
        series.push({
          type: "column",
          name: cfg.alias,
          color: cfg.color,
          data: points.map((p: any) => [p.ts, p.value]),
        });
      }
    });

    return series;
  }, [data]);

  return (
    <GraphLayout
      title="Solar"
      width={["578px"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={(config) => handleTimeWindowCUFChange(config)}
      onReset={CUFHandleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            column: {
              dataLabels: { enabled: false },
              borderWidth: 0,
              pointWidth: 7,
              borderRadius: 0,
              groupPadding: 0,
              pointPadding: 3,
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
          xAxis: {
            type: "datetime",
            labels: { style: { color: textColor, fontSize: "11px" } },
            lineColor: axisLineColor,
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          yAxis: {
            title: { text: "" },
            min: 0,
            max: 1000,
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
            labels: { style: { color: textColor, fontSize: "11px" } },
          },
          legend: {
            enabled: true,
            align: "center",
            verticalAlign: "bottom",
            useHTML: true,
            itemStyle: {
              overflow: "auto",
              color: textColor,
              fontSize: "12px",
            },
            labelFormatter: function (this: any) {
              return (
                '<span style="width:10px;height:10px;display:inline-block;background-color:' +
                this.color +
                ';border-radius:0;"></span> ' +
                this.name
              );
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default SolarGraph;
