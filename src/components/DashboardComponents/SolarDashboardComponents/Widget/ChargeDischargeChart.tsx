import React, { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/ColumnGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const EnergyYieldChart: React.FC = () => {
  const CARD_BG = useColorModeValue("#FFFFFF", "#161B1B");
  const BORDER = useColorModeValue("#E5E7EB", "#202525");
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  const series = [
    {
      name: "Energy Yield kWh",
      type: "column",
      data: [12000, 13500, 12800, 14000, 15000, 14500, 15500],
      color: "#22C55E",
    },
    {
      name: "Energy Yield Track",
      type: "areaspline",
      color: "#38BDF8",
      opacity: 0.5,
      data: [
        { y: 6000, meta: ["Morning: 3000", "Afternoon: 3000"] },
        { y: 7000, meta: ["Morning: 3500", "Afternoon: 3500"] },
        { y: 6400, meta: ["Morning: 3200", "Afternoon: 3200"] },
        { y: 7000, meta: ["Morning: 3500", "Afternoon: 3500"] },
        { y: 7500, meta: ["Morning: 3750", "Afternoon: 3750"] },
        { y: 7200, meta: ["Morning: 3600", "Afternoon: 3600"] },
        { y: 7800, meta: ["Morning: 3900", "Afternoon: 3900"] },
      ],
    },
  ];

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={"Energy Yield"}
      width={["578px"]}
      height="344px"
      bg={CARD_BG}
      border={`1px solid ${BORDER}`}
      px="16px"
      contentProps={{ mt: 0 }}
      fullScreen
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={series}
        height={248}
        category={["24 Jun", "25 Jun", "26 Jun", "27 Jun", "28 Jun", "29 Jun", "30 Jun"]}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            column: {
              dataLabels: { enabled: false },
              borderWidth: 0,
              pointWidth: 20,
              borderRadius: 8,
              groupPadding: 0,
              pointPadding: 0,
            }
          },
          xAxis: {
            type: "category",
            labels: { style: { color: textColor, fontSize: "11px" } },
            lineColor: axisLineColor,
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
            dateTimeLabelFormats: {
              month: '%b %y',
              year: '%Y'
            },
          },
          yAxis: {
            lineColor: "transparent",
            title: { text: null },
            labels: { style: { color: textColor, fontSize: "11px" } },
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            symbolShape: 'square',
            symbolHeight: 0,
            symbolWidth: 0,
            useHTML: true,
            itemStyle: {
              overflow: "auto",
              color: textColor,
              fontSize: '12px',
            },
            labelFormatter: function (this: any) {
              return '<span style="width: 10px; height: 10px; display: inline-block; background-color: ' + this.color + '; border-radius: 0;"></span> ' + this.name;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default EnergyYieldChart;
