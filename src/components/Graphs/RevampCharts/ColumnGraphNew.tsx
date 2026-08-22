import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";

import * as echarts from "echarts/core";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  DataZoomComponent,
  ToolboxComponent,
} from "echarts/components";

import { BarChart, LineChart } from "echarts/charts";

import { CanvasRenderer } from "echarts/renderers";

import { Button } from "@chakra-ui/react";

import "../../../App.css";
import type { ExportFunctions } from "../../../types/graphExport/export";
import { EnlargeHeight } from "../../../Services/EnlargeWidget";

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  DataZoomComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

interface ColumnGraphProps {
  apiData?: any[];
  height?: number | string;
  bg?: string;
  category?: string[];
  legendHeight?: number;
  xAxisInterval?: number | string;
  isFullscreen?: boolean;
  onExportReady?: (functions: ExportFunctions) => void;
  inFullScreen?: (mode: boolean) => void;
  axisLabelColor?: string;
  gridColor?: string;
  lineColor?: string;
  tooltipBg?: string;
  tooltipColor?: string;
  legendColor?: string;
  stacked?: boolean;
  barWidth?: number;
  barCategoryGap?: string;
  barGap?: string;
  borderRadius?: number;
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({
  apiData,
  height = 280,
  bg,
  category,
  legendHeight = 40,
  xAxisInterval = "auto",
  isFullscreen = false,
  onExportReady,
  inFullScreen,
  axisLabelColor: axisLabelColorProp,
  gridColor: gridColorProp,
  lineColor: lineColorProp,
  tooltipBg: tooltipBgProp,
  tooltipColor: tooltipColorProp,
  legendColor: legendColorProp,
  stacked = false,
  barWidth = 14,
  barCategoryGap = "15%",
  barGap = "0%",
  borderRadius = 0,
}) => {
  const chartRef = useRef<ReactECharts>(null);

  const [isDark, setIsDark] = useState(false);

  // Detect Chakra Theme
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
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      window.removeEventListener("storage", detectTheme);
      observer.disconnect();
    };
  }, []);

  const axisLabelColor = axisLabelColorProp ?? (isDark ? "#E6E6E6" : "#1A202C");
  const gridColor = gridColorProp ?? (isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.10)");
  const lineColor = lineColorProp ?? (isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.15)");
  const legendColor = legendColorProp ?? (isDark ? "#E6E6E6" : "#1A202C");
  const tooltipBg = tooltipBgProp ?? (isDark ? "rgba(24,24,27,.96)" : "#fff");
  const tooltipColor = tooltipColorProp ?? (isDark ? "#fff" : "#1A202C");

  const chartHeight = isFullscreen ? "calc(100vh - 70px)" : Number(height);

  useEffect(() => {
    inFullScreen?.(isFullscreen);
    requestAnimationFrame(() => {
      const chart = chartRef.current?.getEchartsInstance();
      if (chart && !chart.isDisposed()) {
        chart.resize({
          animation: false,
        });
      }
    });
  }, [isFullscreen]);

  // Show All / Hide All
  const [areAllHidden, setAreAllHidden] = useState(false);

  const handleHideAll = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (!instance) return;

    const option: any = instance.getOption();

    option.legend[0].selected = {};

    option.series.forEach((s: any) => {
      option.legend[0].selected[s.name] = false;
    });

    instance.setOption(option, true);

    setAreAllHidden(true);
  };

  const handleShowAll = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (!instance) return;

    const option: any = instance.getOption();

    option.legend[0].selected = {};

    option.series.forEach((s: any) => {
      option.legend[0].selected[s.name] = true;
    });

    instance.setOption(option, true);

    setAreAllHidden(false);
  };
    const option = useMemo(() => {
    const isCategory = !!category?.length;
    const hasTimeSeriesData = (apiData || []).some((series: any) => {
      const data = Array.isArray(series?.data) ? series.data : [];
      return data.some((point: any) => Array.isArray(point) && typeof point[0] === "number");
    });

    const derivedCategories = isCategory
      ? category
      : hasTimeSeriesData && Array.isArray(apiData?.[0]?.data)
        ? apiData[0].data.map((point: any) => {
            const ts = Array.isArray(point) ? point[0] : undefined;
            if (typeof ts !== "number") return "";
            const date = new Date(ts);
            return `${String(date.getDate()).padStart(2, "0")}`;
          })
        : undefined;

    const normalizedSeries = (apiData || []).map((series: any) => ({
      ...series,
      data: Array.isArray(series?.data)
        ? series.data.map((point: any) => {
            if (Array.isArray(point)) {
              return point[1];
            }
            return point;
          })
        : [],
    }));

    return {
      backgroundColor: bg || "transparent",

      animation: false,

      grid: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 35,
        containLabel: true,
        borderWidth: 1,
        borderColor: "#DFDFDF",
      },

      legend: {
        type: "scroll",
        bottom: 5,
        icon: "rect",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: legendColor,
          fontSize: 12,
          fontFamily: "Montserrat",
        },
      },

      tooltip: {
        trigger: "axis",
        confine: false,
        appendToBody: false,
        backgroundColor: tooltipBg,
        borderWidth: 1,
        padding: [6, 8],
        textStyle: {
          color: tooltipColor,
          fontSize: 11,
          lineHeight: 16,
        },
        extraCssText: `
          z-index:999999;
          font-size:11px;
          line-height:16px;
          padding:6px 8px;
          min-width:140px;
          max-width:220px;
        `,
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          if (!Array.isArray(params) || !params.length) {
            return "";
          }
          const axisValue = params[0]?.axisValue;
          let html = `<b>${axisValue ?? ""}</b><br/>`;
          params.forEach((item: any) => {
            const rawValue = Array.isArray(item.value) ? item.value[1] : item.value;
            const value =
              typeof rawValue === "number" ? rawValue.toFixed(2) : rawValue ?? "";
            html += `
              <div style="
                display:flex;
                justify-content:space-between;
                gap:12px;
              ">
                <span>
                  ${item.marker} ${item.seriesName}
                </span>
                <b>${value}</b>
              </div>
            `;
          });
          return html;
        },
      },

      xAxis: {
        type: isCategory || hasTimeSeriesData ? "category" : "time",

        data: derivedCategories,

        boundaryGap: ["5%", "5%"],

        axisLine: {
          lineStyle: {
            color: lineColor,
          },
        },

        axisTick: {
          show: true,
          alignWithLabel: true,
        },

        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: gridColor,
          },
        },

        axisLabel: {
          color: axisLabelColor,
          fontSize: 12,

          hideOverlap: true,
        },

        ...(xAxisInterval !== "auto"
          ? {
              interval: xAxisInterval,
            }
          : {}),
      },

      yAxis: [
        {
          type: "value",

          position: "left",

          splitNumber: isFullscreen ? 10 : 6,

          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              width: 2,
            },
          },

          axisLabel: {
            color: axisLabelColor,
            fontSize: 12,
          },

          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: gridColor,
            },
          },
        },

        {
          type: "value",

          position: "right",

          splitNumber: isFullscreen ? 10 : 6,

          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              width: 2,
            },
          },

          axisLabel: {
            color: axisLabelColor,
            fontSize: 12,
          },

          splitLine: {
            show: false,
          },
        },
      ],

      series: normalizedSeries.map((series: any) => ({
        ...series,

        type: series.type === "spline" ? "line" : "bar",

        yAxisIndex: series.yAxis ?? 0,

        smooth: series.type === "spline",
        showSymbol: false,
        connectNulls: true,
        lineStyle:
          series.type === "spline"
            ? {
                width: series.lineWidth ?? 2,
              }
            : undefined,
        itemStyle: {
          color: series.color,
          borderRadius: 0,
        },

        ...(series.type !== "spline"
          ? {
              barWidth,
              barGap,
              barCategoryGap,
              stack: stacked ? (series.stack || "stack") : undefined,
            }
          : {}),

        emphasis: {
          focus: "series",
        },
      })),

    };
  }, [
    apiData,
    category,
    bg,
    legendHeight,
    isDark,
    xAxisInterval,
    axisLabelColor,
    gridColor,
    lineColor,
    tooltipBg,
    tooltipColor,
    legendColor,
  ]);

  // -------------------------------
  // Export PNG
  // -------------------------------
  const exportPNG = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;

    const url = chart.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: bg || "#ffffff",
    });

    const link = document.createElement("a");
    link.href = url;
    link.download = "chart-png.png";
    link.click();
  };

  // -------------------------------
  // Export CSV
  // -------------------------------
  const exportCSV = () => {
    if (!apiData?.length) return;

    const rows: string[] = [];

    const header = ["Category"];

    apiData.forEach((s: any) => header.push(s.name));

    rows.push(header.join(","));

    const len =
      apiData[0]?.data?.length || 0;

    for (let i = 0; i < len; i++) {
      const row: any[] = [];

      row.push(category?.[i] ?? i);

      apiData.forEach((s: any) => {
        let value = s.data?.[i];

        if (Array.isArray(value)) {
          value = value[1];
        }

        row.push(value ?? "");
      });

      rows.push(row.join(","));
    }

    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "chart.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  // -------------------------------
  // Parent Export Functions
  // -------------------------------
  useEffect(() => {
    if (!onExportReady) return;

    onExportReady({
      exportPNG,
      exportCSV,
    });
  }, [onExportReady, apiData]);

  return (
    <div style={{ position: "relative" }}>
      <Button
        size="xs"
        variant="ghost"
        position="absolute"
        left="12px"
        bottom="-40px"
        zIndex={2}
        onClick={handleShowAll}
        isDisabled={areAllHidden === false}
      >
        Show all
      </Button>

      <Button
        size="xs"
        variant="ghost"
        position="absolute"
        right="12px"
        bottom="-40px"
        zIndex={2}
        onClick={handleHideAll}
        isDisabled={areAllHidden}
      >
        Hide all
      </Button>

      <ReactECharts
        ref={chartRef}
        echarts={echarts}
        option={option}
        notMerge={false}
        lazyUpdate={true}
        style={{
          width: "100%",
          height: chartHeight,
        }}
      />
    </div>
  );
};

export default ColumnGraph;