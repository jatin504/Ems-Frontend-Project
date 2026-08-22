import React, { useMemo } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../Graphs/RevampCharts/ColumnGraph";

const MarketChart = () => {
  const dummySeries = useMemo(() => [
    {
      type: "column",
      name: "Market Price (₹/MWh)",
      color: "#22C55E",
      stack: "trading",
      data: [
        ["00:00", 4200],
        ["02:00", 4000],
        ["04:00", 3800],
        ["06:00", 4100],
        ["08:00", 4500],
        ["10:00", 4800],
        ["12:00", 5200],
        ["14:00", 5000],
        ["16:00", 4800],
        ["18:00", 4600],
        ["20:00", 4100],
        ["24:00", 4300],
      ],
    },
    {
      type: "column",
      name: "BESS Bid Price (₹/MWh)",
      color: "#3B82F6",
      stack: "trading",
      data: [
        ["00:00", 4000],
        ["02:00", 3950],
        ["04:00", 3900],
        ["06:00", 4200],
        ["08:00", 4400],
        ["10:00", 4700],
        ["12:00", 5100],
        ["14:00", 4950],
        ["16:00", 4700],
        ["18:00", 4500],
        ["20:00", 4200],
        ["24:00", 4100],
      ],
    },
    {
      type: "spline",
      name: "Solar Generation (MW)",
      color: "#FACC15",
      lineWidth: 3,
      marker: { radius: 4, fillColor: "#FACC15" },
      yAxis: 1,
      data: [
        ["00:00", 0],
        ["02:00", 0],
        ["04:00", 0],
        ["06:00", 5],
        ["08:00", 15],
        ["10:00", 25],
        ["12:00", 35],
        ["14:00", 32],
        ["16:00", 28],
        ["18:00", 18],
        ["20:00", 8],
        ["24:00", 0],
      ],
    },
    {
      type: "spline",
      name: "Load Forecast (MW)",
      color: "#EF4444",
      lineWidth: 3,
      marker: { radius: 4, fillColor: "#EF4444" },
      yAxis: 1,
      data: [
        ["00:00", 25],
        ["02:00", 22],
        ["04:00", 20],
        ["06:00", 30],
        ["08:00", 45],
        ["10:00", 52],
        ["12:00", 55],
        ["14:00", 53],
        ["16:00", 50],
        ["18:00", 45],
        ["20:00", 40],
        ["24:00", 30],
      ],
    },
    {
      type: "scatter",
      name: "AGC Signals",
      color: "#fb923c",
      data: [
        { name: "AGC Signals", x: 5, y: 5200 },
        { name: "AGC Signals", x: 7, y: 5000 },
      ],
      marker: {
        symbol: "circle",
        radius: 6,
        fillColor: "#fb923c",
      },
      dataLabels: {
        enabled: true,
        format: "AGC Signals",
        style: {
          color: "#fff",
          fontSize: "10px",
          fontWeight: "500",
          textOutline: "none",
        },
        backgroundColor: "#fb923c",
        borderRadius: 4,
        padding: 4,
        y: -20,
      },
    },
    {
      type: "scatter",
      name: "DSM Alerts",
      color: "#ef4444",
      data: [
        { name: "DSM Alerts", x: 9, y: 4800 },
      ],
      marker: {
        symbol: "circle",
        radius: 6,
        fillColor: "#ef4444",
      },
      dataLabels: {
        enabled: true,
        format: "DSM Alerts",
        style: {
          color: "#fff",
          fontSize: "10px",
          fontWeight: "500",
          textOutline: "none",
        },
        backgroundColor: "#ef4444",
        borderRadius: 4,
        padding: 4,
        y: -20,
      },
    },
  ], []);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  return (
    <GraphLayout width={["1200px"]} height="300px" fullScreen>
      <ColumnGraph
        apiData={dummySeries}
        height={240}
        props={{
          plotOptions: {
            column: {
              stacking: "normal",
              borderWidth: 0,
              pointWidth: 20,
              borderRadius: 6,
              groupPadding: 0.02,
              pointPadding: 0.005,
            },
          },
          xAxis: {
            type: "category",
            labels: { style: { color: subTextColor } },
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          yAxis: [
            {
              min: 0,
              title: { text: "Price (₹/MWh)" },
              labels: { style: { color: textColor } },
              gridLineWidth: 1,
              gridLineDashStyle: "ShortDot",
              gridLineColor: gridColor,
            },
            {
              min: 0,
              title: { text: "Generation/Load (MW)" },
              labels: { style: { color: textColor } },
              opposite: true,
              gridLineWidth: 0,
            },
          ],
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

export default MarketChart;