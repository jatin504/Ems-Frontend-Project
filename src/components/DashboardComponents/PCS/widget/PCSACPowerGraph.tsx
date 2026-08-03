import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import WidgetTitle from "../../../Common/WidgetTitle";
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

const ENERGY_ALIAS = "Daily Energy";

const PCSACPowerGraph: React.FC = () => {
  const { data, fetchData } = useTimeseriesData();
  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
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
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: ["_pcs_pcs_"],
        ids: [],
      },
      keys: [
        {
          key: "daily_energy",
          alias: ENERGY_ALIAS,
          keyType: "common",
          type: "column",
          color: "#7AC943",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    },
  };

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindow]);

  const { seriesForChart, deviceLabels } = useMemo(() => {
    if (!data) return { seriesForChart: [], deviceLabels: [] };

    const widgetData = data as WidgetData | null;
    if (!widgetData) return { seriesForChart: [], deviceLabels: [] };

    const devices = Object.entries(widgetData)
      .filter(([, device]) => (device?.[ENERGY_ALIAS] ?? []).length > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 4);

    const labels = Array.from({ length: Math.min(devices.length, 4) }, (_, index) => `pcs_${index + 1}`);

    const values = devices.map(([, device]) => {
      const points = device?.[ENERGY_ALIAS] ?? [];
      const lastPoint = points[points.length - 1];
      return lastPoint?.value ?? 0;
    });

    return {
      seriesForChart: [
        {
          name: ENERGY_ALIAS,
          type: "column",
          data: values,
          color: "#7AC943",
        },
      ],
      deviceLabels: labels,
    };
  }, [data]);

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

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={<WidgetTitle>PCS Energy</WidgetTitle>}
      width={["650px"]}
      height="300px"
      border="none"
      fullScreen
      timeWindow={true}
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={seriesForChart}
        height={250}
        category={deviceLabels}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "category",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"),
            style: { color: textColor },
            formatter: function (this: any) {
              const points = this.points?.map((point: any) => {
                return `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y.toFixed(2)} kWh</b>`;
              }) || [];
              return points.join("<br/>");
            },
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default PCSACPowerGraph;