import { useEffect, useMemo, useState } from "react";

import {
    Box,
    useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import { useTimeHandle } from "../../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../../types/graphExport/export";

interface Props {
    selectedMeter: string;
}

const EnergyTrendChart = ({ selectedMeter }: Props) => {

    const textColor = useColorModeValue("#1A202C", "#E6E6E6");

    const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

    const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");

    const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

    /* TIME WINDOW */
    const {
        config: timeWindow,
        handleTimeWindowChange,
        handleReset,
    } = useTimeHandle(12, "hour", "avg", [1, "minute"], 60000, {
        timeRange: { type: "relative", relativeType: "currentDaySoFar" },
    });

    const { data, fetchData } = useTimeseriesData();

    const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const tw = timeWindow.timeRange;

        if (tw.type === "absolute") {
            setCurrentDate(new Date(tw.startTs ?? Date.now()));
        }

        if (tw.type === "relative") {
            if (tw.relativeType === "currentDaySoFar") setCurrentDate(new Date());
            if (tw.relativeType === "yesterday") {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setCurrentDate(d);
            }
        }
    }, [timeWindow]);

    useEffect(() => {
        const loadData = () => {
            fetchData({
                devices: { patterns: [], ids: selectedMeter ? [selectedMeter] : [] },

                        keys: [
                            {
                                key: "energy_active_import",
                                alias: "Import Active Energy",
                                keyType: "timeseries",
                                type: "spline",
                            },
                            {
                                key: "energy_active_export",
                                alias: "Export Active Energy",
                                keyType: "timeseries",
                                type: "spline",
                            },
                        ],

                aggregation: timeWindow.aggregation,

                timeRange: timeWindow.timeRange,

                orderBy: "ASC",
            } as any);
        };

        loadData();

        const interval = setInterval(() => {
            loadData();
        }, 60000);

        return () => clearInterval(interval);
    }, [timeWindow, selectedMeter]);

    const formattedDate = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, "0");
        const d = String(currentDate.getDate()).padStart(2, "0");
        return `${y}/${m}/${d}`;
    }, [currentDate]);

    const isToday = useMemo(() => {
        const t = new Date();
        return (
            currentDate.getFullYear() === t.getFullYear() &&
            currentDate.getMonth() === t.getMonth() &&
            currentDate.getDate() === t.getDate()
        );
    }, [currentDate]);

    const applyAbsoluteDay = (date: Date) => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        handleTimeWindowChange({
            aggregation: timeWindow.aggregation,
            orderBy: "ASC",
            timeRange: { type: "absolute", startTs: start.getTime(), endTs: end.getTime() },
        });
    };

    const goPrevDay = () => {
        setCurrentDate((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);
            applyAbsoluteDay(d);
            return d;
        });
    };

    const goNextDay = () => {
        if (isToday) return;
        setCurrentDate((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 1);
            const today = new Date();
            const reachedToday = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
            if (reachedToday) handleReset();
            else applyAbsoluteDay(d);
            return d;
        });
    };

    const seriesForChart = useMemo(() => {
        if (data && typeof data === "object") {
            const series: any[] = [];
            Object.entries(data).forEach(([id, deviceObj]: any) => {
                if (!deviceObj) return;
                Object.entries(deviceObj).forEach(([metric, points]: any) => {
                    if (Array.isArray(points)) {
                        series.push({
                            type: "spline",
                            name: metric,
                            data: points
                                .filter((p: any) => p && p.ts && p.value !== null && p.value !== undefined && !isNaN(Number(p.value)))
                                .map((p: any) => [Number(p.ts), Number(p.value)])
                                .sort((a: any, b: any) => a[0] - b[0]),
                            marker: { enabled: false },
                        });
                    }
                });
            });

            return series.length ? series : [{}];
        }

        return [{}];
    }, [data]);

    return (
        <GraphLayout
            title={
                <Box display="flex" alignItems="center" w="100%">
                    <Box fontWeight="600">Energy Trend</Box>
                    <Box
                        ml="95px"
                        display="flex"
                        alignItems="center"
                        bg={useColorModeValue("gray.100", "gray.700")}
                        borderRadius="6px"
                        px={2}
                        height="22px"
                        gap={2}
                    >
                        <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>
                        <Box fontSize="11px" fontWeight="600" minW="78px" textAlign="center">{formattedDate}</Box>
                        <Box cursor={isToday ? "not-allowed" : "pointer"} opacity={isToday ? 0.35 : 1} fontSize="12px" onClick={goNextDay}>›</Box>
                    </Box>
                </Box>
            }
            width={["608px"]}
            height="384px"
            fullScreen
            timeWindow
            onTimeWindowChange={handleTimeWindowChange}
            onReset={handleReset}
            onExport={exportFunctions}
        >
            <SplineGraph apiData={seriesForChart} height={300} onExportReady={setExportFunctions} props={{
                plotOptions: {
                    series: { connectNulls: false, turboThreshold: 5000 },
                    spline: { lineWidth: 2, marker: { enabled: false } },
                },
                yAxis: {
                    tickAmount: 6,
                    labels: { style: { color: textColor } },
                    gridLineColor: gridColor,
                },
                xAxis: {
                    type: "datetime",
                    labels: { style: { color: subTextColor } },
                    lineColor: axisLineColor,
                    gridLineColor: gridColor,
                    gridLineDashStyle: "ShortDot",
                    gridLineWidth: 1,
                },
                legend: { align: "center", verticalAlign: "bottom", layout: "horizontal", itemStyle: { color: textColor } },
                tooltip: { shared: true, backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"), style: { color: textColor } },
            }} />
        </GraphLayout>
    );
};

export default EnergyTrendChart;
