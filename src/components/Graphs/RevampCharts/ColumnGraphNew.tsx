import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";

import { BarChart } from "echarts/charts";

import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  TitleComponent,
  MarkLineComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

import { Button } from "@chakra-ui/react";

import "../../../App.css";

import type { ExportFunctions } from "../../../types/graphExport/export";
import { EnlargeHeight } from "../../../Services/EnlargeWidget";

echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  TitleComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

interface ColumnGraphProps {
  apiData?: any[];
  height?: number | string;
  bg?: string;
  category?: string[];
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  inFullScreen?: (mode: boolean) => void;
  onExportReady?: (functions: ExportFunctions) => void;
  showLegendButtons?: boolean;
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({
  apiData = [],
  height = 280,
  bg,
  category,
  legendHeight = 40,
  xAxisInterval = "auto",
  props,
  isFullscreen = false,
  inFullScreen,
  onExportReady,
  showLegendButtons = true,
}) => {
  const chartRef = useRef<ReactECharts>(null);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const detectTheme = () => {
      const mode = localStorage.getItem("chakra-ui-color-mode");
      setIsDark(mode === "dark");
    };

    detectTheme();

    window.addEventListener("storage", detectTheme);

    const observer = new MutationObserver(detectTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => {
      window.removeEventListener("storage", detectTheme);
      observer.disconnect();
    };
  }, []);

