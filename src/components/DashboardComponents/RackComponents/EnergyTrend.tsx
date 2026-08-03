import React, { useMemo, useState } from "react";
import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
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

  const seriesForChart = useMemo(
    () => [
      {
        type: "spline",
        name: "Charge Energy",
        color: "#45C854",
        data: chargeData,
        marker: {
          enabled: false,
        },
      },

      {
        type: "spline",
        name: "Discharge Energy",
        color: "#2196F3",
        data: dischargeData,
        marker: {
          enabled: false,
        },
      },
    ],
    [chargeData, dischargeData]
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
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">
            Energy Trend
          </Box>
        </Box>
      }
      width={["100%"]}
      height="300px"
      mt={0}
      fullScreen
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            min: 0,
            max: 250,
            tickAmount: 5,
            labels: {
              style: {
                color: textColor,
              },
            },
            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",
            labels: {
              style: {
                color: subTextColor,
              },
            },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },

          tooltip: {
            shared: true,
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
          },
        }}
        showLegendButtons={false}
      />
    </GraphLayout>
  );
};

export default EnergyPowerTrend;