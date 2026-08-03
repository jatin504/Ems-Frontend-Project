import React, { useEffect, useMemo, useState } from "react";
import { Box, HStack, VStack, useColorModeValue, useMediaQuery } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

type MetricType = "Power" | "Voltage";

interface HeatmapData {
    series: any[];
    xAxisCategories: string[];
    yAxisCategories: string[];
    lastUpdateTime: string;
}

interface WidgetPoint {
    ts: number;
    value: number;
}

interface WidgetData {
    [deviceID: string]: {
        [keyName: string]: WidgetPoint[];
    };
}

const SMBvsStringGraph: React.FC = () => {
    const metricOptions = [
        { label: "String Amps", value: "Power" },
        { label: "MPPT Voltage (V)", value: "Voltage" },
    ];

    const [metric, setMetric] = useState<MetricType>("Power");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isShortScreen] = useMediaQuery("(max-width: 1400px)");

    const {
        config: timeWindowConfig,
        handleTimeWindowChange,
        handleReset,
    } = useTimeHandle(
        12,
        "hour",
        "avg",
        [15, "minute"],
        60000,
        {
            timeRange: {
                type: "relative",
                relativeType: "currentDaySoFar",
                interval: 1,
                intervalType: "minute",
            },
        }
    );

    const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
    const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
    const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

    const dataSource = {
        devices: {
            patterns: ["_inverter_inverter_"],
            ids: [],
        },
        keys:
            metric === "Power"
                ? Array.from({ length: 24 }, (_, i) => ({
                    key: `string_${i + 1}_current`,
                    alias: `string_${i + 1}_current`,
                    keyType: "common",
                    type: "spline",
                }))
                : Array.from({ length: 24 }, (_, i) => ({
                    key: `mppt_${i + 1}_voltage`,
                    alias: `mppt_${i + 1}_voltage`,
                    keyType: "common",
                    type: "spline",
                })),
        aggregation: timeWindowConfig.aggregation,
        timeRange: timeWindowConfig.timeRange,
        orderBy: timeWindowConfig.orderBy,
    };

    const { data, fetchData } = useTimeseriesData();

    useEffect(() => {
        fetchData(dataSource as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeWindowConfig, metric]);

    const currentHeatmapData: HeatmapData | null = useMemo(() => {

        const widgetData = data as WidgetData | null;

        if (!widgetData) return null;

        // ===== DEVICE LIST =====
        const deviceList = Object.keys(widgetData).sort((a, b) => {

            const aNum = Number(a.match(/\d+$/)?.[0] || 0);
            const bNum = Number(b.match(/\d+$/)?.[0] || 0);

            return aNum - bNum;

        });

        // ===== X AXIS =====
        const xAxisCategories: string[] = [];

        // ===== Y AXIS =====
        let yAxisCategories: string[] = [];

        // ===== SERIES =====
        const rawPoints: { x: number; y: number; value: number }[] = [];

        // ===== FIND DYNAMIC TAGS =====
        Object.values(widgetData).forEach((device: any) => {

            Object.keys(device).forEach((key) => {

                const lower = key.toLowerCase();

                const isPowerTag =
                    metric === "Power" &&
                    lower.startsWith("string_") &&
                    lower.endsWith("_current");

                const isVoltageTag =
                    metric === "Voltage" &&
                    lower.startsWith("mppt_") &&
                    lower.endsWith("_voltage");

                if (isPowerTag || isVoltageTag) {

                    if (!yAxisCategories.includes(key)) {
                        yAxisCategories.push(key);
                    }

                }

            });

        });

        yAxisCategories.sort((a, b) => {

            const aNum = Number(a.match(/\d+/)?.[0] || 0);
            const bNum = Number(b.match(/\d+/)?.[0] || 0);

            return aNum - bNum;

        });

        // (removed visibleYAxisCategories — use full yAxisCategories and control view via yAxis max)

        // ===== BUILD HEATMAP =====
        deviceList.forEach((deviceId, xIndex) => {

            const suffix = deviceId.split("_").pop();

            xAxisCategories.push(`INV-${suffix}`);

            const deviceData = widgetData[deviceId];

            yAxisCategories.forEach((tag, yIndex) => {

                const value = Number(deviceData?.[tag]?.[0]?.value ?? 0);

                rawPoints.push({
                    x: xIndex,
                    y: yIndex,
                    value,
                });

            });

        });

        return {
            series: [
                {
                    type: "heatmap",
                    borderWidth: 1,
                    data: rawPoints.map((p) => [
                        p.x,
                        p.y,
                        p.value,
                    ]),
                },
            ],
            xAxisCategories,
            yAxisCategories,
            lastUpdateTime: String(Date.now()),
        };

    }, [data, metric]);

    return (
        <GraphLayout
            title="SMB vs String Heatmap"
            titleLengthSVG={70}
            titleLengthLongSVG={1680}
            width={["100%"]}
            height={"100%"}
            fullScreen
            timeWindow={true}
            mt="2"
            onTimeWindowChange={(config) => handleTimeWindowChange(config)}
            onReset={handleReset}
        >
            <VStack width={"100%"} height={"100%"} spacing={2} align="stretch">
                <HStack width={"100%"} justify={"flex-end"} mb={1}>
                    <HStack>
                        <Select
                            isMulti={false}
                            placeholder="Select Parameter"
                            closeMenuOnSelect
                            variant="flushed"
                            focusBorderColor="#062D59"
                            size="sm"
                            chakraStyles={{
                                valueContainer: (provided) => ({
                                    ...provided,
                                    fontSize: "10px",
                                    width: "160px",
                                }),
                                control: (prov) => ({
                                    ...prov,
                                    height: "10px",
                                    minBlockSize: "20px",
                                }),
                                menuList: (provided) => ({
                                    ...provided,
                                    maxHeight: "80px",
                                }),
                                option: (prov) => ({
                                    ...prov,
                                    height: "18px",
                                    fontSize: "10px",
                                }),
                            }}
                            options={metricOptions}
                            onChange={(e) => {
                                const val = (e?.value as MetricType) || "Power";
                                setMetric(val);
                            }}
                            selectedOptionColorScheme="green"
                            value={metricOptions.find((option) => option.value === metric)}
                        />
                    </HStack>
                </HStack>

                <Box width={"100%"} flex="1" minH="180px" maxH="420px" p="4px">
                    {currentHeatmapData && currentHeatmapData.series && (
                        <HeatmapChart
                            height={isFullscreen ? 600 : 320}
                            apiData={currentHeatmapData.series}
                            isFullscreen={isFullscreen}
                            onFullscreenChange={setIsFullscreen}
                            props={{
                                xAxis: {
                                    type: "category",
                                    categories: currentHeatmapData.xAxisCategories,
                                    labels: { style: { color: axisLabelColor, fontSize: "9px" } },
                                },
                                yAxis: {
                                    title: null,

                                    min: 0,

                                    max:
                                        isFullscreen
                                            ? currentHeatmapData.yAxisCategories.length - 1
                                            : 9,

                                    categories: currentHeatmapData.yAxisCategories.map((k) =>
                                        k
                                            .replace("string_", "String_")
                                            .replace("_current", "")
                                            .replace("mppt_", "MPPT_")
                                            .replace("_voltage", "")
                                    ),

                                    labels: {
                                        style: {
                                            color: axisLabelColor,
                                            fontSize: "9px",
                                        },
                                    },

                                    crosshair: false,
                                    gridLineWidth: 0,
                                },
                                tooltip: {
                                    backgroundColor: tooltipBgColor,
                                    style: { color: tooltipTextColor, fontSize: "11px" },
                                    formatter: function (this: any) {
                                        const inv =
                                            this.series.xAxis.categories[this.point.x];

                                        const tag =
                                            currentHeatmapData?.yAxisCategories?.[this.point.y];

                                        return `
  <b>${inv}</b><br/>
  ${tag}<br/>
  <b>${this.point.value}</b>
`;
                                    },
                                },
                            }}
                        />
                    )}
                </Box>
            </VStack>
        </GraphLayout>
    );
};

export default SMBvsStringGraph;