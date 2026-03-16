import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import { EnlargeHeight } from '../../Services/EnlargeWidget';
import '../../App.css';

//  init exporting module
// exporting(Highcharts);
// exportData(Highcharts);

interface  ExportFunction {
    exportPNG : () => void;
    exportCSV : () => void;
  }

interface LineGraphProps {
    apiData?: Object[];
    height?: number | string;
    bg?: string;
    legendHeight? : number;
    xAxisInterval? : number | string;
    props?: any;
    isFullscreen? : boolean;
    onExportReady? : (functions : ExportFunction) => void;

}

const LineGraph = React.forwardRef<HighchartsReact.RefObject, LineGraphProps>(({ apiData, height = 240, xAxisInterval="auto", legendHeight=45, bg, props, isFullscreen=false, onExportReady }, ref) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreenActive, setIsFullscreenActive] = useState(false);


    const [chartOptions, setChartOptions] = useState({
        chart: {
            backgroundColor: bg || 'transparent',
            height: height,
            zoomType: 'x',
            style: {
                fontFamily: 'Montserrat, sans-serif',
                color: "#062D59"
              },
            plotBorderWidth: 1,
            plotBorderColor: '#DFDFDF',
            plotBorderDashStyle: 'Dash',
            className : "dashed-border",
            
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            crosshair: true,
            tickInterval: xAxisInterval,
            labels : {
                enabled : true,
                style: {
                    color: '#062D59',
                    fontSize: '12px'
                }
                // formatter: function(this : any) {
                //     return Highcharts.dateFormat('%H:%M', this.value + (5.5 * 3600 * 1000)); // Add 5.5 hours (IST) to the timestamp
                // }
            },
            dateTimeLabelFormats: {
                month: '%b %y', // Custom format for months
                year: '%Y' // Format for years if needed
            },
            tickLength: 0,
            
        },
        yAxis: {
            title: {
                text: '',
            },
            crosshair: true,
            labels: {
                enabled: true,
                style: {
                    color: '#062D59',
                    fontSize: '12px'
                }
            },
            tickAmount: !isFullscreen ? 6 : 10,
            ...(props?.yAxis || {})
        },
        tooltip: {
            shared: true,
            // pointFormat: '{series.name}: {point.y}<br/>'//Total: {point.stackTotal}
            // valueSuffix: ' unit',
            // headerFormat: '<b>{series.name}</b><br>',
            // formatter: function (this : any) {
            //     var date = this.x;
            //     var formattedDate = Highcharts.dateFormat('%Y-%m-%d %H:%M', date);
            //     var points = this.points.map(function (point : any) {
            //         return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y + '</b>';
            //     });
            //     return '<b>' + formattedDate + '</b><br/>' + points.join('<br/>');
            // }
        },
        series: apiData || [],
        credits: {
            enabled: false,
        },
        label : {
            enabled : true,
            style: {
                color: '#062D59',
                fontSize: '12px'
            }
        },
        legend : {
            maxHeight : legendHeight,
            useHTML : true,
            itemStyle : {
                // display:"inline-block",
                overflow : "auto",
                color: '#062D59',
                fontSize: '12px'
            },
            symbolHeight: 0,    // This helps to remove default legends
            symbolWidth: 0, // This helps to remove default legends
            labelFormatter: function(this : any) {
                return '<span style="display:inline-block;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                   '<circle opacity="0.25" cx="8" cy="11" r="8" fill="' + this.color + '"/>' +
                   '<circle cx="8" cy="11" r="3.5" fill="' + this.color + '" stroke="white"/>' +
                   '</svg></span> ' + this.name;
            },
            navigation: {
                enabled: true,
            }   
        },
        exporting : {
            enabled : true,
            buttons: {
                contextButton: {
                    enabled : false,
                    menuItems: [
                        'downloadJPEG', // Allow JPEG export
                        'separator', 
                        'downloadCSV'   // Allow CSV export
                    ]
                }
            }
        }
    });

    // Auto Detect Full screen withhout props
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !(document.fullscreenElement === containerRef.current);
            setIsFullscreenActive(isFull);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);


    // Adjust chart height based on full-screen state
    useEffect(() => {
        const newHeight = isFullscreenActive ? EnlargeHeight(750) : height;
        setChartOptions((prevOptions) => ({
            ...prevOptions,
            chart: {
                ...prevOptions.chart,
                height: newHeight,
                overflow : "auto"
            }
        }));
    }, [isFullscreenActive, height]);
    
    useEffect(() => {
        if (props) {
            console.log("PROPS: ", props)
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                ...(props),
            }));
        }
    }, [props]);
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
    // const exportPNG = () => {
    //     chartRef.current?.chart.exportChart(
    //       { type: 'image/png', filename: 'chart-png' }, // Exporting options
    //       {} // Chart options (no changes)
    //     );
    //   };
    
      // Export CSV function
    //   const exportCSV = () => {
    //     chartRef.current?.chart.downloadCSV();
    //   };
    
    //   // Pass export functions to parent when ready
    //   useEffect(() => {
    //     if (onExportReady) {
    //       onExportReady({ exportPNG, exportCSV });
    //     }
    //   }, [onExportReady]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={ref || chartRef || containerRef} />;
});

export default LineGraph;