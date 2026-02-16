import React, { useEffect, useRef, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCExporting from "highcharts/modules/exporting";
import HCExportData from "highcharts/modules/export-data";


const initModule = (m: any) => {
  const fn = m && typeof m === "object" && "default" in m ? m.default : m;
  if (typeof fn === "function") fn(Highcharts);
};
initModule(HCExporting);
initModule(HCExportData);

interface ExportFunction { exportPNG: () => void; exportCSV: () => void; }
interface LineChartProps {
  apiData?: Highcharts.SeriesOptionsType[]; height?: number | string; bg?: string;
  legendHeight?: number; xAxisInterval?: number | "auto"; props?: Highcharts.Options;
  isFullscreen?: boolean; onExportReady?: (functions: ExportFunction) => void;
}

const LineChart = React.forwardRef<HighchartsReact.RefObject, LineChartProps>(
  ({ apiData = [], height = 240, xAxisInterval = "auto", legendHeight = 45, bg, props, isFullscreen = false, onExportReady }, ref) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    useEffect(() => { if (ref && typeof ref === "object") (ref as any).current = chartRef.current; }, [ref]);

    const bgColor = bg || useColorModeValue("white", "#131512");
    const textColor = useColorModeValue("#062D59", "rgba(255,255,255,0.92)");
    const gridColor = useColorModeValue("#DFDFDF", "rgba(255,255,255,0.12)");
    const tooltipBG = useColorModeValue("rgba(255,255,255,0.95)", "rgba(20,26,34,0.95)");
    const borderColor = useColorModeValue("#DFDFDF", "rgba(255,255,255,0.08)");

    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
      chart: {
        backgroundColor: bgColor,
        height,
        zooming: { type: "x" },
        style: { fontFamily: "Montserrat, sans-serif", color: textColor },
        plotBorderWidth: 1,
        plotBorderColor: gridColor,
        className: "dashed-border",
      },
      title: { text: "" },
      xAxis: {
        type: "datetime",
        crosshair: true,
        tickInterval: xAxisInterval === "auto" ? undefined : (xAxisInterval as number),
        labels: { enabled: true, style: { color: textColor, fontSize: "12px" } },
        dateTimeLabelFormats: { month: "%b %y", year: "%Y" },
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: gridColor,
      },
      yAxis: {
        title: { text: "" },
        crosshair: true,
        labels: { enabled: true, style: { color: textColor, fontSize: "12px" } },
        tickAmount: isFullscreen ? 10 : 6,
        gridLineWidth: 1,
        gridLineColor: gridColor,
      },
      tooltip: { shared: true, backgroundColor: tooltipBG, borderColor, style: { color: textColor } },
      series: apiData,
      credits: { enabled: false },
      plotOptions: { series: { dataLabels: { enabled: true, style: { color: textColor, fontSize: "12px" } } } },
      legend: {
        maxHeight: legendHeight,
        useHTML: true,
        itemStyle: { overflow: "auto", color: textColor, fontSize: "12px" },
        symbolHeight: 0,
        symbolWidth: 0,
        labelFormatter: function (this: any) {
          const color = this.color ?? this.series?.color ?? "#999";
          const name = this.name ?? this.series?.name ?? "";
          return `<span style="display:inline-block;">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle opacity="0.25" cx="8" cy="11" r="8" fill="${color}"/>
                <circle cx="8" cy="11" r="3.5" fill="${color}" stroke="white"/>
              </svg>
            </span> ${name}`;
        },
        navigation: { enabled: true },
      },
      exporting: { enabled: true, buttons: { contextButton: { enabled: false } } },
    });

    useEffect(() => {
      setChartOptions(prev => ({
        ...prev,
        series: apiData,
        ...(props || {}),
        chart: {
          ...(prev.chart as Highcharts.ChartOptions),
          ...(props?.chart as Highcharts.ChartOptions),
          backgroundColor: bgColor,
          height: props?.chart?.height ?? height,
          zooming: { type: "x", ...(props?.chart as any)?.zooming },
          style: { ...(prev.chart as any).style, color: textColor },
          plotBorderColor: gridColor,
        },
        xAxis: {
          ...(prev.xAxis as Highcharts.XAxisOptions),
          ...(props?.xAxis as Highcharts.XAxisOptions),
          tickInterval: xAxisInterval === "auto" ? undefined : (xAxisInterval as number),
          gridLineWidth: 1,
          gridLineDashStyle: (props?.xAxis as Highcharts.XAxisOptions | undefined)?.gridLineDashStyle ?? "Dash",
          gridLineColor: gridColor,
          labels: { ...(prev.xAxis as any).labels, style: { ...((prev.xAxis as any).labels?.style || {}), color: textColor } },
        },
        yAxis: {
          ...(prev.yAxis as Highcharts.YAxisOptions),
          ...(props?.yAxis as Highcharts.YAxisOptions),
          tickAmount: isFullscreen ? 10 : 6,
          gridLineWidth: 1,
          gridLineDashStyle: (props?.yAxis as Highcharts.YAxisOptions | undefined)?.gridLineDashStyle ?? "Dash",
          gridLineColor: gridColor,
          labels: { ...(prev.yAxis as any).labels, style: { ...((prev.yAxis as any).labels?.style || {}), color: textColor } },
        },
        tooltip: { ...(prev.tooltip as any), backgroundColor: tooltipBG, borderColor, style: { color: textColor } },
        plotOptions: {
          ...(prev.plotOptions as any),
          series: {
            ...((prev.plotOptions as any)?.series || {}),
            dataLabels: { enabled: true, style: { color: textColor, fontSize: "12px" } },
          },
        },
        legend: {
          ...(prev.legend as Highcharts.LegendOptions),
          itemStyle: { overflow: "auto", color: textColor, fontSize: "12px" },
        },
      }));
    }, [apiData, props, height, bgColor, textColor, gridColor, tooltipBG, borderColor, xAxisInterval, isFullscreen]);

    const exportPNG = () => chartRef.current?.chart.exportChart({ type: "image/png", filename: "chart-png" }, {});
    const exportCSV = () => chartRef.current?.chart.downloadCSV();
    useEffect(() => { onExportReady?.({ exportPNG, exportCSV }); }, [onExportReady]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />;
  }
);
export default LineChart;
