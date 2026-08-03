import React, { useEffect, useState, useMemo } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";

const PRBarGraph: React.FC = () => {
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
        ids: ["plant_1_plant_device"],
      },
      keys: [
        // {
        //   key: "bcu_1_energy_discharged_today",
        //   alias: "Aux",
        //   keyType: "individual",
        //   color: "#e76ed9ff",
        // },
        {
          key: "inv_daily_energy",
          alias: "Daily Energy (kWh)",
          keyType: "individual",
          color: "#6EE7B7",
        },
        {
          key: "grid_export_today",
          alias: "Grid Export (kWh)",
          keyType: "individual",
          color: "#6DA2FF",
        },
        {
          key: "grid_import_today",
          alias: "Grid Import kWh",
          keyType: "individual",
          color: "#FFA500",
        },
        {
          key: "plant_availability",
          alias: "Plant availability",
          keyType: "individual",
          color: "#FF0000",
        },

      ],
      aggregation: timeWindowCUF.aggregation,
      timeRange: timeWindowCUF.timeRange,
      orderBy: "ASC",
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
  // const seriesForChart = useMemo(() => {
  //   if (!data || typeof data !== "object") return [];

  //   const deviceKeys = Object.keys(data);
  //   if (!deviceKeys.length) return [];

  //   const deviceData = data[deviceKeys[0]];
  //   if (!deviceData) return [];

  //   const series: any[] = [];

  //   fetchingToServerObj.dataSource.keys.forEach((cfg) => {
  //     const points = deviceData[cfg.alias];
  //     if (Array.isArray(points) && points.length > 0) {
  //       const isSpline = cfg.alias === "Plant availability";
  //       series.push({
  //         type: isSpline ? "spline" : "column",
  //         name: cfg.alias,
  //         color: cfg.color,
  //         data: points.map((p: any) => [p.ts, p.value]),
  //         ...(isSpline && { yAxis: 1, marker: { enabled: true } }),
  //       });
  //     }
  //   });

  //   return series;
  // }, [data]);

  /* ---------------- SERIES (UNCHANGED LOGIC) ---------------- */
  const seriesForChart = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    const deviceKeys = Object.keys(data);
    if (!deviceKeys.length) return [];

    const deviceData = data[deviceKeys[0]];
    if (!deviceData) return [];

    const series: any[] = [];

    fetchingToServerObj.dataSource.keys.forEach((cfg) => {
      const rawPoints = deviceData[cfg.alias];

      if (Array.isArray(rawPoints) && rawPoints.length > 0) {
        const points = [...rawPoints].sort(
          (a: any, b: any) => a.ts - b.ts
        );

        const isSpline = cfg.alias === "Plant availability";

        series.push({
          type: isSpline ? "spline" : "column",
          name: cfg.alias,
          color: cfg.color,

          data: points.map((p: any) => p.value),

          ...(isSpline && {
            yAxis: 1,
            marker: { enabled: true },
            zIndex: -1,
          }),
        });
      }
    });

    return series;
  }, [data]);

  const timestamps = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    const deviceKeys = Object.keys(data);
    if (!deviceKeys.length) return [];

    const deviceData = data[deviceKeys[0]];
    if (!deviceData) return [];

    const firstSeries = [...(deviceData["Daily Energy (kWh)"] || [])].sort(
      (a: any, b: any) => a.ts - b.ts
    );

    return firstSeries.map((p: any) => p.ts);
  }, [data]);

  const categories = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    const deviceKeys = Object.keys(data);
    if (!deviceKeys.length) return [];

    const deviceData = data[deviceKeys[0]];
    if (!deviceData) return [];

    const firstSeries = [...(deviceData["Daily Energy (kWh)"] || [])].sort(
      (a: any, b: any) => a.ts - b.ts
    );

    return firstSeries.map((p: any) => {
      const d = new Date(p.ts);

      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    });
  }, [data]);

  return (
    <GraphLayout
      title="Energy Flow"
      width={["1176px"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={(config) => handleTimeWindowCUFChange(config)}
      onReset={CUFHandleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={seriesForChart}
        category={categories}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          timestamps,
          plotOptions: {
            column: {
              dataLabels: { enabled: false },
              borderWidth: 0,
              pointWidth: 12,
              borderRadius: 2,
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
          xAxis: {
            categories,

            labels: {
              style: {
                color: textColor,
                fontSize: "11px",
              },
            },

            lineColor: axisLineColor,

            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,

            // tickInterval: 24 * 60 * 60 * 1000
          },
          yAxis: [
            {
              title: { text: "" },
              min: 0,
              gridLineWidth: 1,
              gridLineDashStyle: "ShortDot",
              gridLineColor: gridColor,
              labels: { style: { color: textColor, fontSize: "11px" } },
            },
            {
              title: { text: "" },
              opposite: true,
              gridLineWidth: 1,
              gridLineDashStyle: "ShortDot",
              gridLineColor: gridColor,
              labels: { style: { color: textColor, fontSize: "11px" } },
            },
          ],
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

export default PRBarGraph;