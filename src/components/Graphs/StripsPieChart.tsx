import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';


//  init exporting module
exporting(Highcharts);
exportData(Highcharts);


interface  ExportFunction {
  exportPNG : () => void;
  exportCSV : () => void;
}

interface StripsPieChartType {
    apiData? : number[];
    names? : string[];
    height? : number;
    width? : number;
    props? : any;
    color? : string[];
    onExportReady? : (functions : ExportFunction) => void;
}

const StripsPieChart: React.FC <StripsPieChartType> = ({apiData, names, height=250, width, props, onExportReady, color=["#704199", "#0086CC", "#66D1C9", "#F8931F",'#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
    '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
    '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
    '#03c69b', '#00f194']}) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);

    const [chartOptions, setChartOptions] = useState({
            chart: {
                type: 'pie',
                custom: {},
                height : height,
                width : width || "",
                backgroundColor : "transparent"
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            title: {
                text: ''
            },
            // subtitle: {
            //     text: 'Source: <a href="https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport">SSB</a>'
            // },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
            },
            legend: {
                enabled: false
            },
            colors : ["#704199", "#0086CC", "#66D1C9", "#F8931F",'#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
                  '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
                  '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
                  '#03c69b', '#00f194'],
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderRadius: 8,
                    dataLabels: [{
                        enabled: false,
                        distance: 20,
                        format: '{point.name}'
                    }, {
                        enabled: false,
                        distance: -15,
                        format: '{point.percentage:.0f}%',
                        style: {
                            fontSize: '0.9em'
                        }
                    }],
                    showInLegend: false
                }
            },
            series: [] as Object[],
            credits : {
                enabled : false
            },
            exporting : {
                enabled : false
            }
        });

        useEffect(() => {
            if (apiData && names) {
                const seriesData = apiData.map((value: number, index: number) => ({
                    name: names[index],
                    y: value,
                    color : color[index]
                }));
    
                setChartOptions((prevOptions) => ({
                    ...prevOptions,
                    series: [{
                        name: 'Data',
                        innerSize : '55%',
                        colorByPoint: true,
                        data: seriesData
                    }]
                }));
            }
            if(props) {
                setChartOptions((preOptions) => ({
                    ...preOptions,
                    ...(props || {})
                }))
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
        

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default StripsPieChart;