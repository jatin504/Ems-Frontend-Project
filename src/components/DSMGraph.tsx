import { Box } from "@chakra-ui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import GraphLayout from "./GraphLayout"; 

const options: Highcharts.Options = {
  chart: {
    type: "spline",
    backgroundColor: "transparent",
    height: 300,
  },
  title: { text: undefined },
  xAxis: {
    categories: ["11:00", "11:10", "11:20", "11:30", "12:00", "12:30", "12:40"],
    labels: { style: { color: "#aaa" } },
    lineColor: "#555",
  },
  yAxis: {
    title: { text: null },
    labels: { style: { color: "#aaa" } },
    min: -10,
    max: 30,
    gridLineWidth: 0,
    plotBands: [
      {
        from: -10,
        to: -5,
        color: "rgba(0,128,0,0.1)", // green zone
      },
      {
        from: -5,
        to: 5,
        color: "rgba(255,255,255,0)", // neutral
      },
      {
        from: 5,
        to: 10,
        color: "rgba(255,165,0,0.1)", // orange
      },
      {
        from: 10,
        to: 30,
        color: "rgba(255,0,0,0.1)", // red
      },
    ],
  },
  legend: {
    itemStyle: { color: "#ccc", fontWeight: "normal" },
    align: "left",
    verticalAlign: "top",
    symbolHeight: 10,
    symbolWidth: 10,
  },
  tooltip: {
    backgroundColor: "#222",
    borderColor: "#555",
    style: { color: "#fff" },
  },
  series: [
    {
      name: "Schedule",
      data: [0, 5, -3, 0, 15, 20, 22],
      color: "#1E90FF",
      type: "spline",
      lineWidth: 2,
      marker: { enabled: false },
    },
    {
      name: "Actual",
      data: [-1, 2, -5, 3, 18, 23, 23.5],
      color: "#00FF7F",
      type: "spline",
      lineWidth: 2,
      marker: { enabled: false },
    },
    {
      name: "Deviation",
      data: [1, 3, 2, -3, 3, 3, 3.5],
      color: "#FF4C4C",
      type: "spline",
      lineWidth: 2,
      marker: { enabled: false },
    },
  ],
  credits: { enabled: false },
  exporting: {
    enabled: false, 
  },
};

export default function DSMGraph() {
  return (
    <GraphLayout>
      <Box height="320px">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      </Box>
    </GraphLayout>
  );
}
