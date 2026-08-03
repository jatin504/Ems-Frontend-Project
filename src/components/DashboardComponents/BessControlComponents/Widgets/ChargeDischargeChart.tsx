import React, { useState } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/ColumnGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const ChargeDischargeChart: React.FC = () => {
  // Light/Dark colors (dark keeps #161B1B)
  const CARD_BG = useColorModeValue("#FFFFFF", "#161B1B");
  const BORDER = useColorModeValue("#E5E7EB", "#202525");
  const TITLE_COLOR = useColorModeValue("#111827", "#E8ECEC");
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  const category = [
    "03 Jul",
    "04 Jul",
    "05 Jul",
    "06 Jul",
    "07 Jul",
    "08 Jul",
    "09 Jul",
  ];

  const series = [
    {
      name: "Charge kWh",
      type: "column",
      data: [5000, 6000, 5500, 5200, 5800, 6500, 7000],
      color: "#3B82F6",
    },
    {
      name: "Discharge kWh",
      type: "column",
      data: [4500, 5500, 5000, 4800, 5400, 6000, 6200],
      color: "#F59E0B",
    },
    {
      name: "Charge Track",
      type: "areaspline",
      color: "#A78BFA",
      opacity: 0.5,
      data: [
        {
          y: 5000,
          meta: [
            "09:00–11:00: 1800",
            "12:00–14:00: 1600",
            "15:00–17:00: 1600",
          ],
        },
        {
          y: 6000,
          meta: [
            "09:00–11:00: 2200",
            "12:00–14:00: 1800",
            "15:00–17:00: 2000",
          ],
        },
        {
          y: 5500,
          meta: [
            "09:00–11:00: 2000",
            "12:00–14:00: 1800",
            "15:00–17:00: 1700",
          ],
        },
        {
          y: 5200,
          meta: [
            "09:00–11:00: 1800",
            "12:00–14:00: 1700",
            "15:00–17:00: 1700",
          ],
        },
        {
          y: 5800,
          meta: [
            "09:00–11:00: 2000",
            "12:00–14:00: 1900",
            "15:00–17:00: 1900",
          ],
        },
        {
          y: 6500,
          meta: [
            "09:00–11:00: 2300",
            "12:00–14:00: 2100",
            "15:00–17:00: 2100",
          ],
        },
        {
          y: 7000,
          meta: [
            "09:00–11:00: 2500",
            "12:00–14:00: 2200",
            "15:00–17:00: 2300",
          ],
        },
      ],
    },
    {
      name: "Discharge Track",
      type: "areaspline",
      color: "#F97316",
      opacity: 0.5,
      data: [
        {
          y: 4500,
          meta: [
            "18:00–19:30: 1500",
            "20:00–21:30: 1500",
            "22:00–23:00: 1500",
          ],
        },
        {
          y: 5500,
          meta: [
            "18:00–19:30: 1800",
            "20:00–21:30: 1900",
            "22:00–23:00: 1800",
          ],
        },
        {
          y: 5000,
          meta: [
            "18:00–19:30: 1700",
            "20:00–21:30: 1700",
            "22:00–23:00: 1600",
          ],
        },
        {
          y: 4800,
          meta: [
            "18:00–19:30: 1600",
            "20:00–21:30: 1600",
            "22:00–23:00: 1600",
          ],
        },
        {
          y: 5400,
          meta: [
            "18:00–19:30: 1800",
            "20:00–21:30: 1800",
            "22:00–23:00: 1800",
          ],
        },
        {
          y: 6000,
          meta: [
            "18:00–19:30: 2000",
            "20:00–21:30: 2000",
            "22:00–23:00: 2000",
          ],
        },
        {
          y: 6200,
          meta: [
            "18:00–19:30: 2000",
            "20:00–21:30: 2100",
            "22:00–23:00: 2100",
          ],
        },
      ],
    },
  ];

  // [
  //   { name: "Charge Energy kWh-1", color: "#3B82F6", data: [[t00, 55]] },
  //   { name: "Charge Energy kWh-2", color: "#F59E0B", data: [[t06, 62]] },
  //   { name: "Discharge Energy kWh-1", color: "#A78BFA", data: [[t12, 74]] },
  //   { name: "Discharge Energy kWh-2", color: "#F97316", data: [[t18, 78]] },
  // ];

    const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);
  

  return (
    <GraphLayout
      title={"Charge/Discharge"}
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
        category={category}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            column: {
              dataLabels: {
                enabled: false
              },
              borderWidth: 0,
              pointWidth: 20,       // thin bars to look clean in small card
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
              month: '%b %y', // Custom format for months
              year: '%Y' // Format for years if needed
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
          tooltip: {
            shared: true,
            formatter: function (this: any) {
              let html = `<b>${this.x}</b><br/>`;

              this.points.forEach((p: any) => {
                if (
                  p.series.name === "Charge Track" ||
                  p.series.name === "Discharge Track"
                ) {
                  const meta = p.point.options.meta || [];

                  html += `<span style="color:${p.color}">●</span>
                    ${p.series.name}<br/>`;

                  meta.forEach((m: string) => {
                    html += `&nbsp;&nbsp;${m}<br/>`;
                  });
                } else {
                  html += `<span style="color:${p.color}">●</span>
                    ${p.series.name}: <b>${p.y} kWh</b><br/>`;
                }
              });

              return html;
            },
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            symbolShape: 'square', // Keep this for other chart types, but it won't be applied to column chart symbols
            symbolHeight: 0,
            symbolWidth: 0,
            useHTML: true, // Allow HTML rendering for custom symbols
            itemStyle: {
              overflow: "auto",
              color: textColor,
              fontSize: '12px',
            },
            labelFormatter: function (this: any) {
              // Create a custom square legend symbol with the background color of each series
              // Here we avoid using the default circle symbol
              return '<span style="width: 10px; height: 10px; display: inline-block; background-color: ' + this.color + '; border-radius: 0;"></span> ' + this.name;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default ChargeDischargeChart;
