import React, { useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import AreaspineGraph from "../../../Graphs/RevampCharts/AreasplineGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const SoCChart = () => {
  const makeHourly = (vals: number[]) => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(4); // screenshot tick labels show 4:00 → 18:00
    return vals.map((v, i) => [d.getTime() + i * 60 * 60 * 1000, v]) as [number, number][];
  };

  const apiData = useMemo(
    () => [
      { name: "Schedule", type: "areaspline", color: "#FF9D6B", data: makeHourly([380, 300, 220, 260, 320, 360, 420, 280, 360, 120, 420, 460, 380, 440, 500]) },
      { name: "Actual", type: "areaspline", color: "#38C0FF", data: makeHourly([280, 220, 160, 140, 180, 240, 300, 260, 300, 200, 260, 340, 220, 300, 480]) },
      { name: "Deviation %", type: "spline", color: "#9BA3AF", data: makeHourly([1, 3, 2, -3, 3, 3, 3.5, 3, 2, -3, 3, 3, 3.5, 3, 2, -3]) },
    ],
    []
  );

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
    const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
    const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
    const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");
    
  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={"SoC"}
      width={["585px"]}
      height="286px"
      fullScreen
      downloadOption
      onExport={exportFunctions}
    >
      <AreaspineGraph
        apiData={apiData as any}
        height={235}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            crosshair: { color: 'rgba(255,255,255,0.15)', width: 1 },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue("#fff", 'rgba(24,24,27,0.95)'),
            style: { color: textColor },
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

export default SoCChart;
