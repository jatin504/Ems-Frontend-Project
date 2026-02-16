// src/components/BarComparisonChart.tsx

import { useRef } from "react";
import { Box } from "@chakra-ui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import GraphLayout from "./GraphLayout";

const BarComparisonChart = () => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const chartOptions: Highcharts.Options = {
  chart: {
    type: "column",
    backgroundColor: "transparent",
    height: 300,
  },
  title: { text: undefined },
  xAxis: {
    categories: ["24 Jun", "25 Jun", "26 Jun", "27 Jun", "28 Jun", "29 Jun", "30 Jun"],
    crosshair: true,
    labels: { style: { color: "#ccc" } },
  },
  yAxis: {
    min: 0,
    title: { text: null },
    labels: { style: { color: "#ccc" } },
    gridLineColor: "#444",
  },
  tooltip: {
    shared: true,
    useHTML: true,
    formatter: function () {
      const points = this.points || [];
      const date = this.category as string;

      let tooltipHtml = `<b>${date}</b><br/>`;

      for (const point of points) {
        const seriesName = point.series.name;
        const color = point.color;
        const value = point.y;

        tooltipHtml += `<span style="color:${color}">●</span> ${seriesName}: <b>${value} kWh</b><br/>`;

        // Check if this point has a `meta` field for breakdown
        const meta = point.point.options.meta;
        if (meta && Array.isArray(meta)) {
          meta.forEach((entry: string) => {
            tooltipHtml += `<span style="margin-left: 15px; font-size: 11px;">${entry}</span><br/>`;
          });
        }
      }

      return tooltipHtml;
    },
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
    spline: {
      marker: { enabled: true },
    },
  },
  legend: {
    align: "center",
    verticalAlign: "bottom",
    itemStyle: { color: "#ccc" },
  },
  series: [
    {
      name: "Charge kWh",
      type: "column",
      data: [5000, 6000, 5500, 5200, 5800, 6500, 7000],
      color: "#4A90E2",
    },
    {
      name: "Discharge kWh",
      type: "column",
      data: [4500, 5500, 5000, 4800, 5400, 6000, 6200],
      color: "#F5A623",
    },
    {
      name: "Charge Track",
      type: "areaspline",
      color: "#7ED321",
      opacity : 0.5,
      data: [
        { y: 2000, meta: ["11:00–12:00: 800", "15:00–18:00: 1200"] },
        { y: 2200, meta: ["10:00–11:00: 600", "14:00–16:00: 1600"] },
        { y: 1900, meta: ["12:00–13:00: 500", "16:00–18:00: 1400"] },
        { y: 2100, meta: ["11:30–12:30: 1000", "17:00–18:00: 1100"] },
        { y: 2300, meta: ["10:00–11:00: 1300", "15:00–16:00: 1000"] },
        { y: 2500, meta: ["09:00–10:00: 1500", "13:00–15:00: 1000"] },
        { y: 2400, meta: ["11:00–12:00: 2000", "15:00–18:00: 400"] },
      ],
    },
    {
      name: "Discharge Track",
      type: "areaspline",
      color: "#FFECCC",
      opacity : 0.5,
      data: [
        { y: 2000, meta: ["10:00–11:00: 500", "18:00–20:00: 1500"] },
        { y: 2200, meta: ["11:00–12:00: 1000", "14:00–16:00: 1200"] },
        { y: 1100, meta: ["10:00–12:00: 700", "13:00–15:00: 400"] },
        { y: 3000, meta: ["10:00–11:00: 1500", "17:00–19:00: 1500"] },
        { y: 6700, meta: ["12:00–13:00: 3700", "14:00–15:00: 3000"] },
        { y: 4900, meta: ["11:00–12:00: 2500", "16:00–18:00: 2400"] },
        { y: 9000, meta: ["09:00–10:00: 4000", "17:00–19:00: 5000"] },
      ],
    },
  ],
  credits: { enabled: false },
  exporting: { enabled: false },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
};


  const handleDownloadPNG = () => {
    chartRef.current?.chart.exportChart({ type: "image/png" });
  };

  const handleDownloadCSV = () => {
    chartRef.current?.chart.downloadCSV();
  };

  return (
    <GraphLayout
      id="BarComparison"
      title="Charge/Discharge"
      height="380px"
      onDownloadPNG={handleDownloadPNG}
      onDownloadCSV={handleDownloadCSV}
    >
      <Box
        mt={4}
        w="100%"
        // overflowX="auto"
          height="100%"
      >
        <Box
          minW={["320px", "100%"]}
          height="100%"
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartRef}
            containerProps={{ style: { width: "100%", height: "100%" } }}
          />
        </Box>
      </Box>
    </GraphLayout>
  );
};

export default BarComparisonChart;
