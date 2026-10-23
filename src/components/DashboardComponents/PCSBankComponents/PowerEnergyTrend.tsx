import React, { useEffect, useMemo, useState } from "react";
import { HStack, useColorModeValue } from "@chakra-ui/react";
import WidgetTitle from "../../Common/WidgetTitle";
import { InfoOutlineIcon } from "@chakra-ui/icons";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";
import type { ExportFunctions } from "../../../types/graphExport/export";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface Props {
  selectedDevice?: string;
}

const PowerEnergyTrend: React.FC<Props> = ({ selectedDevice }) => {
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedDevice) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },
      keys: [
        {
          key: "energy_charged_today",
          alias: "Energy",
          keyType: "common",
          type: "column",
        },
      ],
      aggregation: {
        func: "sum",
        interval: 1,
        intervalType: "day",
      },
      timeRange: {
        type: "last",
        interval: 7,
        intervalType: "day",
      },
      orderBy: "ASC",
    } as any);
  }, [selectedDevice]);

  const chartData = useMemo(() => {
    const deviceData = selectedDevice
      ? (data as Record<string, any> | undefined)?.[selectedDevice]
      : undefined;

    if (!deviceData?.Energy) return [];

    return [
      {
        name: "Energy (kWh)",
        color: "#4DA3FF",
        data: deviceData.Energy.map((p: any) => [p.ts, Number(p.value)]),
      },
    ];
  }, [data, selectedDevice]);

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const subText = useColorModeValue("#64748B", "#94A3B8");

  return (
    <GraphLayout
        title={
          <HStack spacing={2}>
            <WidgetTitle>Energy Trend</WidgetTitle>
            <InfoOutlineIcon boxSize={4} color={subText} />
          </HStack>
        }
        width="100%"
        height="320px"
        fullScreen
        onExport={exportFunctions}
      >
          <ColumnGraph
            apiData={chartData}
            height={235}
            onExportReady={setExportFunctions}
            props={{
              plotOptions: { column: { pointWidth: undefined, maxPointWidth: 64 } },
              xAxis: {
                type: "datetime",
              },
              yAxis: [
                {
                  title: { text: "" },
                },
                {
                  title: { text: "" },
                  opposite: true,
                },
              ],
              legend: {
                enabled: true,
                align: "center",
                verticalAlign: "bottom",
              },
              tooltip: {
                shared: true,
              },
            }}
          />
    </GraphLayout>
  );
};

export default PowerEnergyTrend;