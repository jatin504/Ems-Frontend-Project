import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useState } from "react";
import LineGraph from "../../Graphs/LineGraph";
import ColumnGraph from "../../Graphs/ColumnGraph";
import AreasplineGraph from "../../Graphs/RevampCharts/AreasplineGraph";
import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import { transformToHighchartsTimeSeries } from "../../../Services/APIDataFormatter/TimeseriesGraphs";

const CHART_COMPONENTS = {
    spline : LineGraph,
    line : LineGraph,
    areaspline : AreasplineGraph,
    column : ColumnGraph,
    bar : ColumnGraph,
        
    // Add more: PieGraph, Gauge, etc.
} as any;

const GraphWidgetRenderer: React.FC<{ config: any; data: any }> = ({ config, data = [] }) => {
    const [exportFunctions, setExportFunctions] = useState<any | null>(null);

    const graphType = config?.graph?.type || "spline";
    const GraphComponent = CHART_COMPONENTS[graphType];

    const panelBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const chartTheme = useColorModeValue("light", "dark");
    const axisColor = useColorModeValue("rgba(0,0,0,0.6)", "rgba(255,255,255,0.85)");
    const subTextColor = useColorModeValue("rgba(0,0,0,0.45)", "rgba(255,255,255,0.65)");
    const gridColor = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.04)");

    const configuredProps = config?.props?.chartProps || {};
    const mergedChartProps = {
        ...configuredProps,
        chartTheme,
        yAxis: {
            ...(configuredProps.yAxis || {}),
            labels: { 
              ...(configuredProps.yAxis?.labels || {}), 
              enabled: false,
            },
            gridLineColor: configuredProps.yAxis?.gridLineColor || gridColor,
        },
        xAxis: {
            ...(configuredProps.xAxis || {}),
            labels: { ...(configuredProps.xAxis?.labels || {}), style: { color: subTextColor } },
            lineColor: configuredProps.xAxis?.lineColor || axisColor,
            gridLineColor: configuredProps.xAxis?.gridLineColor || gridColor,
        },
        legend: {
            ...(configuredProps.legend || {}),
            itemStyle: { ...(configuredProps.legend?.itemStyle || {}), color: textColor },
        },
    };

    const apiData = transformToHighchartsTimeSeries(data || [], config?.dataSource?.keys || []);

    // Apply parameter-specific chart types to each series
    const parameterChartTypes = config?.parameterChartTypes || {};
    const apiDataWithChartTypes = (apiData as any[])?.map((series: any) => {
      const seriesName = series.name || "";
      const paramKey = Object.keys(parameterChartTypes).find(
        (key) => seriesName.includes(key) || seriesName === key
      );
      
      if (paramKey && parameterChartTypes[paramKey]) {
        return {
          ...series,
          type: parameterChartTypes[paramKey],
        };
      }
      
      return series;
    }) || [];

    if (!GraphComponent) {
        return (
            <Box
                h="100%"
                w="100%"
                bg={panelBg}
                color={textColor}
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text>No chart available for type: {graphType}</Text>
            </Box>
        );
    }

    return (
        <Box
            h="100%"
            w="100%"
            bg={panelBg}
            color={textColor}
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            display="flex"
            flexDirection="column"
        >
            <GraphLayout
                title={config?.title}
                titleLengthSVG={config?.titleLengthSVG || 1000}
                width={["100%"]}
                height="100%"
                fullScreen={true}
                onExport={exportFunctions}
            >
                <GraphComponent
                    height={config?.props?.height}
                    props={mergedChartProps}
                    apiData={apiDataWithChartTypes}
                    onExportReady={setExportFunctions}
                />
            </GraphLayout>
        </Box>
    );
};

export default GraphWidgetRenderer;