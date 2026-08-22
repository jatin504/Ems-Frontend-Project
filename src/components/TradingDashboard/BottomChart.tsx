import React from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../Graphs/RevampCharts/ColumnGraph";

const BottomChart = () => {
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  return (
    <GraphLayout
      width={["1200px"]}
      height="220px"
      downloadOption={false} // ✅ MENU REMOVED
    >
      <ColumnGraph
        apiData={[
          {
            type: "column",
            name: "Price Spread",
            color: "#60a5fa",
            borderRadius: 3,
            data: [
              ["00:00", 300],
              ["04:00", 280],
              ["08:00", 350],
              ["12:00", 420],
              ["16:00", 390],
              ["20:00", 320],
              ["24:00", 340],
            ],
          },
          {
            type: "spline",
            name: "Trend",
            color: "#c084fc",
            lineWidth: 3,
            marker: { enabled: false },
            data: [
              ["00:00", 250],
              ["04:00", 200],
              ["08:00", 380],
              ["12:00", 450],
              ["16:00", 400],
              ["20:00", 300],
              ["24:00", 320],
            ],
          },
        ]}
        height={140}
        props={{
          chart: {
            height: 140,
            backgroundColor: "transparent",
          },

          plotOptions: {
            column: {
              borderWidth: 0,
              pointWidth: 20,
              borderRadius: 3,
            },
            series: {
              animation: false,
            },
          },

          xAxis: {
            type: "category",
            labels: {
              style: { color: subTextColor, fontSize: "10px" },
            },
            lineWidth: 0,
            tickLength: 0,
          },

          yAxis: {
            min: 0,
            max: 500,
            tickPositions: [0, 500],
            labels: {
              style: { color: subTextColor, fontSize: "10px" },
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            title: { text: "" },
          },

          legend: {
            enabled: true,
            align: "right",
            verticalAlign: "top",
            itemStyle: {
              color: subTextColor,
              fontSize: "10px",
              fontWeight: "500",
            },
          },

          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#ffffff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: subTextColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default BottomChart;