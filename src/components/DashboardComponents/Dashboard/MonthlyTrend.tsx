import React, { useMemo, useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const day = 24 * 60 * 60 * 1000;
const start = Date.UTC(2026, 6, 1, 0, 0, 0);

const MonthlyTrend = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");

  const gridColor = useColorModeValue(
    "rgba(0,0,0,.10)",
    "rgba(255,255,255,.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,.16)",
    "rgba(255,255,255,.06)"
  );

  const series = useMemo(
    () => [
      {
        type: "spline",
        name: "Actual Cost",
        color: "#2563EB",
        marker: {
          enabled: false,
        },
        data: [
          [start + 0 * day, 1.20],
          [start + 4 * day, 1.60],
          [start + 9 * day, 1.40],
          [start + 14 * day, 1.80],
          [start + 19 * day, 1.50],
          [start + 24 * day, 1.70],
          [start + 30 * day, 1.60],
        ],
      },

      {
        type: "spline",
        name: "With DSM",
        color: "#22C55E",
        marker: {
          enabled: false,
        },
        data: [
          [start + 0 * day, 0.90],
          [start + 4 * day, 1.20],
          [start + 9 * day, 1.10],
          [start + 14 * day, 1.40],
          [start + 19 * day, 1.20],
          [start + 24 * day, 1.30],
          [start + 30 * day, 1.20],
        ],
      },
    ],
    []
  );

  const options = useMemo(
    () => ({
      chart: {
        spacing: [0, 0, 0, 0],
        marginTop: 0,
      },

      xAxis: {
        type: "datetime",

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
      },

      yAxis: {
        title: {
          text: "",
        },

        min: 0,

        labels: {
          style: {
            color: textColor,
            fontSize: "11px",
          },
        },

        gridLineWidth: 1,
        gridLineDashStyle: "ShortDot",
        gridLineColor: gridColor,
      },

      tooltip: {
        shared: true,
        backgroundColor: useColorModeValue(
          "#fff",
          "rgba(24,24,27,.95)"
        ),
        style: {
          color: textColor,
        },
        valueDecimals: 2,
      },

      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        y: -12,
        margin: 0,

        itemStyle: {
          color: textColor,
          fontSize: "11px",
        },
      },
    }),
    [textColor]
  );
    return (
    <GraphLayout
      title="Monthly Trend"
      titleFontSize="16px"
      width={["100%"]}
      height="220px"
      fullScreen
      onExport={exportFunctions}
    >
      <Box mt="-22px">
        <SplineGraph
          apiData={series}
          height={194}
          props={options}
          onExportReady={setExportFunctions}
          showLegendButtons={false}
        />
      </Box>
    </GraphLayout>
  );
};

export default MonthlyTrend;