import React, { useEffect, useRef, useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';


interface ExportFunction { exportPNG: () => void; exportCSV: () => void; }

interface AreaSplineChartProps {
  apiData?: Object[];
  height?: number | string;
  bg?: string;
  legendHeight?: number;
  props?: any;
  isFullscreen?: boolean;
  onExportReady?: (functions: ExportFunction) => void;
  inFullScreen?: (mode: boolean) => void;
}

exporting(Highcharts);
exportData(Highcharts);

const AreaSplineChart = React.forwardRef<HighchartsReact.RefObject, AreaSplineChartProps>(
  ({ apiData, height = '300px', legendHeight = 50, bg, props, isFullscreen = false, inFullScreen, onExportReady }, ref) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);

    // Dark / Light tokens
    const bgColor = bg || useColorModeValue('white', '#131512');
    const textColor = useColorModeValue('#062D59', 'rgba(255,255,255,0.92)');
    const gridColor = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.12)');
    const axisLine = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.25)');
    const tooltipBG = useColorModeValue('rgba(255,255,255,0.95)', 'rgba(20,26,34,0.95)');
    const borderColor = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.08)');

    const [chartOption, setChartOptions] = useState<any>({
      chart: {
        type: 'areaspline',
        height,
        zoomType: 'x',
        backgroundColor: bgColor,
        style: { fontFamily: 'Montserrat, sans-serif', color: textColor },
        plotBorderWidth: 1,
        plotBorderColor: borderColor,
        plotBorderDashStyle: 'Dash',
        className: 'dashed-border',
      },
      title: { text: '' },
      xAxis: {
        type: 'datetime',
        gridLineDashStyle: 'Dash',
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: gridColor,
        lineColor: axisLine,
        labels: { style: { fontFamily: 'Montserrat, sans-serif', color: textColor } },
      },
      yAxis: {
        title: { text: '' },
        gridLineDashStyle: 'Dash',
        gridLineWidth: 1,
        gridLineColor: gridColor,
        tickAmount: !isFullscreen ? 6 : 8,
        labels: { style: { fontFamily: 'Montserrat, sans-serif', color: textColor } },
      },
      tooltip: {
        shared: true,
        backgroundColor: tooltipBG,
        borderColor,
        style: { color: textColor },
        formatter: function (this: any) {
          const formattedDate = Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x);
          const points = this.points.map((p: any) =>
            `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b>`
          );
          return `<b>${formattedDate}</b><br/>${points.join('<br/>')}`;
        },
      },
      series: [] as Object[],
      legend: {
        maxHeight: legendHeight,
        useHTML: true,
        itemStyle: { overflow: 'auto', color: textColor, fontSize: '12px' },
        symbolHeight: 0,
        symbolWidth: 0,
        labelFormatter: function (this: any) {
          return `<span style="display:inline-block;">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle opacity="0.25" cx="8" cy="11" r="8" fill="${this.color}"/>
                <circle cx="8" cy="11" r="3.5" fill="${this.color}" stroke="white"/>
              </svg>
            </span> ${this.name}`;
        },
        navigation: { enabled: true },
      },
      credits: { enabled: false },
      exporting: { enabled: true, buttons: { contextButton: { enabled: false } } },
    });

    useEffect(() => {
      if (inFullScreen) inFullScreen(isFullscreen);
      setChartOptions((prev: any) => ({
        ...prev,
        chart: { ...prev.chart, height },
      }));
    }, [isFullscreen, height]);

    useEffect(() => {
      setChartOptions((prev: any) => ({
        ...prev,
        chart: { ...prev.chart, backgroundColor: bgColor, plotBorderColor: borderColor, style: { ...prev.chart.style, color: textColor } },
        xAxis: { ...prev.xAxis, gridLineColor: gridColor, lineColor: axisLine, labels: { ...prev.xAxis.labels, style: { ...prev.xAxis.labels.style, color: textColor } } },
        yAxis: { ...prev.yAxis, gridLineColor: gridColor, labels: { ...prev.yAxis.labels, style: { ...prev.yAxis.labels.style, color: textColor } } },
        tooltip: { ...prev.tooltip, backgroundColor: tooltipBG, borderColor },
      }));
    }, [bgColor, textColor, gridColor, axisLine, tooltipBG, borderColor]);

    useEffect(() => {
      setChartOptions((prev: any) => ({ ...prev, series: apiData || [{}], ...(props || {}) }));
    }, [apiData, props]);

    const exportPNG = () => chartRef.current?.chart.exportChart({ type: 'image/png', filename: 'chart-png' }, {});
    const exportCSV = () => chartRef.current?.chart.downloadCSV();

    useEffect(() => { onExportReady?.({ exportPNG, exportCSV }); }, [onExportReady]);

    return <HighchartsReact highcharts={Highcharts} options={chartOption} ref={ref || chartRef} />;
  }
);

export default AreaSplineChart;
