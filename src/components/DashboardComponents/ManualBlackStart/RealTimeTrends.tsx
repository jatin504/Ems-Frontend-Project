import React, { useState } from "react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import WidgetTitle from "../../Common/WidgetTitle";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../types/graphExport/export";

const RealTimeTrends = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const series = [
    {
      type: "spline",
      name: "Frequency (Hz)",
      color: "#22C55E",
      data: [
        [Date.now() - 240000, 48.7],
        [Date.now() - 180000, 49.2],
        [Date.now() - 120000, 48.8],
        [Date.now() - 60000, 48.9],
        [Date.now(), 48.8],
      ],
    },
    {
      type: "spline",
      name: "Voltage (kV)",
      color: "#2563EB",
      data: [
        [Date.now() - 240000, 50],
        [Date.now() - 180000, 49.9],
        [Date.now() - 120000, 50],
        [Date.now() - 60000, 49.8],
        [Date.now(), 50.2],
      ],
    },
    {
      type: "spline",
      name: "Active Power (kW)",
      color: "#F97316",
      data: [
        [Date.now() - 240000, -50],
        [Date.now() - 180000, -50],
        [Date.now() - 120000, -30],
        [Date.now() - 60000, 20],
        [Date.now(), 60],
      ],
    },
  ];

  return (
    <GraphLayout
      title={<WidgetTitle>Real-time Trends</WidgetTitle>}
      width={["560px"]}
      height="330px"
      fullScreen
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={series}
        height={245}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            series: {
              lineWidth: 2,
              marker: {
                enabled: false,
              },
            },
          },

          xAxis: {
            type: "datetime",
          },

          yAxis: {
            title: {
              text: null,
            },
          },

          tooltip: {
            shared: true,
            valueDecimals: 2,
          },

          legend: {
            align: "center",
            verticalAlign: "top",
            layout: "horizontal",
          },
        }}
      />
    </GraphLayout>
  );
};

export default RealTimeTrends;