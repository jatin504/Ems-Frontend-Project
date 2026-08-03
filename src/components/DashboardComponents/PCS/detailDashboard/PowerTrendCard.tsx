import React, { useEffect, useMemo } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../../Common/WidgetTitle";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface PowerTrendCardProps {
  deviceId?: string;
}

const PowerTrendCard: React.FC<PowerTrendCardProps> = ({ deviceId }) => {
  const { data, fetchData } = useTimeseriesData();
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#6B7280", "#A0AEC0");

  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [deviceId],
      },
      keys: [
        { key: "active_power", alias: "active_power", keyType: "common" },
        { key: "reactive_power", alias: "reactive_power", keyType: "common" },
        { key: "apparent_power", alias: "apparent_power", keyType: "common" },
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
      orderBy: "ASC",
    } as any);
  }, [deviceId]);

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.15)",
    "rgba(255,255,255,0.08)"
  );

  const chartData = useMemo(() => {
    const deviceData = (data as any)?.[deviceId || ""];

    const getSeries = (key: string, name: string, color: string) => {
      const points = deviceData?.[key] ?? [];
      return {
        type: "spline",
        name,
        color,
        data: points.map((point: any) => [point.ts, Number(point.value)]),
        marker: { enabled: false },
      };
    };

    if (!deviceData) {
      return [];
    }

    return [
      getSeries("active_power", "P (kW)", "#3B82F6"),
      getSeries("reactive_power", "Q (kVAr)", "#22C55E"),
      getSeries("apparent_power", "S (kVA)", "#8B5CF6"),
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
          <WidgetTitle>Power Trend (1 Min)</WidgetTitle>
        </Box>
      }
      width={["100%"]}
      height="280px"
      fullScreen
      mt={undefined}
    >
      <SplineGraph
        apiData={chartData}
        height={215}
        props={{
          chart: {
            spacingTop: 10,
            spacingLeft: 0,
            spacingRight: 10,
            spacingBottom: 40,
          },

          plotOptions: {
            spline: {
              lineWidth: 2.5,
              marker: {
                enabled: false,
              },
              states: {
                hover: {
                  lineWidth: 2.5,
                },
              },
            },
          },

          legend: {
            enabled: true,
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: {
              color: textColor,
              fontWeight: "500",
              fontSize: "11px",
            },
            symbolRadius: 2,
            symbolWidth: 18,
            y: 32,
          },

          xAxis: {
            type: "datetime",
            tickInterval: 60 * 60 * 1000,
            min: new Date(new Date().setHours(0, 0, 0, 0) - new Date().getTimezoneOffset() * 60000).getTime(),
            max: new Date(new Date().setHours(23, 59, 59, 999) - new Date().getTimezoneOffset() * 60000).getTime(),
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineWidth: 0,
            labels: {
              style: {
                color: subTextColor,
                fontSize: "11px",
              },
            },
          },

          yAxis: {
            min: 0,

            title: {
              text: null,
            },

            startOnTick: true,
            endOnTick: true,

            lineWidth: 0,
            gridLineColor: gridColor,

            labels: {
              style: {
                color: subTextColor,
                fontSize: "11px",
              },
              formatter: function (this: any) {
                return `${this.value}`;
              },
            },
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#FFFFFF",
              "rgba(26,32,44,0.95)"
            ),
            borderWidth: 1,
            borderColor: gridColor,
            style: {
              color: textColor,
              fontSize: "12px",
            },
            formatter: function (this: any) {
              const time = new Date(this.x).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              let s = `<b>${time}</b><br/>`;

              this.points?.forEach((p: any) => {
                let unit = "";

                if (p.series.name.includes("P")) unit = " kW";
                else if (p.series.name.includes("Q")) unit = " kVAr";
                else if (p.series.name.includes("S")) unit = " kVA";

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

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 700,
                },
                chartOptions: {
                  legend: {
                    itemStyle: {
                      fontSize: "10px",
                    },
                  },
                },
              },
            ],
          },
        }}
      />
    </GraphLayout>
  );
};

export default PowerTrendCard;