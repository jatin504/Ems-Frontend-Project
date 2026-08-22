import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";

import {
  LineChart,
} from "echarts/charts";

import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
} from "echarts/components";

import {
  CanvasRenderer,
} from "echarts/renderers";

import { Box } from "@chakra-ui/react";

import { EnlargeHeight } from "../../../Services/EnlargeWidget";
import type { ExportFunctions } from "../../../types/graphExport/export";

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

interface SplineGraphProps {
  apiData?: any[];
  height?: number | string;
  bg?: string;
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  onExportReady?: (functions: ExportFunctions) => void;
  inFullScreen?: (mode: boolean) => void;
}

const SplineGraph = forwardRef<any, SplineGraphProps>(
  (
    {
      apiData = [],
      height = 240,
      bg = "transparent",
      legendHeight = 45,
      xAxisInterval,
      props = {},
      isFullscreen = false,
      onExportReady,
      inFullScreen,
    },
    ref
  ) => {

  const chartRef = useRef<ReactECharts>(null);

const [isDark,setIsDark]=useState(false);

const [selectedSeries,setSelectedSeries]=useState<number|null>(null);


useEffect(() => {
  const detectTheme = () => {
    // detectTheme
    setIsDark(
      localStorage.getItem("chakra-ui-color-mode") === "dark"
    );
  };

  detectTheme();

  window.addEventListener("storage", detectTheme);

  return () => {
    // cleanup Effect 1
    window.removeEventListener("storage", detectTheme);
  };
}, []);

useEffect(() => {
  // height and fullscreen logs removed
  inFullScreen?.(isFullscreen);
  requestAnimationFrame(() => {
    chartRef.current
      ?.getEchartsInstance()
      ?.resize();
  });
}, [height, isFullscreen]);

const axisColor=isDark?"#E6E6E6":"#1A202C";

const gridColor=isDark
?"rgba(255,255,255,.08)"
:"rgba(0,0,0,.10)";

const lineColor=isDark
?"rgba(255,255,255,.06)"
:"rgba(0,0,0,.16)";

const tooltipBg=isDark
?"rgba(24,24,27,.95)"
:"#ffffff";

/* ---------- HIGHCHARTS -> ECHARTS ADAPTER ---------- */

const option=useMemo(()=>{

const xAxisProps=props?.xAxis||{};
const plotBands = xAxisProps.plotBands || [];
const yAxisProps = Array.isArray(props?.yAxis)
  ? props.yAxis
  : [props?.yAxis || {}];
const tooltipProps=props?.tooltip||{};
const minimumLeftSpacing = 10;
const gridLeft = Math.max(
  Number(props?.chart?.spacingLeft ?? minimumLeftSpacing),
  minimumLeftSpacing
);

return{

backgroundColor:bg,

animation:false,

grid:{
  top: props?.chart?.spacingTop ?? 20,
  left: gridLeft,
  right: props?.chart?.spacingRight ?? 20,
  bottom: props?.chart?.spacingBottom ?? (legendHeight + 5),

  containLabel: true,
},

legend: {
  show: true,
  type: "scroll",
  selectedMode: true,
  bottom: 2,
},

  tooltip: {
  trigger: "axis",

  confine: false,

  appendToBody: false,

  backgroundColor:
    tooltipProps.backgroundColor || tooltipBg,

  borderWidth: 1,

  padding: [6, 8],

  textStyle: {
    color: tooltipProps.style?.color || axisColor,
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
    type: "cross",
  },
  formatter: (params: any) => {
    if (!Array.isArray(params) || !params.length) return "";

    if (typeof tooltipProps.formatter === "function") {
      const context = {
        x: params[0].value[0],
        points: params.map((item: any) => ({
          color: item.color,
          y: Array.isArray(item.value) ? item.value[1] : item.value,
          series: { name: item.seriesName },
        })),
      };
      return tooltipProps.formatter.call(context);
    }

    const ts = params[0].value[0];

    const date = new Date(ts);

    const pad = (n: number) => String(n).padStart(2, "0");

    const time =
      `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
      `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;

    let html = `<b>${time}</b><br/>`;
    const valueSuffix = tooltipProps.valueSuffix || "";

    params.forEach((item: any) => {
      const rawValue = item.value?.[1];
      const value =
        typeof rawValue === "number"
          ? `${rawValue.toFixed(2)}${valueSuffix}`
          : rawValue;

      html += `
        <div style="display:flex;justify-content:space-between;gap:12px;">
          <span>${item.marker} ${item.seriesName}</span>
          <b>${value}</b>
        </div>
      `;
    });

    return html;
  },
},

xAxis:{
type:"time",
useUTC:true,

min:xAxisProps.min,

max:xAxisProps.max,

interval:xAxisProps.tickInterval ?? xAxisInterval,

axisLabel:{
color:
xAxisProps.labels?.style?.color || axisColor,
formatter: (value: number) => {
  console.log(
    "Axis Label:",
    value,
    new Date(value).toISOString(),
    new Date(value).toLocaleString()
  );

  return echarts.time.format(value, "{HH}:{mm}", true);
},
},

axisLine:{
lineStyle:{
color:
xAxisProps.lineColor || lineColor
}
},

splitLine:{
show:true,

lineStyle:{
color:
xAxisProps.gridLineColor || gridColor,

type:"dashed"
}
}
},

yAxis: yAxisProps.map((axis: any) => ({
      type: "value",

      min: axis.min,
      max: axis.max,
      interval: axis.tickInterval,

      position: axis.opposite ? "right" : "left",

      name: axis.title?.text,

      nameLocation: "middle",
      nameGap: 34,

      axisLabel: {
        color: axis.labels?.style?.color || axisColor,
        margin: 6,
        formatter: (v: any) => {
          if (typeof axis.labels?.formatter === "function") {
            return axis.labels.formatter.call({ value: v });
          }
          return v;
        },
      },

      axisLine: {
        show: true,
        lineStyle: {
          color: axis.lineColor || lineColor,
        },
      },

      splitLine: {
        show: !axis.opposite,
        lineStyle: {
          color: axis.gridLineColor || gridColor,
          type: "dashed",
        },
      },
    })),
series: (apiData || []).map((series: any, index: number) => ({

    name: series.name,

    type: "line",

    smooth: true,

    showSymbol: false,

    symbol: "circle",

    sampling: "lttb",

    progressive: 5000,

    progressiveThreshold: 10000,

    animation: false,

    connectNulls: true,

    emphasis: {
        focus: "series"
    },

    blur: {
        lineStyle: {
            opacity: .2
        }
    },

    lineStyle: {
        width: 2,
        opacity:
            selectedSeries === null
                ? 1
                : selectedSeries === index
                ? 1
                : .2
    },

    itemStyle: {
        color: series.color
    },

    yAxisIndex: series.yAxis ?? 0,
    data: series.data,
    markArea:
      index === 0 && plotBands.length
        ? {
            silent: true,
            data: plotBands.map((band: any) => [
              {
                xAxis: band.from,
                name: band.label?.text,
                label: {
                  show: true,
                  formatter: band.label?.text,
                  position: "insideTop",
                  color: band.label?.style?.color,
                  fontWeight: "bold",
                },
                itemStyle: {
                  color: band.color,
                },
              },
              {
                xAxis: band.to,
              },
            ]),
          }
        : undefined,

}))

};

},[
apiData,
props,
selectedSeries,
isDark,
height,
legendHeight,
isFullscreen
]);

/* ------------------- EVENTS ------------------- */

useEffect(() => {
  const chart = chartRef.current?.getEchartsInstance();
  if (!chart) {
    return;
  }
  const mouseOver = (params: any) => {
    // mouseover
    if (params.componentType !== "series") return;
    setSelectedSeries(params.seriesIndex);
  };
  const globalOut = () => {
    // globalOut
    setSelectedSeries(null);
  };
  chart.on("mouseover", mouseOver);
  chart.getZr().on("globalout", globalOut);
  return () => {
    if (chart.isDisposed()) return;
    chart.off("mouseover", mouseOver);
    chart.getZr()?.off("globalout", globalOut);
  };
}, [apiData]);

/* ------------------- EXPORT ------------------- */
// Export registration moved to onChartReady to avoid repeated ref updates

return (
  <Box position="relative" width="100%" height="100%">

    {/* <Button
      size="xs"
      variant="ghost"
      position="absolute"
      left={`${legendOffset}px`}
      bottom={`-${buttonOffset}px`}
      zIndex={10}
      onClick={handleShowAll}
      isDisabled={!areAllHidden}
      sx={{
        mb: `${legendHeight}px`
      }}
    >
      Show all
    </Button>

    <Button
      size="xs"
      variant="ghost"
      position="absolute"
      right={`${legendOffset}px`}
      bottom={`-${buttonOffset}px`}
      zIndex={10}
      onClick={handleHideAll}
      isDisabled={areAllHidden}
      sx={{
        mb: `${legendHeight}px`
      }}
    >
      Hide all
    </Button> */}

    <ReactECharts
      ref={chartRef}
      echarts={echarts}
      option={option}
      notMerge={false}
      lazyUpdate={false}
      style={{
        width: "100%",
        height: isFullscreen
          ? EnlargeHeight(770)
          : Number(height)
      }}
      onChartReady={(chart) => {
        if (typeof ref === "function") {
          ref(chart);
        } else if (ref) {
          (ref as any).current = chart;
        }

        if (onExportReady) {
          onExportReady({
            exportPNG: () => {
              const url = chart.getDataURL({
                type: "png",
                pixelRatio: 2,
                backgroundColor: "#fff",
              });
              const a = document.createElement("a");
              a.href = url;
              a.download = "chart.png";
              a.click();
            },
            exportCSV: () => {
              let csv = "Timestamp";
              (apiData || []).forEach((s: any) => {
                csv += `,${s.name}`;
              });

              csv += "\n";

              const max = Math.max(
                ...(apiData || []).map((s: any) => s.data.length),
                0
              );

              for (let i = 0; i < max; i++) {
                let row = "";
                const ts = apiData?.[0]?.data?.[i]?.[0];
                row += ts ? new Date(ts).toLocaleString() : "";

                (apiData || []).forEach((s: any) => {
                  row += "," + (s.data?.[i]?.[1] ?? "");
                });

                csv += row + "\n";
              }

              const blob = new Blob([csv], { type: "text/csv" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "chart.csv";
              link.click();
            },
          });
        }

        requestAnimationFrame(() => {
          if (!chart.isDisposed()) {
            chart.resize();
          }
        });
      }}
    />

  </Box>
);

});

SplineGraph.displayName = "SplineGraph";

export default React.memo(SplineGraph);