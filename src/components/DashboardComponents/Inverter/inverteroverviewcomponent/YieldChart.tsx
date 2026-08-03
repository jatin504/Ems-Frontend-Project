import React, { useEffect, useState, useMemo } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import WidgetTitle from "../../../Common/WidgetTitle";

import { useColorModeValue, Box } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const ENERGY_ALIAS = "Energy (kW)";
const YIELD_ALIAS = "Specific Yield";

const InverterYieldGraph: React.FC = () => {
  const {
    config: timeWindowSoC,
    handleTimeWindowChange: handleTimeWindowSoCChange,
    handleReset: SoCHandleReset,
  } = useTimeHandle(
    5,
    "day",
    "last",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 2,
        intervalType: "minute",
      },
    }
  );

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: ["_inverter_inverter_"],
        ids: [],
      },
      keys: [
        {
          key: "daily_energy",
          alias: ENERGY_ALIAS,
          keyType: "common",
          type: "column",
        },
        {
          key: "specific_yield",
          alias: YIELD_ALIAS,
          keyType: "common",
          type: "spline",
        },
      ],
      aggregation: timeWindowSoC.aggregation,
      timeRange: timeWindowSoC.timeRange,
      orderBy: timeWindowSoC.orderBy,
    },
  };

  const { data, fetchData } = useTimeseriesData();


  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindowSoC]);

  const filteredData = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return null;

    return widgetData;
  }, [data]);

  const chartData = useMemo(() => {
    if (!filteredData) return null;

    const categories: string[] = [];
    const energy: any[] = [];
    const yieldData: any[] = [];

    const COLORS = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#84cc16",
      "#10b981",
      "#06b6d4",
      "#3b82f6",
      "#6366f1",
      "#a855f7",
      "#ec4899",
    ];

    const sortedDevices = Object.entries(filteredData).sort(
      ([a], [b]) => {
        const aNo = Number(a.match(/_(\d+)$/)?.[1] ?? 0);
        const bNo = Number(b.match(/_(\d+)$/)?.[1] ?? 0);
        return aNo - bNo;
      }
    );

    sortedDevices.forEach(([deviceId, device]: any, index) => {
      const suffix = Number(deviceId.match(/_(\d+)$/)?.[1] ?? index + 1);

      categories.push(`INV-${suffix}`);

      const energyPoint = device?.[ENERGY_ALIAS]?.[0];
      const yieldPoint = device?.[YIELD_ALIAS]?.[0];

      energy.push({
        y: Number(energyPoint?.value ?? 0),
        color: COLORS[index % COLORS.length],
      });

      yieldData.push(Number(yieldPoint?.value ?? 0));
    });

    return {
      categories,
      energy,
      yieldData,
    };
  }, [filteredData]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <WidgetTitle>Inverter Yield</WidgetTitle>
        </Box>
      }
      width={["538px"]}   
      height={"314px"}    
      fullScreen
      timeWindow={true}
      onTimeWindowChange={(config) => handleTimeWindowSoCChange(config)}
      onReset={SoCHandleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph apiData={
        chartData
          ? [
              {
                type: "column",
                name: "Energy (kW)",
                data: chartData.energy,
                yAxis: 0,
                valueSuffix: " kWh",
              },
              {
                type: "spline",
                name: "Specific Yield",
                data: chartData.yieldData,
                yAxis: 1,
                color: "#111827",
                valueSuffix: " kWh/kWp",
                lineWidth: 2,
                zIndex: 10,
                marker: {
                  enabled: true,
                  radius: 4,
                  fillColor: "#111827",
                  lineColor: "#111827",
                },
              },
            ]
          : []
      }
        height={250}
        onExportReady={setExportFunctions}
        props={{
          yAxis: [
            {
              tickAmount: 6,
              title: { text: "Energy (kWh)" },
              labels: { style: { color: textColor } },
              gridLineColor: gridColor,
            },
            {
              title: { text: "Specific Yield" },
              opposite: true,
              labels: { style: { color: textColor } },
              gridLineColor: gridColor,
            },
          ],
          xAxis: {
            categories: chartData?.categories ?? [],
            crosshair: true,
            labels: {
              rotation: 0,
              autoRotation: false,
              reserveSpace: true,
              overflow: "allow",
              step: 1,
              style: {
                color: subTextColor,
                fontSize: "11px",
              },
            },
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
            formatter: function (this: any) {
              const points = this.points || [];
              if (!points.length) return "";

              const header = `<b>${this.x}</b>`;
              const body = points.map((point: any) => {
                const suffix = point.series.options?.valueSuffix ?? "";
                const label = point.series.name === "Specific Yield" ? " kWh" : suffix;
                return `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${Number(point.y ?? 0).toFixed(2)}${label}</b>`;
              });

              return `${header}<br/>${body.join("<br/>")}`;
            },
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            navigation: {
              enabled: true,
              activeColor: "#2563eb",
              inactiveColor: "#cbd5e1",
              arrowSize: 12,
              style: {
                fontWeight: "600",
              },
            },
            maxHeight: 22,
            itemStyle: {
              color: textColor,
              fontSize: "11px",
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default InverterYieldGraph;
