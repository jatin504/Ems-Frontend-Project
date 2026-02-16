import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import HighchartsFullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { EnlargeHeight } from '../../Services/EnlargeWidget';
import '../../App.css';

// Highcharts3D(Highcharts); // Initialize the 3D module
// HighchartsFullScreen(Highcharts);
//  init exporting module
// exporting(Highcharts);
// exportData(Highcharts);


interface  ExportFunction {
  exportPNG : () => void;
  exportCSV : () => void;
}

interface ColumnGraphProps {
  apiData?: Object[];
  height?: Number | string;
  bg?: string;
  category?: string[];
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  onExportReady? : (functions : ExportFunction) => void;
  inFullScreen? : (mode : boolean) => void;
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({ apiData, height = 280, bg, category, legendHeight = 40, xAxisInterval = "auto", props, isFullscreen = false, inFullScreen, onExportReady }) => {
  // console.log("FULL", isFullscreen)
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'column',
      backgroundColor: bg || "transparent",
      height: height,
      // options3d: {
      //   enabled: true,
      //   alpha: 7, // Adjust this to control the tilt
      //   beta: 0,  // Adjust this to control the rotation
      //   depth: 0, // Adjust this to control the depth of the bars
      //   // viewDistance: 25
      // },
      style: {
        fontFamily: 'Montserrat, sans-serif',
        color: "#062D59",
        fontSize : isFullscreen ? EnlargeHeight(12) : 12
      },
      // plotBorderWidth: 1,
      // plotBorderColor: '#DFDFDF',
      plotBorderDashStyle: 'Dash',
      // className : "dashed-border"
    },
    title: {
      text: null
    },
    series: [] as Object[],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        pointWidth: 7,
        pointPadding: 0,
        borderRadius : 0
        // borderWidth : 1,
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      symbolShape: 'square', // Keep this for other chart types, but it won't be applied to column chart symbols
      symbolHeight: 0,
      symbolWidth: 0,
      useHTML: true, // Allow HTML rendering for custom symbols
      itemStyle: {
        overflow: "auto",
        color: '#062D59',
        fontSize: '12px',
      },
      maxHeight: legendHeight,
      labelFormatter: function (this : any) {
        // Create a custom square legend symbol with the background color of each series
        // Here we avoid using the default circle symbol
        return '<span style="width: 10px; height: 10px; display: inline-block; background-color: ' + this.color + '; border-radius: 0;"></span> ' + this.name;
      },
    },    
    tooltip: {
      shared: true,
      // pointFormat: '{series.name}: {point.y}<br/>'
      formatter: function (this : any) {
        var points = this.points.map(function (point : any) {
            return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y + '</b>';
        });
        return points.join('<br/>');
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        enabled: true,
        tickInterval: xAxisInterval,
        style: {
          color: '#062D59',
          fontSize: '14px'
        },
      },
      gridLineDashStyle: 'Dash',
      gridLineWidth: 1, // Ensure grid line width is set
      tickLength: 0,
      gridLineColor: '#DFDFDF',
      lineColor : "#DFDFDF",
      dateTimeLabelFormats: {
        month: '%b %y', // Custom format for months
        year: '%Y' // Format for years if needed
      },
    },
    yAxis: {
      title: {
        text: null
      },
      className: 'dashed-border',
      // gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      tickAmount: !isFullscreen ? 6 : 10,
      lineWidth : 2,
      // lineDashStyle: 'Dash',
      gridLineColor: '#DFDFDF',
      // lineColor : "#DFDFDF",
      labels: {
        style: {
          color: '#062D59',
          fontSize: '14px'
        }
      },
    },
    exporting: {
      enabled: false,
      buttons: {
        contextButton: {
          menuItems: [
            'downloadJPEG', // Allow JPEG export
            'separator',
            'downloadCSV'   // Allow CSV export
          ]
        }
      }
    },
    credits: {
      enabled: false
    }
  });

  // Adjust chart height based on full-screen state
  useEffect(() => {
    // Mode Selection in Widget
    if(inFullScreen) {
      inFullScreen(isFullscreen)
    };

    const newHeight = isFullscreen ? EnlargeHeight(770) : height;
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        height: newHeight
      }
    }));
  }, [isFullscreen, height]);


  useEffect(() => {
    if (apiData) {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: apiData,
        ...props
      }));

      if (category) {
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xAxis: {
            ...prevOptions.xAxis,
            categories: category
          }
        }));
      }
    }
  }, [apiData, category, props]);

  // Export PNG function
    // const exportPNG = () => {
    //   chartRef.current?.chart.exportChart(
    //     { type: 'image/png', filename: 'chart-png' }, // Exporting options
    //     {} // Chart options (no changes)
    //   );
    // };
  
    // Export CSV function
    // const exportCSV = () => {
    //   chartRef.current?.chart.downloadCSV();
    // };
  
    // Pass export functions to parent when ready
    // useEffect(() => {
    //   if (onExportReady) {
    //     onExportReady({ exportPNG, exportCSV });
    //   }
    // }, [onExportReady]);

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
    </>

  );
}
export default ColumnGraph;