import React, { useState, useMemo, useEffect } from "react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";
import { useColorModeValue } from "@chakra-ui/react";
import { useEmergencyFaults } from "../../../hooks/useEmergencyFaults";
import type { ExportFunctions } from "../../../types/graphExport/export";

const PRGraph: React.FC = () => {

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  // ✅ refresh trigger state
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ hook will re-run when refreshKey changes
  const { faultData } = useEmergencyFaults(refreshKey);

  // ✅ auto refresh every 1 min
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((p) => p + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const { categories, seriesData } = useMemo(() => {

    const today = new Date();
    today.setHours(0,0,0,0);

    const countMap: Record<string, number> = {};

    faultData.forEach((r) => {

      if (!r.date) return;

      const d = new Date(r.date);
      d.setHours(0,0,0,0);

      const key = d.toISOString().slice(0,10);

      countMap[key] = (countMap[key] || 0) + (r.count || 1);

    });

    const days: string[] = [];
    const counts: number[] = [];

    for (let i = 6; i >= 0; i--) {

      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const labelDay = d.getDate().toString().padStart(2,"0");
      const month = d.toLocaleString("default",{ month:"short" });

      days.push(`${labelDay} ${month}`);

      const key = d.toISOString().slice(0,10);

      counts.push(countMap[key] || 0);

    }

    return {
      categories: days,
      seriesData: counts
    };

  }, [faultData]);

  const prSeries = [
    {
      type: "column",
      name: "Emergency Faults",
      data: seriesData,
      color: "#ef4444"
    }
  ];

  return (
    <div className="fault-graph-wrapper">
      <GraphLayout
        title="Faults"
        width={["450px"]}
        height={"250px"}
        fullScreen
        onExport={exportFunctions}
      >
        <ColumnGraph
          apiData={prSeries}
          height={180}
          onExportReady={setExportFunctions}
          props={{
            legend: { enabled: false },

            xAxis: {
              type: "category",
              categories: categories,
              tickInterval: 1,
              labels: {
                step: 1,
                style: { color: subTextColor, fontSize: "10px" },
              },
              tickmarkPlacement: "on",
              gridLineWidth: 0,
            },

            yAxis: {
              title: { text: null },
              labels: {
                style: { color: textColor, fontSize: "10px" },
              },
              gridLineDashStyle: "ShortDot",
            },

            plotOptions: {
              column: {
                pointWidth: 14,
                borderRadius: 4,
                groupPadding: 0.2,
                pointPadding: 0.08,
              },
            },

            tooltip: {
              shared: true,
              hideDelay: 0,
              backgroundColor: useColorModeValue(
                "#fff",
                "rgba(24,24,27,0.95)"
              ),
              style: { color: textColor },
              valueDecimals: 0,
              formatter: function () {
                return `<b>${this.x}</b><br/>
                  ${this.points?.map(
                    (p: any) =>
                      `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b>`
                  ).join("<br/>")}`;
              }
            },
          }}
        />
      </GraphLayout>
    </div>
  );
};

export default PRGraph;