  const gridColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.10)";

  const lineColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.16)";

  const tooltipBg = isDark
    ? "rgba(24,24,27,0.95)"
    : "#ffffff";

  const tooltipTextColor = isDark
    ? "#fff"
    : "#1A202C";

  useEffect(() => {
    if (inFullScreen) {
      inFullScreen(isFullscreen);
    }
  }, [isFullscreen]);

  const exportPNG = () => {
    const instance = chartRef.current?.getEchartsInstance();

    if (!instance) return;

    const url = instance.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
    });

    const a = document.createElement("a");
    a.href = url;
    a.download = "chart-png.png";
    a.click();
  };

  const exportCSV = () => {
    if (!apiData?.length) return;

    let csv = "Series,Timestamp,Value\n";

    apiData.forEach((series: any) => {
      series.data?.forEach((item: any) => {
        csv += `${series.name},${item[0]},${item[1]}\n`;
      });
    });

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "chart-data.csv";

    link.click();
  };

  useEffect(() => {
    onExportReady?.({
      exportPNG,
      exportCSV,
    });
  }, [apiData]);

  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const areAllHidden =
    apiData.length > 0 &&
    hiddenSeries.length === apiData.length;

  const legendOffset = 12;
  const buttonOffset = 18;

  const handleHideAll = () => {
    setHiddenSeries(apiData.map((s: any) => s.name));
  };

  const handleShowAll = () => {
    setHiddenSeries([]);
  };
    const option = useMemo(() => {
    const legendSelected: Record<string, boolean> = {};

    apiData.forEach((series: any) => {
      legendSelected[series.name] = !hiddenSeries.includes(series.name);
    });

    return {
      backgroundColor: bg || "transparent",

      animation: true,

      textStyle: {
        fontFamily: "Montserrat, sans-serif",
        color: isDark ? "#fff" : "#062D59",
      },

      grid: {
        left: 25,
        right: 25,
        top: 10,
        bottom: showLegendButtons
          ? legendHeight + 25
          : legendHeight + 12,
        containLabel: true,
      },

      legend: {
        type: "scroll",
        bottom: 8,
        icon: "rect",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: isDark ? "#fff" : "#062D59",
          fontSize: 12,
        },
        selected: legendSelected,
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },

        backgroundColor: tooltipBg,

        borderWidth: 1,

        textStyle: {
          color: tooltipTextColor,
          fontSize: 12,
        },

        formatter: (params: any) => {
          if (!params.length) return "";

          const ts = Number(params[0].value[0]);

          const date = echarts.time.format(
            ts,
            "{dd}/{MM}/{yyyy}, {HH}:{mm}",
            false
          );

          let html = `
            <div style="font-weight:600;margin-bottom:6px">
              ${date}
            </div>
          `;

          params.forEach((item: any) => {
            html += `
              <div style="margin:3px 0">
                <span style="
                  display:inline-block;
                  width:10px;
                  height:10px;
                  background:${item.color};
                  margin-right:6px;
                "></span>

                ${item.seriesName}: <b>${Number(item.value[1]).toFixed(2)}</b>
              </div>
            `;
          });

          return html;
        },
      },

      xAxis: category
        ? {
            type: "category",

            data: category,

            axisLine: {
              lineStyle: {
                color: lineColor,
              },
            },

            axisTick: {
              show: false,
            },

            splitLine: {
              show: true,

              lineStyle: {
                color: gridColor,
                type: "dashed",
              },
            },

            axisLabel: {
              color: isDark ? "#fff" : "#062D59",
              fontSize: 12,
              interval: xAxisInterval,
              showMinLabel: true,
              showMaxLabel: true,
            },
          }
        : {
            type: "time",

            boundaryGap: false,
            // min: "dataMin",
            // max: "dataMax",

            axisLine: {
              lineStyle: {
                color: lineColor,
              },
            },

            axisTick: {
              show: false,
            },

            splitLine: {
              show: true,

              lineStyle: {
                color: gridColor,
                type: "dashed",
              },
            },

            axisLabel: {
              color: isDark ? "#fff" : "#062D59",
              fontSize: 12,
              showMinLabel: true,
              showMaxLabel: true,
            },
          },

      yAxis: [
        {
          type: "value",
          splitNumber: isFullscreen ? 10 : 6,

          axisLine: {
            show: true,

            lineStyle: {
              color: "#000",
              width: 2,
            },
          },

          splitLine: {
            show: true,

            lineStyle: {
              color: gridColor,
              type: "dashed",
            },
          },

          axisLabel: {
            color: "#000",
            fontSize: 12,
          },
        },

        {
          type: "value",
          position: "right",

          axisLine: {
            show: true,

            lineStyle: {
              color: "#000",
              width: 2,
            },
          },

          splitLine: {
            show: false,
          },

          axisLabel: {
            color: "#000",
            fontSize: 12,
          },
        },
      ],

      series: apiData.map((series: any) => ({
        ...series,

        type: "bar",

        yAxisIndex: series.yAxisIndex ?? 0,

        barWidth: 8,
        barCategoryGap: "15%",

        itemStyle: {
          color: series.color,
        },

        emphasis: {
          focus: "series",
        },
      })),


      // ...(props || {}),
    };
  }, [
    apiData,
    hiddenSeries,
    bg,
    category,
    isDark,
    props,
    legendHeight,
    isFullscreen,
    showLegendButtons,
  ]);
    return (
    <div style={{ position: "relative" }}>
      {showLegendButtons && (
        <Button
          size="xs"
          variant="ghost"
          position="absolute"
          left={`${legendOffset}px`}
          bottom={`-${buttonOffset}px`}
          zIndex={2}
          onClick={handleShowAll}
          disabled={!areAllHidden}
          style={{
            marginBottom: "18px",
            color: isDark ? "#fff" : "#222",
          }}
        >
          Show all
        </Button>
      )}

      {showLegendButtons && (
        <Button
          size="xs"
          variant="ghost"
          position="absolute"
          right={`${legendOffset}px`}
          bottom={`-${buttonOffset}px`}
          zIndex={2}
          onClick={handleHideAll}
          disabled={areAllHidden}
          style={{
            marginBottom: "18px",
            color: isDark ? "#fff" : "#222",
          }}
        >
          Hide all
        </Button>
      )}

      <ReactECharts
        ref={chartRef}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{
          width: "100%",
          height: isFullscreen
            ? EnlargeHeight(770)
            : Number(height),
        }}
        onEvents={{
          legendselectchanged: (params: any) => {
            const hidden = Object.keys(params.selected).filter(
              (key) => !params.selected[key]
            );

            setHiddenSeries(hidden);
          },
        }}
      />
    </div>
  );
};

export default ColumnGraph;