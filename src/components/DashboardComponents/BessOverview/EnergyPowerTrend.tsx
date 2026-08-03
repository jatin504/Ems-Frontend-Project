import { useMemo, useState } from "react";
import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import type { ExportFunctions } from "../../../types/graphExport/export";

const day = 24 * 60 * 60 * 1000;

const start = Date.UTC(2026, 6, 1);

const EnergyPowerTrend = () => {

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);


  const chargeData = useMemo(
    () => [
      [start + day * 0, 165],
      [start + day * 1, 182],
      [start + day * 2, 210],
      [start + day * 3, 175],
      [start + day * 4, 192],
      [start + day * 5, 218],
      [start + day * 6, 205],
    ],
    []
  );

  const dischargeData = useMemo(
    () => [
      [start + day * 0, 150],
      [start + day * 1, 165],
      [start + day * 2, 190],
      [start + day * 3, 162],
      [start + day * 4, 170],
      [start + day * 5, 198],
      [start + day * 6, 184],
    ],
    []
  );

  const peakPowerData = useMemo(
    () => [
      [start + day * 0, 78],
      [start + day * 1, 82],
      [start + day * 2, 90],
      [start + day * 3, 76],
      [start + day * 4, 84],
      [start + day * 5, 94],
      [start + day * 6, 88],
    ],
    []
  );

  const seriesForChart = useMemo(
    () => [
      {
        type: "column",
        name: "Charge Energy",
        color: "#14B8A6",
        data: chargeData,
        yAxis: 0,
        pointWidth: 18,
      },
      {
        type: "column",
        name: "Discharge Energy",
        color: "#F97316",
        data: dischargeData,
        yAxis: 0,
        pointWidth: 18,
      },
      {
        type: "spline",
        name: "Peak Power",
        color: "#F59E0B",
        data: peakPowerData,
        yAxis: 1,
        lineWidth: 3,
        marker: {
          enabled: false,
        },
      },
    ],
    [chargeData, dischargeData, peakPowerData]
  );

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");

  const subTextColor = useColorModeValue(
    "#4A5568",
    "#B9B9B9"
  );

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );
    return (
    <GraphLayout
      title={
        <Box fontWeight="600">
          Energy & Power Trend
        </Box>
      }
      width={["100%"]}
      height="344px"
      mt="0"
      fullScreen
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          xAxis: {
            type: "datetime",
            tickAmount: 7,
            labels: {
              style: {
                color: subTextColor,
              },
            },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },

          yAxis: [
            {
              title: {
                text: "Energy (MWh)",
              },
              min: 0,
              max: 250,
              tickAmount: 6,
              gridLineColor: gridColor,
              labels: {
                style: {
                  color: textColor,
                },
              },
            },
            {
              title: {
                text: "Peak Power (MW)",
              },
              opposite: true,
              min: 0,
              max: 100,
              tickAmount: 5,
              labels: {
                style: {
                  color: textColor,
                },
              },
            },
          ],

          plotOptions: {
            column: {
              pointWidth: 16,
              borderRadius: 4,
              grouping: true,
            },
            spline: {
              marker: {
                enabled: false,
              },
              lineWidth: 3,
            },
          },

          tooltip: {
            shared: true,
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
          },
        }}
      />
    </GraphLayout>
  );
};

export default EnergyPowerTrend;