import { useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const month = 30 * 24 * 60 * 60 * 1000;

const start = Date.UTC(2025, 0, 1);

const SOHTrendPrediction = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const series = useMemo(
    () => [
      {
        type: "spline",
        name: "SOH",
        color: "#84CC16",
        lineWidth: 3,
        marker: {
          enabled: false,
        },
        data: [
          [start + month * 0, 99],
          [start + month * 1, 98],
          [start + month * 2, 97],
          [start + month * 3, 96],
          [start + month * 4, 95],
          [start + month * 5, 94],
          [start + month * 6, 93],
          [start + month * 7, 92],
          [start + month * 8, 91],
          [start + month * 9, 90],
          [start + month * 10, 89],
          [start + month * 11, 88],
          [start + month * 12, 87],
        ],
      },

      {
        type: "spline",
        name: "Prediction",
        color: "#3B82F6",
        dashStyle: "Dash",
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        data: [
          [start + month * 12, 87],
          [start + month * 13, 86],
          [start + month * 14, 84],
          [start + month * 15, 82],
          [start + month * 16, 80],
          [start + month * 17, 78],
          [start + month * 18, 76],
          [start + month * 19, 74],
        ],
      },

      {
        type: "spline",
        name: "Upper Bound",
        color: "#06B6D4",
        dashStyle: "Dash",
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        data: [
          [start + month * 12, 87],
          [start + month * 13, 87],
          [start + month * 14, 86],
          [start + month * 15, 84],
          [start + month * 16, 82],
          [start + month * 17, 80],
          [start + month * 18, 78],
          [start + month * 19, 76],
        ],
      },
            {
        type: "spline",
        name: "Lower Bound",
        color: "#EC4899",
        dashStyle: "Dash",
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        data: [
          [start + month * 12, 87],
          [start + month * 13, 85],
          [start + month * 14, 82],
          [start + month * 15, 79],
          [start + month * 16, 76],
          [start + month * 17, 73],
          [start + month * 18, 70],
          [start + month * 19, 67],
        ],
      },

      {
        type: "scatter",
        name: "Current SOH",
        color: "#84CC16",
        marker: {
          enabled: true,
          radius: 6,
          symbol: "circle",
          fillColor: "#84CC16",
          lineColor: "#ffffff",
          lineWidth: 2,
        },
        data: [[start + month * 12, 87]],
      },
    ],
    []
  );

  const options = useMemo(
    () => ({
      chart: {
        spacingTop: 10,
        spacingBottom: 20,
        spacingLeft: 10,
        spacingRight: 10,
      },

      credits: {
        enabled: false,
      },

      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "top",
      },

      tooltip: {
        shared: true,
        valueSuffix: " %",
      },

      xAxis: {
        type: "datetime",

        tickInterval: month * 2,

        plotLines: [
          {
            value: start + month * 12,
            color: "#64748B",
            width: 1,
            dashStyle: "Dash",
            zIndex: 5,
          },
        ],
      },

      yAxis: {
        min: 60,
        max: 100,

        tickInterval: 10,

        title: {
          text: null,
        },

        gridLineColor: "rgba(255,255,255,.08)",

        plotLines: [
          {
            value: 70,
            color: "#EF4444",
            width: 2,
            dashStyle: "Dash",
          },
        ],
      },
            annotations: [
        {
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: start + month * 12,
                y: 87,
              },
              text: "<b>Current SOH<br/>87%</b>",
              backgroundColor: "#84CC16",
              borderRadius: 6,
              style: {
                color: "#fff",
                fontSize: "11px",
              },
            },
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: start + month * 18,
                y: 70,
              },
              text: "<b>EOL (70%)</b>",
              backgroundColor: "#EF4444",
              borderRadius: 6,
              style: {
                color: "#fff",
                fontSize: "11px",
              },
            },
          ],
        },
      ],
    }),
    []
  );

  return (
    <GraphLayout
      title="SOH Trend & Prediction"
      width={["100%"]}
      height="280px"
      fullScreen
      onExport={exportFunctions}
    >
      <Box h="100%">
        <SplineGraph
          apiData={series}
          props={options}
          height={220}
          onExportReady={setExportFunctions}
          showLegendButtons={false}
        />
      </Box>
    </GraphLayout>
  );
};

export default SOHTrendPrediction;