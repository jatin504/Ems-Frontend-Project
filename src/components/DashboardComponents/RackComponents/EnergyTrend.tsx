import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import type { TimeseriesDataSource } from "../../../types/timeseries/datasource";

import type { ExportFunctions } from "../../../types/graphExport/export";

interface Props {
  rackId: string;
}

interface SeriesPoint {
  ts: number;
  value: number;
}

interface RackTimeseriesData {
  [key: string]: SeriesPoint[] | any;
}

const EnergyPowerTrend = ({ rackId }: Props) => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const { data, fetchData } = useTimeseriesData();

  const energyFetch: TimeseriesDataSource = useMemo(
    () => ({
      devices: {
        patterns: [],
        ids: rackId ? [rackId] : [],
      },
      keys: [
        { key: "charge_energy", alias: "charge_energy", keyType: "common" },
        { key: "discharge_energy", alias: "discharge_energy", keyType: "common" },
      ],
      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "DESC",
    }),
    [rackId]
  );

  useEffect(() => {
    if (!rackId || !energyFetch?.keys?.length) return;

    fetchData(energyFetch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rackId]);

  const rackData = useMemo(() => {
    if (!data || !rackId) return null;

    const root = (data as any)?.data ?? data;
    return (root?.[rackId] ?? null) as RackTimeseriesData | null;
  }, [data, rackId]);

  const getSeries = (aliases: string[]) => {
    if (!rackData) return [] as SeriesPoint[];

    for (const alias of aliases) {
      const series = rackData[alias];
      if (Array.isArray(series) && series.length > 0) {
        return series
          .filter((point) => point && point.ts && point.value !== null && point.value !== undefined)
          .map((point) => ({
            ts: Number(point.ts),
            value: Number(point.value),
          }))
          .sort((a, b) => a.ts - b.ts);
      }
    }

    return [] as SeriesPoint[];
  };

  const chargeData = useMemo(
    () => getSeries(["charge_energy"]),
    [rackData]
  );

  const dischargeData = useMemo(
    () => getSeries(["discharge_energy"]),
    [rackData]
  );

  const seriesForChart = useMemo(
    () => [
      {
        type: "spline",
        name: "Charge Energy",
        color: "#45C854",
        data: chargeData.map((point) => [point.ts, point.value]),
        marker: {
          enabled: false,
        },
      },
      {
        type: "spline",
        name: "Discharge Energy",
        color: "#2196F3",
        data: dischargeData.map((point) => [point.ts, point.value]),
        marker: {
          enabled: false,
        },
      },
    ],
    [chargeData, dischargeData]
  );

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

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
        height={230}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            min: 0,
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
