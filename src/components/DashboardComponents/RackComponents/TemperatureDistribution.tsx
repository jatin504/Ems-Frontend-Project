import React, { useState } from "react";
import { Box, Select, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const TemperatureDistribution: React.FC = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [parameter, setParameter] = useState("Average");

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );

  const chartData = [
    {
      name: "Temperature",
      type: "column",
      showInLegend: false,
      colorByPoint: true,
      enableMouseTracking: true,
      legendIndex: -1,
      data: [
        { name: "1", y: 36.2, color: "#67C23A" },
        { name: "2", y: 35.8, color: "#67C23A" },
        { name: "3", y: 36.1, color: "#67C23A" },
        { name: "4", y: 44.8, color: "#EF4444" },
        { name: "5", y: 35.7, color: "#67C23A" },
        { name: "6", y: 36.0, color: "#67C23A" },
        { name: "7", y: 35.9, color: "#67C23A" },
        { name: "8", y: 35.6, color: "#67C23A" },
        { name: "9", y: 36.3, color: "#F59E0B" },
        { name: "10", y: 35.5, color: "#67C23A" },
      ],
    },

    // Legend Only
    {
      type: "column",
      name: "Normal (<40°C)",
      color: "#67C23A",
      data: [null],
    },
    {
      type: "column",
      name: "Warning (40-50°C)",
      color: "#F59E0B",
      data: [null],
    },
    {
      type: "column",
      name: "Alarm (>50°C)",
      color: "#EF4444",
      data: [null],
    },
  ];

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <Box>Temperature Distribution</Box>

          <Select
            size="xs"
            width="110px"
            height="24px"
            fontSize="11px"
            value={parameter}
            onChange={(e) => setParameter(e.target.value)}
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="4px"
          >
            <option>Average</option>
            <option>Maximum</option>
            <option>Minimum</option>
          </Select>
        </Box>
      }
      width={["100%"]}
      height="100%"
      fullScreen
      timeWindow={false}
      onExport={exportFunctions}
    >
              <ColumnGraph
        apiData={chartData}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          chart: {
            type: "column",
          },

          xAxis: {
            type: "category",
            labels: {
              style: {
                color: subTextColor,
                fontSize: "10px",
              },
              formatter: function () {
                return String(this.value).replace(/^Rack-/, "");
              },
            },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },

          yAxis: {
            min: 0,
            max: 50,
            tickAmount: 5,
            title: {
              text: "Temperature (°C)",
            },
            labels: {
              style: {
                color: textColor,
              },
            },
            gridLineColor: gridColor,
          },

          tooltip: {
            shared: false,
            backgroundColor: useColorModeValue(
              "#FFFFFF",
              "rgba(24,24,27,0.95)"
            ),
            style: {
              color: textColor,
            },
            pointFormat:
              "<b>{point.y} °C</b>",
          },

          legend: {
            enabled: true,
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            symbolRadius: 0,
            symbolWidth: 12,
            symbolHeight: 12,
            itemStyle: {
              color: textColor,
              fontSize: "10px",
              fontWeight: "400",
            },
          },

          plotOptions: {
            column: {
              borderRadius: 4,
              pointPadding: 0.15,
              groupPadding: 0.08,
              dataLabels: {
                enabled: true,
                format: "{point.y}°",
                style: {
                  fontSize: "9px",
                  fontWeight: "500",
                },
              },
            },
          },

          credits: {
            enabled: false,
          },
        }}
      />
    </GraphLayout>
  );
};

export default TemperatureDistribution;