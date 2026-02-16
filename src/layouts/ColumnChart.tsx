import React, { useEffect, useRef, useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import Highcharts from 'highcharts';
// @ts-ignore
import Highcharts3D from 'highcharts/highcharts-3d';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import HighchartsFullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';


try { (Highcharts3D as any)(Highcharts); } catch { (Highcharts3D as any).default?.(Highcharts); }
try { (HighchartsFullScreen as any)(Highcharts); } catch { (HighchartsFullScreen as any).default?.(Highcharts); }
try { (exporting as any)(Highcharts); } catch { (exporting as any).default?.(Highcharts); }
try { (exportData as any)(Highcharts); } catch { (exportData as any).default?.(Highcharts); }

interface ExportFunction { exportPNG: () => void; exportCSV: () => void; }
interface ColumnChartProps {
  apiData?: Object[]; height?: Number | string; bg?: string; category?: string[];
  legendHeight?: number; xAxisInterval?: number | string; props?: any;
  isFullscreen?: boolean; onExportReady?: (f: ExportFunction) => void; inFullScreen?: (m: boolean) => void;
}

const ColumnChart: React.FC<ColumnChartProps> = ({
  apiData, height = 280, bg, category, legendHeight = 40, xAxisInterval = 'auto', props, isFullscreen = false, inFullScreen, onExportReady,
}) => {
  const chartRef = useRef<any>(null);

  const bgColor = bg || useColorModeValue('white', '#131512');
  const textColor = useColorModeValue('#062D59', 'rgba(255,255,255,0.92)');
  const gridColor = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.12)');
  const axisLine = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.25)');

  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      type: 'column',
      backgroundColor: bgColor,
      height,
      style: { fontFamily: 'Montserrat, sans-serif', color: textColor },
      plotBorderWidth: 1,
      plotBorderColor: gridColor,
      plotBorderDashStyle: 'Dash',
      className: 'dashed-border',
    },
    title: { text: null },
    series: [] as Object[],
    plotOptions: { column: { dataLabels: { enabled: false }, pointWidth: 7, pointPadding: 0, borderRadius: 0 } },
    legend: {
      enabled: true, align: 'center', verticalAlign: 'bottom', useHTML: true,
      symbolHeight: 0, symbolWidth: 0, maxHeight: legendHeight,
      itemStyle: { overflow: 'auto', color: textColor, fontSize: '12px' },
      labelFormatter: function (this: any) {
        return `<span style="width:10px;height:10px;display:inline-block;background-color:${this.color};border-radius:0;"></span> ${this.name}`;
      },
    },
    tooltip: {
      shared: true,
      backgroundColor: useColorModeValue('rgba(255,255,255,0.95)', 'rgba(20,26,34,0.95)'),
      borderColor: useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.08)'),
      style: { color: textColor },
      formatter: function (this: any) {
        const points = this.points.map((p: any) => `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b>`);
        return points.join('<br/>');
      },
    },
    xAxis: {
      type: 'datetime',
      labels: { enabled: true, style: { color: textColor, fontSize: '14px' } },
      tickInterval: xAxisInterval,
      gridLineDashStyle: 'Dash',
      gridLineWidth: 1,
      tickLength: 0,
      gridLineColor: gridColor,
      lineColor: axisLine,
      dateTimeLabelFormats: { month: '%b %y', year: '%Y' },
    },
    yAxis: {
      title: { text: null },
      className: 'dashed-border',
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      tickAmount: !isFullscreen ? 6 : 10,
      lineWidth: 2,
      gridLineColor: gridColor,
      lineColor: axisLine,
      labels: { style: { color: textColor, fontSize: '14px' } },
    },
    exporting: { enabled: false },
    credits: { enabled: false },
  });

  useEffect(() => { inFullScreen?.(isFullscreen); }, [isFullscreen]);

  useEffect(() => {
    setChartOptions((prev: any) => ({
      ...prev,
      chart: { ...prev.chart, backgroundColor: bgColor, height, plotBorderColor: gridColor, style: { ...prev.chart.style, color: textColor } },
      xAxis: { ...prev.xAxis, gridLineColor: gridColor, lineColor: axisLine, labels: { ...prev.xAxis.labels, style: { ...prev.xAxis.labels.style, color: textColor } } },
      yAxis: { ...prev.yAxis, gridLineColor: gridColor, lineColor: axisLine, labels: { ...prev.yAxis.labels, style: { ...prev.yAxis.labels.style, color: textColor } }, tickAmount: !isFullscreen ? 6 : 10 },
      tooltip: { ...prev.tooltip, style: { ...(prev.tooltip?.style || {}), color: textColor } },
    }));
  }, [bgColor, textColor, gridColor, axisLine, height, isFullscreen]);

  useEffect(() => {
    if (apiData) {
      setChartOptions((prev: any) => ({ ...prev, series: apiData, ...(props || {}) }));
      if (category) setChartOptions((prev: any) => ({ ...prev, xAxis: { ...prev.xAxis, categories: category } }));
    }
  }, [apiData, category, props]);

  const exportPNG = () => chartRef.current?.chart.exportChart({ type: 'image/png', filename: 'chart-png' }, {});
  const exportCSV = () => chartRef.current?.chart.downloadCSV();
  useEffect(() => { onExportReady?.({ exportPNG, exportCSV }); }, [onExportReady]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />;
};
export default ColumnChart;
