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
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { Button } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../types/graphExport/export";

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  DataZoomComponent,
  ToolboxComponent,
  LineChart,
  CanvasRenderer,
]);

interface AreaSplineGraphProps {
  apiData?: any[];
  height?: number | string;
  bg?: string;
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  onExportReady?: (functions: ExportFunctions) => void;
  axisLabelColor?: string;
  gridColor?: string;
  lineColor?: string;
  tooltipBg?: string;
  tooltipColor?: string;
  legendColor?: string;
}

const AreaspineGraph: React.FC<AreaSplineGraphProps> = ({
  apiData = [],
  height = 240,
  bg,
  xAxisInterval = "auto",
  legendHeight = 40,
  props,
  onExportReady,
  axisLabelColor,
  gridColor,
  lineColor,
  tooltipBg,
  tooltipColor,
  legendColor,
  isFullscreen = false,
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
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      window.removeEventListener("storage", detectTheme);
      observer.disconnect();
    };
  }, []);

  const resolvedAxisLabelColor = axisLabelColor ?? (isDark ? "#E6E6E6" : "#1A202C");
  const resolvedGridColor = gridColor ?? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)");
  const resolvedLineColor = lineColor ?? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.15)");
  const resolvedLegendColor = legendColor ?? (isDark ? "#E6E6E6" : "#1A202C");
  const resolvedTooltipBg = tooltipBg ?? (isDark ? "rgba(24,24,27,0.95)" : "#fff");
  const resolvedTooltipColor = tooltipColor ?? (isDark ? "#fff" : "#1A202C");

  const option = useMemo(() => {
    const normalizedSeries = (apiData || []).map((series: any) => {
      const color = series.color || "#6DA2FF";
      return {
        ...series,
        type: "line",
        smooth: true,
        data: Array.isArray(series?.data) ? series.data : [],
        showSymbol: false,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: {
          width: 2,
          color: color,
        },
        itemStyle: {
          color: color,
        },
        areaStyle: {
          color: "rgba(109, 162, 255, 0.35)",
          opacity: 1,
        },
        emphasis: {
          focus: "series",
        },
        z: 2,
      };
    });

    return {
      backgroundColor: bg || "transparent",
      animation: false,
      grid: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 35 + (legendHeight || 0) / 2,
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
          color: resolvedLegendColor,
          fontSize: 12,
          fontFamily: "Montserrat",
        },
      },
      tooltip: {
        trigger: "axis",
        confine: false,
        appendToBody: false,
        backgroundColor: resolvedTooltipBg,
        borderWidth: 1,
        padding: [6, 8],
        textStyle: {
          color: resolvedTooltipColor,
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
          type: "line",
          snap: true,
          lineStyle: {
            width: 1,
            type: "dashed",
          },
        },
        formatter: (params: any) => {
          if (!params?.length) return "";
          const timestamp = params[0]?.value?.[0];
          if (!timestamp) return "";
          const date = new Date(timestamp);
          const dateText = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const timeText = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          let html = `
            <div style="font-weight:600;margin-bottom:4px;">
              ${dateText} ${timeText}
            </div>
          `;
          params.forEach((item: any) => {
            const value = item?.value?.[1];
            html += `
              <div style="display:flex;align-items:center;gap:6px;">
                <span
                  style="
                    display:inline-block;
                    width:8px;
                    height:8px;
                    border-radius:50%;
                    background:${item.color};
                  "
                ></span>
                <span>${item.seriesName}</span>
                <span style="margin-left:auto;font-weight:600;">
                  ${Number(value).toFixed(2)}
                </span>
              </div>
            `;
          });
          return html;
        },
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        min: props?.xAxis?.min,
        max: props?.xAxis?.max,
        splitNumber: props?.xAxis?.splitNumber ?? 12,
        axisLine: {
          lineStyle: {
            color: resolvedLineColor,
          },
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: resolvedGridColor,
          },
        },
        axisLabel: {
          color: resolvedAxisLabelColor,
          fontSize: 12,
          hideOverlap: true,
          formatter: (value: number) => {
            const date = new Date(value);
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: resolvedLineColor,
            width: 2,
          },
        },
        axisLabel: {
          color: resolvedAxisLabelColor,
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: resolvedGridColor,
          },
        },
        ...((props && props.yAxis) || {}),
      },
      series: normalizedSeries,
    };
  }, [apiData, bg, xAxisInterval, legendHeight, isDark, axisLabelColor, gridColor, lineColor, tooltipBg, tooltipColor, legendColor, props]);

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

  const exportCSV = () => {
    if (!apiData?.length) return;

    const rows: string[] = [];
    const header = ["Category"];

    apiData.forEach((s: any) => header.push(s.name));
    rows.push(header.join(","));

    const len = apiData[0]?.data?.length || 0;
    for (let i = 0; i < len; i++) {
      const row: any[] = [];
      row.push(i);
      apiData.forEach((s: any) => {
        const value = Array.isArray(s.data?.[i]) ? s.data[i][1] : s.data?.[i];
        row.push(value ?? "");
      });
      rows.push(row.join(","));
    }

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    onExportReady?.({
      exportPNG,
      exportCSV,
    });
  }, [onExportReady, apiData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <ReactECharts
        ref={chartRef}
        echarts={echarts}
        option={option}
        notMerge={false}
        lazyUpdate={true}
        style={{
          width: "100%",
          height: isFullscreen ? "calc(100vh - 120px)" : height,
        }}
      />
      <Button
        size="xs"
        variant="ghost"
        position="absolute"
        left="12px"
        bottom="-40px"
        zIndex={2}
      >
        Show all
      </Button>
    </div>
  );
};

export default AreaspineGraph;
