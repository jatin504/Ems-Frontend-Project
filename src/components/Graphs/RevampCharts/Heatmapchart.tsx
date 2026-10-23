import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import HighchartsReact from 'highcharts-react-official';
import { EnlargeHeight } from '../../../Services/EnlargeWidget';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import '../../../App.css';

HighchartsHeatmap(Highcharts);

//  init exporting module
exporting(Highcharts);
exportData(Highcharts);

interface ExportFunction {
    exportPNG: () => void;
    exportCSV: () => void;
}

interface HeatmapChartProps {
    fitContainer?: boolean;
    apiData?: Object[];
    height?: number | string;
    bg?: string;
    legendHeight?: number;
    xAxisInterval?: number | string;
    props?: any;
    isFullscreen?: boolean;
    onExportReady?: (functions: ExportFunction) => void;
    onFullscreenChange?: (isFullscreen: boolean) => void;  // 🔹 NEW
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ 
    fitContainer = false,
    apiData, 
    height = 240, 
    xAxisInterval = "auto", 
    legendHeight = 45, 
    bg, 
    props, 
    isFullscreen = false, 
    onExportReady,
    onFullscreenChange  // 🔹 NEW
}) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreenActive, setIsFullscreenActive] = useState(false);

    const [chartOptions, setChartOptions] = useState({
        chart: {
            backgroundColor: bg || 'transparent',
            height: height,
            type: 'heatmap',
            style: {
                fontFamily: 'Montserrat, sans-serif',
                color: "#062D59"
            },
            plotBorderWidth: 0,
            plotBorderColor: '#DFDFDF',
            plotBorderDashStyle: 'Dash',
            // className: "dashed-border",
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            crosshair: true,
            tickInterval: xAxisInterval,
            labels: {
                enabled: true,
                style: {
                    color: '#062D59',
                    fontSize: '4px'
                },
                title: {
                    text: ''
                },
                dateTimeLabelFormats: {
                    month: '%b %y', // Custom format for months
                    year: '%Y' // Format for years if needed
                },
                tickLength: 0,
            },
            gridLineWidth : 0,
            tickLength: 0,
            // opposite : true
        },
            yAxis: {
                categories: [],
                title: null,
                crosshair: true,
                labels: {
                    enabled: true,
                    style: {
                        color: '#062D59',
                        fontSize: '4px'
                    }
                },
                gridLineWidth : 0
            },
            colorAxis: {
                // min: 0,
                // max : 100,
                minColor: '#FFFFFF',
                maxColor: "#062D59",
            },
            tooltip: {
                formatter: function (this : any) {
                  const time = Highcharts.dateFormat('%H:%M', this.point.x);
                  const inverter = this.series.yAxis.categories[this.point.y];
                  return `<b>${inverter}</b><br>${time}: <b>${this.point.value}</b>`;
                }
              },
            series: [{}],
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
                // floating: true,
                x: 10,
                y: 10,
                itemStyle : {
                    fontSize: "4px"
                }
            },
            credits: {
                enabled: false,
            },
            label: {
                enabled: true,
                style: {
                    color: '#062D59',
                    fontSize: '8px'
                }
            },
            exporting: {
                enabled: true,
                buttons: {
                    contextButton: {
                        enabled: false,
                        menuItems: [
                            'downloadJPEG', // Allow JPEG export
                            'separator',
                            'downloadCSV'   // Allow CSV export
                        ]
                    }
                }
            }
        });

    // Auto Detect Full screen without props
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = document.fullscreenElement !== null;  // 🔹 FIXED
            setIsFullscreenActive(isFull);
            onFullscreenChange?.(isFull);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [onFullscreenChange]);

    // Adjust chart height based on full-screen state
    useEffect(() => {
        if (fitContainer) return;
        const newHeight = isFullscreenActive ? EnlargeHeight(750) : height;
    // console.log(newHeight)
        setChartOptions((prevOptions) => {
            const newOptions = {
                ...prevOptions,
                chart: {
                    ...prevOptions.chart,
                    height: newHeight
                }
            };
            return JSON.parse(JSON.stringify(newOptions)); // deep clone to force re-render
        });
    }, [isFullscreenActive, height, fitContainer]);

    useEffect(() => {
        if (!fitContainer || !containerRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
                setChartOptions(previous => ({
                    ...previous,
                    chart: { ...previous.chart, width, height },
                }));
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [fitContainer]);
    // console.log(height)

    useEffect(() => {
        if (apiData) {
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                series: apiData,
                ...(props || {}),
            }));
        }
    }, [apiData, props]);

    // Export PNG function
    const exportPNG = () => {
        chartRef.current?.chart.exportChart(
            { type: 'image/png', filename: 'chart-png' }, // Exporting options
            {} // Chart options (no changes)
        );
    };

    // Export CSV function
    const exportCSV = () => {
        chartRef.current?.chart.downloadCSV();
    };

    // Pass export functions to parent when ready
    useEffect(() => {
        if (onExportReady) {
            onExportReady({ exportPNG, exportCSV });
        }
    }, [onExportReady]);

    return <div ref={containerRef} style={fitContainer ? { width: '100%', height: '100%', minHeight: 0 } : undefined}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
    </div>;
}
export default HeatmapChart;
