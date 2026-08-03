import React, { useEffect, useMemo } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../../Common/WidgetTitle";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface VoltageCurrentCardProps {
  deviceId?: string;
}

const VoltageCurrentCard: React.FC<VoltageCurrentCardProps> = ({ deviceId }) => {
  const { data, fetchData } = useTimeseriesData();
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#6B7280", "#A0AEC0");

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.15)",
    "rgba(255,255,255,0.08)"
  );

  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [deviceId],
      },
      keys: [
        { key: "phase_a_voltage", alias: "phase_a_voltage", keyType: "common" },
        { key: "phase_b_voltage", alias: "phase_b_voltage", keyType: "common" },
        { key: "phase_c_voltage", alias: "phase_c_voltage", keyType: "common" },
        { key: "phase_a_current", alias: "phase_a_current", keyType: "common" },
        { key: "phase_b_current", alias: "phase_b_current", keyType: "common" },
        { key: "phase_c_current", alias: "phase_c_current", keyType: "common" },
      ],
      aggregation: {
        func: "avg",
        interval: 15,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "ASC",
    } as any);
  }, [deviceId]);

  const chartData = useMemo(() => {
    const deviceData = (data as any)?.[deviceId || ""];

    const getSeries = (key: string, name: string, color: string, yAxis: number, dashStyle?: string) => {
      const points = deviceData?.[key] ?? [];
      return {
        type: "spline",
        name,
        color,
        yAxis,
        dashStyle,
        data: points.map((point: any) => [point.ts, Number(point.value)]),
        marker: { enabled: false },
      };
    };

    if (!deviceData) {
      return [];
    }

    return [
      getSeries("phase_a_voltage", "V L1 (kV)", "#EF4444", 0),
      getSeries("phase_b_voltage", "V L2 (kV)", "#F59E0B", 0),
      getSeries("phase_c_voltage", "V L3 (kV)", "#3B82F6", 0),
      getSeries("phase_a_current", "I L1 (A)", "#94A3B8", 1, "ShortDash"),
      getSeries("phase_b_current", "I L2 (A)", "#64748B", 1, "ShortDash"),
      getSeries("phase_c_current", "I L3 (A)", "#475569", 1, "ShortDash"),
    ];
  }, [data, deviceId]);

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
        >
          <WidgetTitle>Voltage & Current (AC Side)</WidgetTitle>
        </Box>
      }
      width={["100%"]}
      height="280px"
      fullScreen
      mt={undefined}
    >
      <SplineGraph
        apiData={chartData}
        height={205}
        props={{
                      chart: {
            spacingTop: 10,
            spacingLeft: 10,
            spacingRight: 45,
            spacingBottom: 36,
          },

          plotOptions: {
            spline: {
              lineWidth: 2,
              marker: {
                enabled: false,
              },
              states: {
                hover: {
                  lineWidth: 2,
                },
              },
            },
          },

          legend: {
            enabled: true,
            align: "center",
            verticalAlign: "top",
            layout: "horizontal",
            y: 16,
            itemDistance: 20,
            symbolWidth: 18,
            symbolHeight: 2,
            itemStyle: {
              color: textColor,
              fontSize: "11px",
              fontWeight: "500",
            },
          },

          xAxis: {
            type: "datetime",
            tickInterval: 15 * 60 * 1000,
            lineColor: axisLineColor,
            gridLineWidth: 0,
            margin: 10,
            labels: {
              y: 18,
              style: {
                color: subTextColor,
                fontSize: "11px",
              },
            },
          },

          yAxis: [
            {
              id: "voltage",
              opposite: false,

              min: 0,
              max: 40,
              tickInterval: 10,

              title: {
                text: "Voltage (kV)",
                style: {
                  color: subTextColor,
                  fontSize: "11px",
                },
              },

              labels: {
                style: {
                  color: subTextColor,
                  fontSize: "11px",
                },
              },

              gridLineColor: gridColor,
              lineColor: axisLineColor,
              lineWidth: 1,
            },

            {
              id: "current",
              opposite: true,

              min: 0,
              max: 600,
              tickInterval: 100,

              title: {
                text: "",
                style: {
                  color: subTextColor,
                  fontSize: "11px",
                },
              },

              labels: {
                style: {
                  color: subTextColor,
                  fontSize: "11px",
                },
              },

              gridLineWidth: 0,
              lineColor: axisLineColor,
              lineWidth: 1,
            },
          ],

          tooltip: {
            shared: true,

            backgroundColor: useColorModeValue(
              "#FFFFFF",
              "rgba(26,32,44,0.95)"
            ),

            borderWidth: 1,

            style: {
              color: textColor,
              fontSize: "12px",
            },

            valueDecimals: 2,
            formatter: function (this: any) {
              const time = new Date(this.x).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              let s = `<b>${time}</b><br/>`;

              this.points?.forEach((p: any) => {
                let unit = "";

                if (p.series.name.includes("V")) {
                  unit = " kV";
                } else if (p.series.name.includes("I")) {
                  unit = " A";
                }

                s += `
                  <span style="color:${p.color}">●</span>
                  ${p.series.name}: <b>${Number(p.y).toFixed(2)}${unit}</b><br/>
                `;
              });

              return s;
            },
          },

          credits: {
            enabled: false,
          },

          exporting: {
            enabled: false,
          },

          navigator: {
            enabled: false,
          },

          scrollbar: {
            enabled: false,
          },
        }}
      />
    </GraphLayout>
  );
};

export default VoltageCurrentCard;